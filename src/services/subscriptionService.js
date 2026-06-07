/**
 * Subscription Status and Access Control Service
 */

export const subscriptionService = {
    // Helper to check if user account is disabled
    isUserDisabled: (user) => {
        if (!user) return false;
        return user.isActive === false || user.subscriptionStatus === 'disabled';
    },

    // Check if user is full subscriber
    isFullSubscriber: (user) => {
        if (!user) return false;
        return user.subscriptionStatus === 'active' && user.subscriptionPlan === 'full';
    },

    // Check subject access
    canAccessSubject: (user, subjectId) => {
        if (!user) return false; // Guest cannot access full subject
        if (subscriptionService.isUserDisabled(user)) return false;
        if (subscriptionService.isFullSubscriber(user)) return true;
        
        const access = user.access || {};
        const allowedSubjects = access.subjects || [];
        return allowedSubjects.includes(subjectId);
    },

    // Check unit access
    canAccessUnit: (user, unitId, subjectId) => {
        if (!user) return false;
        if (subscriptionService.isUserDisabled(user)) return false;
        if (subscriptionService.isFullSubscriber(user)) return true;
        
        const access = user.access || {};
        
        // If they have access to the parent subject
        const subId = subjectId || unitId.split('-')[0];
        if (subscriptionService.canAccessSubject(user, subId)) {
            return true;
        }

        const allowedUnits = access.units || [];
        return allowedUnits.includes(unitId);
    },

    // Check lesson access
    canAccessLesson: (user, lesson) => {
        if (!lesson) return false;
        
        // Free lessons are accessible to anyone, unless their account is disabled
        if (lesson.isFree) {
            if (user && subscriptionService.isUserDisabled(user)) {
                return false;
            }
            return true;
        }

        if (!user) return false;
        if (subscriptionService.isUserDisabled(user)) return false;
        if (subscriptionService.isFullSubscriber(user)) return true;

        const access = user.access || {};
        
        // Check if lesson parent subject or unit is accessible
        if (lesson.subjectId && subscriptionService.canAccessSubject(user, lesson.subjectId)) {
            return true;
        }
        if (lesson.unitId && subscriptionService.canAccessUnit(user, lesson.unitId, lesson.subjectId)) {
            return true;
        }

        const allowedLessons = access.lessons || [];
        return allowedLessons.includes(lesson.id);
    },

    // Check quiz access
    canAccessQuiz: (user, quiz, lesson) => {
        if (!quiz) return false;
        if (!user) return false;
        if (subscriptionService.isUserDisabled(user)) return false;
        
        const access = user.access || {};
        
        // Direct quiz permission
        const allowedQuizzes = access.quizzes || [];
        if (allowedQuizzes.includes(quiz.id || `quiz-${quiz.lessonId}`)) {
            return true;
        }

        // Otherwise, access follows the parent lesson accessibility
        const lessonObj = lesson || {
            id: quiz.lessonId,
            unitId: quiz.lessonId ? `${quiz.lessonId.split('-')[0]}-u1` : '',
            subjectId: quiz.subjectId || (quiz.lessonId ? quiz.lessonId.split('-')[0] : ''),
            isFree: false // default fallback
        };
        
        return subscriptionService.canAccessLesson(user, lessonObj);
    },

    // Check if the current user has access to a specific lesson (compatibility wrapper)
    hasAccessToLesson: (lesson, user) => {
        return subscriptionService.canAccessLesson(user, lesson);
    },
    
    // Check user subscription plan
    getSubscriptionLabel: (userOrStatus) => {
        const status = typeof userOrStatus === 'object' && userOrStatus !== null
            ? userOrStatus.subscriptionStatus
            : userOrStatus;
            
        const plan = typeof userOrStatus === 'object' && userOrStatus !== null
            ? userOrStatus.subscriptionPlan
            : '';

        if (status === 'disabled') {
            return 'حساب معطل';
        }
        if (status === 'active') {
            if (plan === 'custom') {
                return 'صلاحيات مخصصة (مشترك مخصص)';
            }
            return 'باقة الوصول الكامل (مشترك)';
        }
        
        return 'الباقة التجريبية المجانية';
    }
};
