import { auth, db, isFirebaseEnabled } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { storage } from '../utils/storage';
import { getDefaultStudents } from '../data/students';

const CURRENT_USER_KEY = 'examSuccessUser';
const STUDENTS_LIST_KEY = 'jeel2010_students';

// Initialize students list in localStorage if it doesn't exist
export const initializeStudents = () => {
    let students = storage.get(STUDENTS_LIST_KEY);
    if (!students) {
        students = getDefaultStudents();
        storage.set(STUDENTS_LIST_KEY, students);
    }
    return students;
};

export const authService = {
    // 1. Login with Email
    loginWithEmail: async (email, password) => {
        if (isFirebaseEnabled) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                
                // Fetch User profile from Firestore
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                let userSession;
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userSession = {
                        uid: firebaseUser.uid,
                        studentName: userData.name || 'مستخدم فايربيس',
                        email: firebaseUser.email,
                        role: userData.role || 'student',
                        subscriptionStatus: userData.subscriptionStatus || 'free'
                    };
                } else {
                    // Create student profile securely if missing
                    const profile = await authService.createStudentProfileIfMissing(firebaseUser);
                    userSession = {
                        uid: firebaseUser.uid,
                        studentName: profile.name,
                        email: firebaseUser.email,
                        role: profile.role,
                        subscriptionStatus: profile.subscriptionStatus
                    };
                }
                
                storage.set(CURRENT_USER_KEY, userSession);
                return { success: true, user: userSession };
            } catch (error) {
                let errorMsg = 'حدث خطأ أثناء تسجيل الدخول';
                if (
                    error.code === 'auth/user-not-found' || 
                    error.code === 'auth/wrong-password' || 
                    error.code === 'auth/invalid-credential' ||
                    error.code === 'auth/invalid-email'
                ) {
                    errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
                }
                return { success: false, error: errorMsg };
            }
        } else {
            // LocalStorage Mock Login
            const students = initializeStudents();
            const student = students.find(s => s.email === email && s.password === password);
            
            if (student) {
                const userSession = {
                    uid: `mock_${student.email}`,
                    studentName: student.studentName,
                    email: student.email,
                    role: student.role || 'student',
                    subscriptionStatus: student.subscriptionStatus || 'free'
                };
                storage.set(CURRENT_USER_KEY, userSession);
                return { success: true, user: userSession };
            }
            return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }
    },

    // Legacy login alias to prevent breakage in un-refactored code
    login: async (email, password) => {
        return authService.loginWithEmail(email, password);
    },
    
    // 2. Register Student (Standard role: 'student')
    registerStudent: async ({ name, phone, email, password }) => {
        if (isFirebaseEnabled) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                
                const profile = await authService.createStudentProfileIfMissing(firebaseUser, { name, phone });
                
                const userSession = {
                    uid: firebaseUser.uid,
                    studentName: profile.name,
                    email: firebaseUser.email,
                    role: profile.role,
                    subscriptionStatus: profile.subscriptionStatus
                };
                
                storage.set(CURRENT_USER_KEY, userSession);
                return { success: true, user: userSession };
            } catch (error) {
                let errorMsg = 'حدث خطأ أثناء إنشاء الحساب';
                if (error.code === 'auth/email-already-in-use' || error.message?.includes('EMAIL_EXISTS')) {
                    errorMsg = 'هذا البريد الإلكتروني مستخدم بالفعل، يمكنك تسجيل الدخول أو إعادة تعيين كلمة المرور.';
                } else if (error.code === 'auth/weak-password') {
                    errorMsg = 'كلمة المرور ضعيفة للغاية (يجب أن تكون 6 أحرف على الأقل)';
                } else if (error.code === 'auth/invalid-email') {
                    errorMsg = 'البريد الإلكتروني غير صالح';
                }
                return { success: false, error: errorMsg };
            }
        } else {
            const students = initializeStudents();
            if (students.some(s => s.email === email)) {
                return { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل، يمكنك تسجيل الدخول أو إعادة تعيين كلمة المرور.' };
            }
            
            const newStudent = {
                studentName: name,
                email: email,
                password: password,
                role: 'student',
                subscriptionStatus: 'free',
                joinDate: new Date().toISOString().split('T')[0]
            };
            students.push(newStudent);
            storage.set(STUDENTS_LIST_KEY, students);
            
            const userSession = {
                uid: `mock_${email}`,
                studentName: name,
                email: email,
                role: 'student',
                subscriptionStatus: 'free'
            };
            storage.set(CURRENT_USER_KEY, userSession);
            return { success: true, user: userSession };
        }
    },
    
    // 3. Logout
    logout: () => {
        storage.remove(CURRENT_USER_KEY);
        if (isFirebaseEnabled) {
            signOut(auth).catch(() => {});
        }
    },

    // Password Reset
    sendPasswordReset: async (email) => {
        if (isFirebaseEnabled) {
            try {
                await sendPasswordResetEmail(auth, email);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            return { success: true };
        }
    },
    
    // 4. Get Current User Session
    getCurrentUser: () => {
        return storage.get(CURRENT_USER_KEY, null);
    },

    // 5. Get Current User Full Profile from Firestore (or mock storage)
    getCurrentUserProfile: async () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return null;
        
        if (isFirebaseEnabled) {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    return userDoc.data();
                }
                return null;
            } catch (error) {
                return null;
            }
        } else {
            const students = initializeStudents();
            const student = students.find(s => s.email === currentUser.email);
            if (student) {
                return {
                    uid: `mock_${student.email}`,
                    name: student.studentName,
                    email: student.email,
                    role: student.role || 'student',
                    subscriptionStatus: student.subscriptionStatus || 'free',
                    phone: '',
                    subscriptionPlan: 'free',
                    isActive: true,
                    joinedVipGroups: false
                };
            }
            return null;
        }
    },

    // 6. Secure profile helper (strictly creates student profiles only)
    createStudentProfileIfMissing: async (firebaseUser, extraData) => {
        if (!isFirebaseEnabled) return null;
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            const now = new Date().toISOString();
            const profile = {
                uid: firebaseUser.uid,
                name: extraData?.name || firebaseUser.displayName || 'طالب جديد',
                email: firebaseUser.email,
                phone: extraData?.phone || '',
                role: 'student', // Strictly hardcoded student role
                subscriptionStatus: 'free',
                subscriptionPlan: 'free',
                isActive: true,
                joinedVipGroups: false,
                createdAt: now,
                updatedAt: now
            };
            await setDoc(userDocRef, profile);
            return profile;
        }
        return userDoc.data();
    },
    
    // Admin features
    getStudents: async () => {
        if (isFirebaseEnabled) {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const list = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    list.push({
                        uid: doc.id,
                        email: data.email,
                        studentName: data.name || data.studentName,
                        phone: data.phone || '',
                        role: data.role || 'student',
                        subscriptionStatus: data.subscriptionStatus || 'free',
                        subscriptionPlan: data.subscriptionPlan || 'free',
                        isActive: data.isActive !== false,
                        joinedVipGroups: data.joinedVipGroups || false,
                        access: data.access || { subjects: [], units: [], lessons: [], quizzes: [] },
                        joinDate: data.createdAt ? data.createdAt.split('T')[0] : '2026-06-01'
                    });
                });
                return list;
            } catch (error) {
                return initializeStudents();
            }
        } else {
            return initializeStudents();
        }
    },
    
    updateStudentSubscription: async (email, status) => {
        if (isFirebaseEnabled) {
            try {
                const q = query(collection(db, 'users'), where('email', '==', email));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    await updateDoc(userDoc.ref, {
                        subscriptionStatus: status,
                        subscriptionPlan: status === 'active' ? 'full' : 'free',
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    });
                    
                    const currentUser = authService.getCurrentUser();
                    if (currentUser && currentUser.email === email) {
                        currentUser.subscriptionStatus = status;
                        currentUser.subscriptionPlan = status === 'active' ? 'full' : 'free';
                        currentUser.isActive = true;
                        storage.set(CURRENT_USER_KEY, currentUser);
                    }
                    return { success: true };
                }
                return { success: false, error: 'الطالب غير موجود' };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const index = students.findIndex(s => s.email === email);
            if (index !== -1) {
                students[index].subscriptionStatus = status;
                students[index].subscriptionPlan = status === 'active' ? 'full' : 'free';
                students[index].isActive = true;
                storage.set(STUDENTS_LIST_KEY, students);
                
                const currentUser = authService.getCurrentUser();
                if (currentUser && currentUser.email === email) {
                    currentUser.subscriptionStatus = status;
                    currentUser.subscriptionPlan = status === 'active' ? 'full' : 'free';
                    currentUser.isActive = true;
                    storage.set(CURRENT_USER_KEY, currentUser);
                }
                return { success: true };
            }
            return { success: false, error: 'الطالب غير موجود' };
        }
    },
    
    addStudentManual: async (student) => {
        if (isFirebaseEnabled) {
            try {
                const q = query(collection(db, 'users'), where('email', '==', student.email));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    // Update instead of failing
                    const docId = querySnapshot.docs[0].id;
                    const docRef = doc(db, 'users', docId);
                    const updateData = {
                        name: student.studentName,
                        phone: student.phone || '',
                        subscriptionStatus: student.subscriptionStatus || 'free',
                        subscriptionPlan: student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free'),
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                    await updateDoc(docRef, updateData);
                    return { success: true, exists: true, uid: docId };
                }
                
                const tempId = `temp_${Date.now()}`;
                const newDocRef = doc(db, 'users', tempId);
                const profile = {
                    uid: tempId,
                    name: student.studentName,
                    email: student.email,
                    phone: student.phone || '',
                    role: student.role || 'student',
                    subscriptionStatus: student.subscriptionStatus || 'free',
                    subscriptionPlan: student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free'),
                    isActive: true,
                    joinedVipGroups: false,
                    access: student.access || { subjects: [], units: [], lessons: [], quizzes: [] },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                await setDoc(newDocRef, profile);
                return { success: true, exists: false, uid: tempId };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const existing = students.find(s => s.email === student.email);
            if (existing) {
                existing.studentName = student.studentName;
                existing.phone = student.phone || '';
                existing.subscriptionStatus = student.subscriptionStatus || 'free';
                existing.subscriptionPlan = student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free');
                existing.isActive = true;
                storage.set(STUDENTS_LIST_KEY, students);
                return { success: true, exists: true, uid: `mock_${student.email}` };
            }
            students.push({
                email: student.email,
                password: student.password || '123',
                studentName: student.studentName,
                phone: student.phone || '',
                role: student.role || 'student',
                subscriptionStatus: student.subscriptionStatus || 'free',
                subscriptionPlan: student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free'),
                isActive: true,
                access: student.access || { subjects: [], units: [], lessons: [], quizzes: [] },
                joinDate: new Date().toISOString().split('T')[0]
            });
            storage.set(STUDENTS_LIST_KEY, students);
            return { success: true, exists: false, uid: `mock_${student.email}` };
        }
    },

    updateStudentAccess: async (uid, access) => {
        if (isFirebaseEnabled) {
            try {
                const docRef = doc(db, 'users', uid);
                const hasCustom = (access.subjects?.length || 0) > 0 || (access.units?.length || 0) > 0 || (access.lessons?.length || 0) > 0 || (access.quizzes?.length || 0) > 0;
                
                await updateDoc(docRef, {
                    access: access,
                    subscriptionPlan: hasCustom ? 'custom' : 'free',
                    updatedAt: new Date().toISOString()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const email = uid.replace('mock_', '');
            const index = students.findIndex(s => s.email === email);
            if (index !== -1) {
                students[index].access = access;
                const hasCustom = (access.subjects?.length || 0) > 0 || (access.units?.length || 0) > 0 || (access.lessons?.length || 0) > 0 || (access.quizzes?.length || 0) > 0;
                students[index].subscriptionPlan = hasCustom ? 'custom' : 'free';
                storage.set(STUDENTS_LIST_KEY, students);
                return { success: true };
            }
            return { success: false, error: 'الطالب غير موجود' };
        }
    },

    disableStudent: async (uid) => {
        if (isFirebaseEnabled) {
            try {
                const docRef = doc(db, 'users', uid);
                await updateDoc(docRef, {
                    isActive: false,
                    subscriptionStatus: 'disabled',
                    updatedAt: new Date().toISOString()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const email = uid.replace('mock_', '');
            const index = students.findIndex(s => s.email === email);
            if (index !== -1) {
                students[index].isActive = false;
                students[index].subscriptionStatus = 'disabled';
                storage.set(STUDENTS_LIST_KEY, students);
                return { success: true };
            }
            return { success: false, error: 'الطالب غير موجود' };
        }
    },

    deleteStudentFirestore: async (uid) => {
        if (isFirebaseEnabled) {
            try {
                // Return descriptive error advising they cannot delete from client directly
                return { success: false, error: 'الحذف النهائي من Authentication يتطلب Cloud Function آمنة. يرجى تعطيل الحساب لحظر الطالب فوراً.' };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const email = uid.replace('mock_', '');
            const index = students.findIndex(s => s.email === email);
            if (index !== -1) {
                students.splice(index, 1);
                storage.set(STUDENTS_LIST_KEY, students);
                return { success: true };
            }
            return { success: false, error: 'الطالب غير موجود' };
        }
    }
};
