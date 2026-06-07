import { db, isFirebaseEnabled } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { mockSubjects } from '../data/subjects';
import { mockLessons, addLessonToSubject as localAddLesson } from '../data/lessons';
import { getQuizForLesson as localGetQuiz, addQuestionToQuiz as localAddQuestion } from '../data/quizzes';

// Helper to map Firestore lesson structure to frontend-compatible structure
const mapLesson = (l) => {
    if (!l) return null;
    return {
        ...l,
        pdfUrl: l.pdf?.fileUrl || l.pdfUrl || "#",
        lessonVideo: {
            provider: l.video?.provider || l.lessonVideo?.provider || "youtube",
            videoId: l.video?.videoId || l.lessonVideo?.videoId || "",
            isProtected: l.video?.isProtected || l.lessonVideo?.isProtected || false,
            protectionNote: l.video?.protectionNote || l.lessonVideo?.protectionNote || ""
        },
        video: l.video || {
            provider: l.lessonVideo?.provider || "youtube",
            videoId: l.lessonVideo?.videoId || "",
            isProtected: l.lessonVideo?.isProtected || false,
            protectionNote: l.lessonVideo?.protectionNote || "MVP only"
        },
        pdf: l.pdf || {
            title: l.pdf?.title || "ملخص الدرس",
            fileUrl: l.pdf?.fileUrl || l.pdfUrl || "#",
            storagePath: l.pdf?.storagePath || ""
        }
    };
};

// Helper to map Firestore quiz structure to frontend-compatible structure
const mapQuiz = (qData) => {
    if (!qData) return null;
    const mappedQuestions = (qData.questions || []).map(q => ({
        id: q.id,
        text: q.question || q.text || "",
        options: q.options || [],
        correctAnswer: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : q.correctAnswer,
        explanation: q.explanation || "شرح الإجابة"
    }));
    return {
        ...qData,
        questions: mappedQuestions
    };
};

export const contentService = {
    // === Core flat API methods ===

    // 1. getSubjects(): where isActive == true + sorted by order
    getSubjects: async () => {
        if (isFirebaseEnabled) {
            try {
                const subjectsCol = collection(db, 'subjects');
                // Enforce active subjects only to comply with security rules
                const q = query(subjectsCol, where("isActive", "==", true));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const list = [];
                    snapshot.forEach(doc => {
                        list.push({ id: doc.id, ...doc.data() });
                    });
                    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn("Firestore getSubjects failed. Falling back to mock data.", error);
                }
            }
        }
        return mockSubjects.filter(s => s.isActive !== false);
    },

    // 2. getSubjectById(subjectId)
    getSubjectById: async (subjectId) => {
        if (isFirebaseEnabled) {
            try {
                const subjectDocRef = doc(db, 'subjects', subjectId);
                const subjectDoc = await getDoc(subjectDocRef);
                if (subjectDoc.exists()) {
                    const data = subjectDoc.data();
                    if (data.isActive !== false) {
                        return { id: subjectDoc.id, ...data };
                    }
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn(`Firestore getSubjectById(${subjectId}) failed. Falling back to mock data.`, error);
                }
            }
        }
        return mockSubjects.find(s => s.id === subjectId) || null;
    },

    // For backwards compatibility
    getSubject: async (subjectId) => {
        return contentService.getSubjectById(subjectId);
    },

    // 3. getUnitsBySubject(subjectId): where subjectId == value + isActive == true + sorted by order
    getUnitsBySubject: async (subjectId) => {
        if (isFirebaseEnabled) {
            try {
                const unitsCol = collection(db, 'units');
                // Enforce subjectId and isActive == true
                const q = query(unitsCol, where("subjectId", "==", subjectId), where("isActive", "==", true));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const list = [];
                    snapshot.forEach(doc => {
                        list.push({ id: doc.id, ...doc.data() });
                    });
                    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn(`Firestore getUnitsBySubject(${subjectId}) failed. Falling back to mock.`, error);
                }
            }
        }
        
        // Fallback mapping from mockLessons
        const mockUnits = mockLessons[subjectId] || [];
        return mockUnits.map((u, i) => ({
            id: u.unitId,
            subjectId,
            title: u.unitTitle,
            description: "",
            order: i + 1,
            isActive: true
        }));
    },

    // 4. getLessonsBySubject(subjectId): where subjectId == value + isActive == true + sorted by order
    getLessonsBySubject: async (subjectId) => {
        if (isFirebaseEnabled) {
            try {
                const lessonsCol = collection(db, 'lessons');
                const q = query(lessonsCol, where("subjectId", "==", subjectId), where("isActive", "==", true));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const list = [];
                    snapshot.forEach(doc => {
                        list.push(mapLesson({ id: doc.id, ...doc.data() }));
                    });
                    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn(`Firestore getLessonsBySubject(${subjectId}) failed. Falling back to mock.`, error);
                }
            }
        }
        
        // Fallback mapping from mockLessons
        const mockUnits = mockLessons[subjectId] || [];
        const list = [];
        mockUnits.forEach((unit, uIdx) => {
            unit.lessons.forEach((l, lIdx) => {
                list.push(mapLesson({
                    id: l.id,
                    subjectId,
                    unitId: unit.unitId,
                    title: l.title,
                    description: l.description || '',
                    order: (uIdx + 1) * 100 + lIdx,
                    isFree: l.isFree,
                    isActive: true,
                    video: {
                        provider: l.lessonVideo?.provider || "youtube",
                        videoId: l.lessonVideo?.videoId || "",
                        isProtected: l.lessonVideo?.isProtected || false,
                        protectionNote: l.lessonVideo?.protectionNote || ""
                    },
                    pdf: {
                        title: "ملخص الدرس",
                        fileUrl: l.pdfUrl || "#",
                        storagePath: ""
                    }
                }));
            });
        });
        return list;
    },

    // 5. getLessonsByUnit(unitId)
    getLessonsByUnit: async (unitId) => {
        if (isFirebaseEnabled) {
            try {
                const lessonsCol = collection(db, 'lessons');
                const q = query(lessonsCol, where("unitId", "==", unitId), where("isActive", "==", true));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const list = [];
                    snapshot.forEach(doc => {
                        list.push(mapLesson({ id: doc.id, ...doc.data() }));
                    });
                    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn(`Firestore getLessonsByUnit(${unitId}) failed. Falling back to mock.`, error);
                }
            }
        }
        
        // Fallback by extracting subjectId from unitId
        const subjectId = unitId.split('-')[0];
        const allLessons = await contentService.getLessonsBySubject(subjectId);
        return allLessons.filter(l => l.unitId === unitId);
    },

    // 6. getLessonById(lessonId)
    getLessonById: async (lessonId) => {
        if (isFirebaseEnabled) {
            try {
                const lessonDocRef = doc(db, 'lessons', lessonId);
                const lessonDoc = await getDoc(lessonDocRef);
                if (lessonDoc.exists()) {
                    const data = lessonDoc.data();
                    if (data.isActive !== false) {
                        return mapLesson({ id: lessonDoc.id, ...data });
                    }
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn(`Firestore getLessonById(${lessonId}) failed. Falling back to mock.`, error);
                }
            }
        }
        
        // Fallback find in mockLessons
        for (const subId of mockSubjects.map(s => s.id)) {
            const units = mockLessons[subId] || [];
            for (const u of units) {
                const found = u.lessons.find(l => l.id === lessonId);
                if (found) {
                    return mapLesson({
                        id: found.id,
                        subjectId: subId,
                        unitId: u.unitId,
                        title: found.title,
                        description: found.description || '',
                        order: 1,
                        isFree: found.isFree,
                        isActive: true,
                        video: {
                            provider: found.lessonVideo?.provider || "youtube",
                            videoId: found.lessonVideo?.videoId || "",
                            isProtected: found.lessonVideo?.isProtected || false,
                            protectionNote: found.lessonVideo?.protectionNote || ""
                        },
                        pdf: {
                            title: "ملخص الدرس",
                            fileUrl: found.pdfUrl || "#",
                            storagePath: ""
                        }
                    });
                }
            }
        }
        return null;
    },

    // 7. getQuizByLessonId(lessonId)
    getQuizByLessonId: async (lessonId) => {
        if (isFirebaseEnabled) {
            try {
                const quizId = `quiz-${lessonId}`;
                const quizDocRef = doc(db, 'quizzes', quizId);
                const quizDoc = await getDoc(quizDocRef);
                if (quizDoc.exists()) {
                    const data = quizDoc.data();
                    if (data.isActive !== false) {
                        return mapQuiz({ id: quizDoc.id, ...data });
                    }
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn(`Firestore getQuizByLessonId(${lessonId}) failed. Falling back to mock.`, error);
                }
            }
        }
        return mapQuiz(localGetQuiz(lessonId));
    },

    // For backwards compatibility
    getQuizForLesson: async (lessonId) => {
        return contentService.getQuizByLessonId(lessonId);
    },

    // Backwards compatible tree-loader
    getLessonsForSubject: async (subjectId) => {
        try {
            const units = await contentService.getUnitsBySubject(subjectId);
            const lessons = await contentService.getLessonsBySubject(subjectId);
            
            return units.map(unit => ({
                unitId: unit.id,
                unitTitle: unit.title,
                lessons: lessons
                    .filter(l => l.unitId === unit.id)
                    .map(l => ({
                        id: l.id,
                        title: l.title,
                        isFree: l.isFree,
                        description: l.description,
                        pdfUrl: l.pdfUrl || "#",
                        lessonVideo: {
                            provider: l.lessonVideo?.provider || "youtube",
                            videoId: l.lessonVideo?.videoId || "",
                            isProtected: l.lessonVideo?.isProtected || false,
                            protectionNote: l.lessonVideo?.protectionNote || ""
                        }
                    }))
            }));
        } catch (error) {
            if (import.meta.env.DEV) {
                console.warn(`getLessonsForSubject(${subjectId}) grouping failed. Returning mock.`, error);
            }
            const mockUnits = mockLessons[subjectId] || [];
            return mockUnits.map(unit => ({
                unitId: unit.unitId,
                unitTitle: unit.unitTitle,
                lessons: unit.lessons.map(l => ({
                    id: l.id,
                    title: l.title,
                    isFree: l.isFree,
                    description: l.description || "",
                    pdfUrl: l.pdfUrl || "#",
                    lessonVideo: {
                        provider: l.lessonVideo?.provider || "youtube",
                        videoId: l.lessonVideo?.videoId || "",
                        isProtected: l.lessonVideo?.isProtected || false,
                        protectionNote: l.lessonVideo?.protectionNote || ""
                    }
                }))
            }));
        }
    },

    // Admin helpers refactored to flat collections
    addLessonToSubject: async (subjectId, unitId, newLesson) => {
        if (isFirebaseEnabled) {
            try {
                const lessonDocRef = doc(db, 'lessons', newLesson.id);
                const lessonDoc = {
                    id: newLesson.id,
                    subjectId: subjectId,
                    unitId: unitId,
                    title: newLesson.title,
                    description: newLesson.description || '',
                    order: Date.now(), // simple incremental order
                    isFree: newLesson.isFree,
                    isActive: true,
                    video: {
                        provider: newLesson.lessonVideo?.provider || "youtube",
                        videoId: newLesson.lessonVideo?.videoId || "",
                        isProtected: newLesson.lessonVideo?.isProtected || false,
                        protectionNote: newLesson.lessonVideo?.protectionNote || ""
                    },
                    pdf: {
                        title: "ملخص الدرس",
                        fileUrl: newLesson.pdfUrl || "#",
                        storagePath: ""
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                await setDoc(lessonDocRef, lessonDoc, { merge: true });
                return { success: true };
            } catch (error) {
                console.error("Firebase addLessonToSubject error:", error);
                return { success: false, error: error.message };
            }
        } else {
            return localAddLesson(subjectId, unitId, newLesson);
        }
    },

    addQuestionToQuiz: async (lessonId, question) => {
        if (isFirebaseEnabled) {
            try {
                const quizId = `quiz-${lessonId}`;
                const quizDocRef = doc(db, 'quizzes', quizId);
                const quizDoc = await getDoc(quizDocRef);
                
                let quizData = {
                    id: quizId,
                    lessonId: lessonId,
                    subjectId: lessonId.split('-')[0],
                    title: `اختبار تقييمي مخصص للدرس`,
                    isActive: true,
                    questions: []
                };
                
                if (quizDoc.exists()) {
                    quizData = quizDoc.data();
                }
                
                const questionsList = quizData.questions || [];
                const newId = "q" + (questionsList.length + 1);
                
                questionsList.push({
                    id: newId,
                    question: question.text,
                    options: question.options,
                    correctAnswerIndex: question.correctAnswer,
                    explanation: "شرح الإجابة"
                });
                
                quizData.questions = questionsList;
                await setDoc(quizDocRef, quizData, { merge: true });
                return { success: true };
            } catch (error) {
                console.error("Firebase addQuestionToQuiz error:", error);
                return { success: false, error: error.message };
            }
        } else {
            return localAddQuestion(lessonId, question);
        }
    }
};

