import { storage } from '../utils/storage';

const QUIZ_RESULTS_KEY_PREFIX = 'jeel2010_quiz_';

export const quizService = {
    // Save quiz result
    saveResult: (email, lessonId, resultData) => {
        if (!email) return;
        const key = `${QUIZ_RESULTS_KEY_PREFIX}${email}`;
        const results = storage.get(key, {});
        
        const newAttempt = {
            ...resultData,
            date: new Date().toLocaleDateString('ar-EG')
        };
        
        if (!results[lessonId]) {
            results[lessonId] = {
                latest: newAttempt,
                history: [newAttempt]
            };
        } else {
            // Retrieve history, handling legacy format
            let history = [];
            if (results[lessonId].history) {
                history = results[lessonId].history;
            } else if (results[lessonId].date) {
                history = [{
                    score: results[lessonId].score,
                    total: results[lessonId].total,
                    percentage: results[lessonId].percentage,
                    date: results[lessonId].date
                }];
            }
            history.push(newAttempt);
            
            results[lessonId] = {
                latest: newAttempt,
                history: history
            };
        }
        
        storage.set(key, results);
    },
    
    // Get result for a lesson quiz
    getResult: (email, lessonId) => {
        if (!email) return null;
        const key = `${QUIZ_RESULTS_KEY_PREFIX}${email}`;
        const results = storage.get(key, {});
        const res = results[lessonId];
        if (!res) return null;
        return res.latest || res;
    },
    
    // Get all quiz results for a user
    getAllResults: (email) => {
        if (!email) return {};
        const key = `${QUIZ_RESULTS_KEY_PREFIX}${email}`;
        return storage.get(key, {});
    }
};
