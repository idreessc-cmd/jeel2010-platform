import { db, isFirebaseEnabled } from '../config/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { mockSubjects } from '../data/subjects';
import { mockLessons, addLessonToSubject as localAddLesson } from '../data/lessons';
import { getQuizForLesson as localGetQuiz, addQuestionToQuiz as localAddQuestion } from '../data/quizzes';

export const contentService = {
    // 1. Fetch all subjects
    getSubjects: async () => {
        if (isFirebaseEnabled) {
            try {
                const subjectsCol = collection(db, 'subjects');
                const snapshot = await getDocs(subjectsCol);
                if (!snapshot.empty) {
                    const list = [];
                    snapshot.forEach(doc => {
                        list.push({ id: doc.id, ...doc.data() });
                    });
                    return list;
                }
            } catch (error) {
                console.error("Firebase getSubjects error, falling back to mock:", error);
            }
        }
        return mockSubjects;
    },

    // 2. Fetch single subject details
    getSubject: async (subjectId) => {
        if (isFirebaseEnabled) {
            try {
                const subjectDocRef = doc(db, 'subjects', subjectId);
                const subjectDoc = await getDoc(subjectDocRef);
                if (subjectDoc.exists()) {
                    return { id: subjectDoc.id, ...subjectDoc.data() };
                }
            } catch (error) {
                console.error(`Firebase getSubject(${subjectId}) error, falling back to mock:`, error);
            }
        }
        return mockSubjects.find(s => s.id === subjectId) || null;
    },

    // 3. Fetch lessons (units) for a subject
    getLessonsForSubject: async (subjectId) => {
        if (isFirebaseEnabled) {
            try {
                const lessonsDocRef = doc(db, 'lessons', subjectId);
                const lessonsDoc = await getDoc(lessonsDocRef);
                if (lessonsDoc.exists()) {
                    return lessonsDoc.data().units || [];
                }
            } catch (error) {
                console.error(`Firebase getLessonsForSubject(${subjectId}) error, falling back to mock:`, error);
            }
        }
        return mockLessons[subjectId] || [];
    },

    // 4. Fetch quiz for a lesson
    getQuizForLesson: async (lessonId) => {
        if (isFirebaseEnabled) {
            try {
                const quizDocRef = doc(db, 'quizzes', lessonId);
                const quizDoc = await getDoc(quizDocRef);
                if (quizDoc.exists()) {
                    return quizDoc.data();
                }
            } catch (error) {
                console.error(`Firebase getQuizForLesson(${lessonId}) error, falling back to mock:`, error);
            }
        }
        return localGetQuiz(lessonId);
    },

    // 5. Admin: Add lesson to a subject
    addLessonToSubject: async (subjectId, unitId, newLesson) => {
        if (isFirebaseEnabled) {
            try {
                const lessonsDocRef = doc(db, 'lessons', subjectId);
                const lessonsDoc = await getDoc(lessonsDocRef);
                let units = [];
                if (lessonsDoc.exists()) {
                    units = lessonsDoc.data().units || [];
                }
                
                const unitIndex = units.findIndex(u => u.unitId === unitId);
                if (unitIndex !== -1) {
                    units[unitIndex].lessons.push(newLesson);
                } else {
                    units.push({
                        unitId: unitId,
                        unitTitle: `الوحدة: ${unitId.replace(/-/g, ' ')}`,
                        lessons: [newLesson]
                    });
                }
                
                await setDoc(lessonsDocRef, { units });
                return { success: true };
            } catch (error) {
                console.error("Firebase addLessonToSubject error:", error);
                return { success: false, error: error.message };
            }
        } else {
            return localAddLesson(subjectId, unitId, newLesson);
        }
    },

    // 6. Admin: Add question to a quiz
    addQuestionToQuiz: async (lessonId, question) => {
        if (isFirebaseEnabled) {
            try {
                const quizDocRef = doc(db, 'quizzes', lessonId);
                const quizDoc = await getDoc(quizDocRef);
                
                let quizData = {
                    lessonId: lessonId,
                    title: `اختبار تقييمي مخصص للدرس`,
                    questions: []
                };
                
                if (quizDoc.exists()) {
                    quizData = quizDoc.data();
                }
                
                const questionsList = quizData.questions || [];
                const newId = questionsList.length > 0 ? Math.max(...questionsList.map(q => q.id)) + 1 : 1;
                
                questionsList.push({
                    id: newId,
                    text: question.text,
                    options: question.options,
                    correctAnswer: question.correctAnswer
                });
                
                quizData.questions = questionsList;
                await setDoc(quizDocRef, quizData);
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
