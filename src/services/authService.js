import { auth, db, isFirebaseEnabled } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
    login: async (email, password) => {
        if (isFirebaseEnabled) {
            try {
                // Firebase Auth Sign In
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
                        studentName: userData.name || userData.studentName || 'مستخدم فايربيس',
                        email: firebaseUser.email,
                        role: userData.role || 'student',
                        subscriptionStatus: userData.subscriptionStatus || 'free'
                    };
                } else {
                    // Fallback if doc doesn't exist in Firestore yet (create a basic profile)
                    const isDefaultAdmin = email === 'admin@jeel2010.com';
                    const isDefaultActive = email === 'active@jeel2010.com';
                    
                    userSession = {
                        uid: firebaseUser.uid,
                        studentName: isDefaultAdmin ? 'مسؤول المنصة' : isDefaultActive ? 'طالب مشترك' : 'طالب مجاني',
                        email: firebaseUser.email,
                        role: isDefaultAdmin ? 'admin' : 'student',
                        subscriptionStatus: isDefaultActive ? 'active' : 'free'
                    };
                    
                    // Seed Firestore document
                    await setDoc(userDocRef, {
                        uid: firebaseUser.uid,
                        name: userSession.studentName,
                        email: userSession.email,
                        role: userSession.role,
                        subscriptionStatus: userSession.subscriptionStatus,
                        createdAt: new Date().toISOString()
                    });
                }
                
                storage.set(CURRENT_USER_KEY, userSession);
                return { success: true, user: userSession };
            } catch (error) {
                console.error("Firebase Login Error:", error);
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
                    studentName: student.studentName,
                    email: student.email,
                    role: student.role || 'student',
                    subscriptionStatus: student.subscriptionStatus
                };
                storage.set(CURRENT_USER_KEY, userSession);
                return { success: true, user: userSession };
            }
            return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }
    },
    
    logout: () => {
        storage.remove(CURRENT_USER_KEY);
        if (isFirebaseEnabled) {
            signOut(auth).catch(err => console.error("Firebase SignOut Error:", err));
        }
    },
    
    getCurrentUser: () => {
        return storage.get(CURRENT_USER_KEY, null);
    },
    
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
                console.error("Firebase getStudents Error:", error);
                return initializeStudents();
            }
        } else {
            return initializeStudents();
        }
    },
    
    updateStudentSubscription: async (email, status) => {
        if (isFirebaseEnabled) {
            try {
                // Find user by email in Firestore
                const q = query(collection(db, 'users'), where('email', '==', email));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    await updateDoc(userDoc.ref, {
                        subscriptionStatus: status,
                        updatedAt: new Date().toISOString()
                    });
                    
                    // If the updated student is the currently logged-in user, update their session too
                    const currentUser = authService.getCurrentUser();
                    if (currentUser && currentUser.email === email) {
                        currentUser.subscriptionStatus = status;
                        storage.set(CURRENT_USER_KEY, currentUser);
                    }
                    return { success: true };
                }
                return { success: false, error: 'الطالب غير موجود' };
            } catch (error) {
                console.error("Firebase updateStudentSubscription Error:", error);
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const index = students.findIndex(s => s.email === email);
            if (index !== -1) {
                students[index].subscriptionStatus = status;
                storage.set(STUDENTS_LIST_KEY, students);
                
                // If the updated student is the currently logged-in user, update their session too
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
                
                // Write profile to Firestore
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
                console.error("Firebase addStudentManual Error:", error);
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
