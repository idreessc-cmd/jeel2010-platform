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
    login: (email, password) => {
        const students = initializeStudents();
        const student = students.find(s => s.email === email && s.password === password);
        
        if (student) {
            const userSession = {
                studentName: student.studentName,
                email: student.email,
                subscriptionStatus: student.subscriptionStatus
            };
            storage.set(CURRENT_USER_KEY, userSession);
            return { success: true, user: userSession };
        }
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    },
    
    logout: () => {
        storage.remove(CURRENT_USER_KEY);
    },
    
    getCurrentUser: () => {
        return storage.get(CURRENT_USER_KEY, null);
    },
    
    getStudents: () => {
        return initializeStudents();
    },
    
    updateStudentSubscription: (email, status) => {
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
    },
    
    addStudentManual: (student) => {
        const students = initializeStudents();
        if (students.some(s => s.email === student.email)) {
            return { success: false, error: 'البريد الإلكتروني مسجل بالفعل' };
        }
        students.push({
            email: student.email,
            password: student.password || '123',
            studentName: student.studentName,
            subscriptionStatus: student.subscriptionStatus || 'free',
            joinDate: new Date().toISOString().split('T')[0]
        });
        storage.set(STUDENTS_LIST_KEY, students);
        return { success: true };
    }
};
