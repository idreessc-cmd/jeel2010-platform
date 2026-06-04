import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';

export const accessControl = {
    // Check if user is logged in
    isAuthenticated: () => {
        return !!authService.getCurrentUser();
    },
    
    // Check if the current user is an Admin
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.email === 'admin@jeel2010.com'; // Admin account simulation
    },
    
    // Check if a lesson is locked for the current user
    isLessonLocked: (lesson) => {
        const currentUser = authService.getCurrentUser();
        return !subscriptionService.hasAccessToLesson(lesson, currentUser);
    }
};
