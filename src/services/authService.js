import { auth, db, isFirebaseEnabled } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { storage } from '../utils/storage';
import { getDefaultStudents } from '../data/students';

const CURRENT_USER_KEY = 'jeel2010_current_user';
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
                if (error.code === 'auth/email-already-in-use') {
                    errorMsg = 'البريد الإلكتروني مسجل بالفعل';
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
                return { success: false, error: 'البريد الإلكتروني مسجل بالفعل' };
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
                        email: data.email,
                        studentName: data.name || data.studentName,
                        role: data.role || 'student',
                        subscriptionStatus: data.subscriptionStatus || 'free',
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
                        updatedAt: new Date().toISOString()
                    });
                    
                    const currentUser = authService.getCurrentUser();
                    if (currentUser && currentUser.email === email) {
                        currentUser.subscriptionStatus = status;
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
                storage.set(STUDENTS_LIST_KEY, students);
                
                const currentUser = authService.getCurrentUser();
                if (currentUser && currentUser.email === email) {
                    currentUser.subscriptionStatus = status;
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
                    return { success: false, error: 'البريد الإلكتروني مسجل بالفعل' };
                }
                
                const tempId = `temp_${Date.now()}`;
                const newDocRef = doc(db, 'users', tempId);
                await setDoc(newDocRef, {
                    uid: tempId,
                    name: student.studentName,
                    email: student.email,
                    role: student.role || 'student',
                    subscriptionStatus: student.subscriptionStatus || 'free',
                    createdAt: new Date().toISOString()
                });
                
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            if (students.some(s => s.email === student.email)) {
                return { success: false, error: 'البريد الإلكتروني مسجل بالفعل' };
            }
            students.push({
                email: student.email,
                password: student.password || '123',
                studentName: student.studentName,
                role: student.role || 'student',
                subscriptionStatus: student.subscriptionStatus || 'free',
                joinDate: new Date().toISOString().split('T')[0]
            });
            storage.set(STUDENTS_LIST_KEY, students);
            return { success: true };
        }
    }
};
