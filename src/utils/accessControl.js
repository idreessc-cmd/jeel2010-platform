import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';

export const accessControl = {
    // Check if user is logged in
    isAuthenticated: () => {
        return !!authService.getCurrentUser();
    },
    
    // Check if the current user is an Admin based on role from Firestore
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.role === 'admin';
    },
    
    // Check if a lesson is locked for the current user
    isLessonLocked: (lesson) => {
        const currentUser = authService.getCurrentUser();
        return !subscriptionService.hasAccessToLesson(lesson, currentUser);
    }
};
