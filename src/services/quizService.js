import { storage } from '../utils/storage';

const QUIZ_RESULTS_KEY_PREFIX = 'jeel2010_quiz_';

export const quizService = {
    // Save quiz result
    saveResult: (email, lessonId, resultData) => {
        if (!email) return;
        const key = `${QUIZ_RESULTS_KEY_PREFIX}${email}`;
        const results = storage.get(key, {});
        
        results[lessonId] = {
            ...resultData,
            date: new Date().toISOString().split('T')[0]
        };
        
        storage.set(key, results);
    },
    
    // Get result for a lesson quiz
    getResult: (email, lessonId) => {
        if (!email) return null;
        const key = `${QUIZ_RESULTS_KEY_PREFIX}${email}`;
        const results = storage.get(key, {});
        return results[lessonId] || null;
    },
    
    // Get all quiz results for a user
    getAllResults: (email) => {
        if (!email) return {};
        const key = `${QUIZ_RESULTS_KEY_PREFIX}${email}`;
        return storage.get(key, {});
    }
};
