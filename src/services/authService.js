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
                if (error.message === 'INVITE_ACCEPTANCE_FAILED') {
                    errorMsg = 'تم تسجيل الدخول، لكن تعذر تفعيل صلاحيات الدعوة. يرجى التواصل مع الدعم.';
                } else if (
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
                if (error.message === 'INVITE_ACCEPTANCE_FAILED') {
                    errorMsg = 'تم تسجيل الدخول، لكن تعذر تفعيل صلاحيات الدعوة. يرجى التواصل مع الدعم.';
                } else if (error.code === 'auth/email-already-in-use' || error.message?.includes('EMAIL_EXISTS')) {
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
            if (students.some(s => s.email.toLowerCase() === email.trim().toLowerCase())) {
                return { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل، يمكنك تسجيل الدخول أو إعادة تعيين كلمة المرور.' };
            }
            
            const normalizedEmail = email.trim().toLowerCase();
            const invites = authService.getMockInvites();
            const invite = invites.find(inv => inv.email.toLowerCase() === normalizedEmail && inv.status === 'pending');
            
            const newStudent = {
                studentName: invite ? invite.name : name,
                email: email,
                password: password,
                role: 'student',
                subscriptionStatus: invite ? invite.subscriptionStatus : 'free',
                subscriptionPlan: invite ? invite.subscriptionPlan : 'free',
                isActive: true,
                access: invite ? invite.access : { subjects: [], units: [], lessons: [], quizzes: [] },
                joinDate: new Date().toISOString().split('T')[0]
            };
            students.push(newStudent);
            storage.set(STUDENTS_LIST_KEY, students);
            
            if (invite) {
                invite.status = 'accepted';
                invite.acceptedByUid = `mock_${email}`;
                invite.acceptedAt = new Date().toISOString();
                invite.updatedAt = new Date().toISOString();
                storage.set('jeel2010_student_invites', invites);
            }
            
            const userSession = {
                uid: `mock_${email}`,
                studentName: newStudent.studentName,
                email: email,
                role: 'student',
                subscriptionStatus: newStudent.subscriptionStatus
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
            const email = firebaseUser.email || '';
            const normalizedEmail = email.trim().toLowerCase();
            
            // Check for pending student invitation
            let invite = null;
            try {
                const inviteDocRef = doc(db, 'studentInvites', normalizedEmail);
                const inviteDoc = await getDoc(inviteDocRef);
                if (inviteDoc.exists() && inviteDoc.data().status === 'pending') {
                    invite = inviteDoc.data();
                }
            } catch (err) {
                console.error("Error checking student invites:", err);
            }
            
            let profile;
            if (invite) {
                profile = {
                    uid: firebaseUser.uid,
                    name: invite.name || extraData?.name || 'طالب جديد',
                    email: email,
                    phone: invite.phone || extraData?.phone || '',
                    role: 'student',
                    subscriptionStatus: invite.subscriptionStatus || 'free',
                    subscriptionPlan: invite.subscriptionPlan || 'free',
                    isActive: true,
                    joinedVipGroups: false,
                    access: invite.access || { subjects: [], units: [], lessons: [], quizzes: [] },
                    createdAt: now,
                    updatedAt: now
                };
                
                await setDoc(userDocRef, profile);
                
                // Update invitation status
                try {
                    const inviteDocRef = doc(db, 'studentInvites', normalizedEmail);
                    await updateDoc(inviteDocRef, {
                        status: 'accepted',
                        acceptedByUid: firebaseUser.uid,
                        acceptedAt: now,
                        updatedAt: now
                    });
                } catch (err) {
                    if (import.meta.env.DEV) {
                        console.warn("Invite acceptance error:", err.code || err.message, err);
                    }
                    throw new Error('INVITE_ACCEPTANCE_FAILED');
                }
            } else {
                profile = {
                    uid: firebaseUser.uid,
                    name: extraData?.name || firebaseUser.displayName || 'طالب جديد',
                    email: email,
                    phone: extraData?.phone || '',
                    role: 'student',
                    subscriptionStatus: 'free',
                    subscriptionPlan: 'free',
                    isActive: true,
                    joinedVipGroups: false,
                    access: { subjects: [], units: [], lessons: [], quizzes: [] },
                    createdAt: now,
                    updatedAt: now
                };
                await setDoc(userDocRef, profile);
            }
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
        const normalizedEmail = student.email.trim().toLowerCase();
        
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
                    if (student.access) {
                        updateData.access = student.access;
                    }
                    await updateDoc(docRef, updateData);
                    return { success: true, exists: true, uid: docId };
                }
                
                // Student does not exist in users collection. Create invitation.
                const inviteRef = doc(db, 'studentInvites', normalizedEmail);
                const inviteData = {
                    id: normalizedEmail,
                    name: student.studentName,
                    email: student.email.trim().toLowerCase(),
                    phone: student.phone || '',
                    status: 'pending',
                    subscriptionStatus: student.subscriptionStatus || 'free',
                    subscriptionPlan: student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free'),
                    access: student.access || { subjects: [], units: [], lessons: [], quizzes: [] },
                    createdBy: auth.currentUser ? auth.currentUser.uid : 'admin',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    acceptedByUid: "",
                    acceptedAt: null,
                    note: ""
                };
                await setDoc(inviteRef, inviteData, { merge: true });
                return { success: true, exists: false, uid: normalizedEmail };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const students = initializeStudents();
            const existing = students.find(s => s.email.toLowerCase() === normalizedEmail);
            if (existing) {
                existing.studentName = student.studentName;
                existing.phone = student.phone || '';
                existing.subscriptionStatus = student.subscriptionStatus || 'free';
                existing.subscriptionPlan = student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free');
                existing.isActive = true;
                if (student.access) {
                    existing.access = student.access;
                }
                storage.set(STUDENTS_LIST_KEY, students);
                return { success: true, exists: true, uid: `mock_${student.email}` };
            }
            
            // Create mock invitation
            const invites = authService.getMockInvites();
            const existingInviteIndex = invites.findIndex(inv => inv.email.toLowerCase() === normalizedEmail);
            const inviteData = {
                id: normalizedEmail,
                name: student.studentName,
                email: student.email.trim().toLowerCase(),
                phone: student.phone || '',
                status: 'pending',
                subscriptionStatus: student.subscriptionStatus || 'free',
                subscriptionPlan: student.subscriptionStatus === 'active' ? 'full' : (student.subscriptionStatus === 'custom' ? 'custom' : 'free'),
                access: student.access || { subjects: [], units: [], lessons: [], quizzes: [] },
                createdBy: 'mock_admin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                acceptedByUid: "",
                acceptedAt: null,
                note: ""
            };
            if (existingInviteIndex !== -1) {
                invites[existingInviteIndex] = inviteData;
            } else {
                invites.push(inviteData);
            }
            storage.set('jeel2010_student_invites', invites);
            return { success: true, exists: false, uid: normalizedEmail };
        }
    },

    updateStudentAccess: async (uid, access) => {
        const hasCustom = (access.subjects?.length || 0) > 0 || (access.units?.length || 0) > 0 || (access.lessons?.length || 0) > 0 || (access.quizzes?.length || 0) > 0;
        const isInvite = uid.includes('@');

        if (isFirebaseEnabled) {
            try {
                const docRef = isInvite ? doc(db, 'studentInvites', uid) : doc(db, 'users', uid);
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
            if (isInvite) {
                const invites = authService.getMockInvites();
                const invite = invites.find(inv => inv.email.toLowerCase() === uid.toLowerCase());
                if (invite) {
                    invite.access = access;
                    invite.subscriptionPlan = hasCustom ? 'custom' : 'free';
                    storage.set('jeel2010_student_invites', invites);
                    return { success: true };
                }
            } else {
                const students = initializeStudents();
                const email = uid.replace('mock_', '');
                const index = students.findIndex(s => s.email === email);
                if (index !== -1) {
                    students[index].access = access;
                    students[index].subscriptionPlan = hasCustom ? 'custom' : 'free';
                    storage.set(STUDENTS_LIST_KEY, students);
                    return { success: true };
                }
            }
            return { success: false, error: 'المستهدف غير موجود' };
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
    },

    getMockInvites: () => {
        let invites = storage.get('jeel2010_student_invites');
        if (!invites) {
            invites = [];
            storage.set('jeel2010_student_invites', invites);
        }
        return invites;
    },

    getInvites: async () => {
        if (isFirebaseEnabled) {
            try {
                const querySnapshot = await getDocs(collection(db, 'studentInvites'));
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                return list;
            } catch (error) {
                console.error("Firebase getInvites error:", error);
                return authService.getMockInvites();
            }
        } else {
            return authService.getMockInvites();
        }
    },

    cancelInvite: async (email) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (isFirebaseEnabled) {
            try {
                const docRef = doc(db, 'studentInvites', normalizedEmail);
                await updateDoc(docRef, {
                    status: 'cancelled',
                    updatedAt: new Date().toISOString()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            const invites = authService.getMockInvites();
            const invite = invites.find(inv => inv.email.toLowerCase() === normalizedEmail);
            if (invite) {
                invite.status = 'cancelled';
                invite.updatedAt = new Date().toISOString();
                storage.set('jeel2010_student_invites', invites);
                return { success: true };
            }
            return { success: false, error: 'الدعوة غير موجودة' };
        }
    }
};
