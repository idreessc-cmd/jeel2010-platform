import { storage } from '../utils/storage';

const PROGRESS_KEY_PREFIX = 'jeel2010_progress_';

export const progressService = {
    // Mark a lesson as completed
    markLessonComplete: (email, lessonId, completed = true) => {
        if (!email) return;
        const key = `${PROGRESS_KEY_PREFIX}${email}`;
        const progress = storage.get(key, {});
        
        if (completed) {
            progress[lessonId] = true;
        } else {
            delete progress[lessonId];
        }
        
        storage.set(key, progress);
    },
    
    // Check if a lesson is completed
    isLessonComplete: (email, lessonId) => {
        if (!email) return false;
        const key = `${PROGRESS_KEY_PREFIX}${email}`;
        const progress = storage.get(key, {});
        return !!progress[lessonId];
    },
    
    // Get completed lessons list
    getCompletedLessons: (email) => {
        if (!email) return [];
        const key = `${PROGRESS_KEY_PREFIX}${email}`;
        const progress = storage.get(key, {});
        return Object.keys(progress);
    },
    
    // Get progress percentage for a subject
    getSubjectProgressPercentage: (email, lessonsList = []) => {
        if (!email || lessonsList.length === 0) return 0;
        
        const completedCount = lessonsList.filter(lesson => 
            progressService.isLessonComplete(email, lesson.id)
        ).length;
        
        return Math.round((completedCount / lessonsList.length) * 100);
    }
};
