/**
 * Subscription Status and Access Control Service
 */

export const subscriptionService = {
    // Check if the current user has access to a specific lesson
    hasAccessToLesson: (lesson, user) => {
        // 1. If lesson is marked as free, anyone can access it
        if (lesson.isFree) {
            return true;
        }
        
        // 2. If user is logged in and has an active subscription, they have full access
        if (user && user.subscriptionStatus === 'active') {
            return true;
        }
        
        // 3. Otherwise, access is locked
        return false;
    },
    
    // Check user subscription plan
    getSubscriptionLabel: (status) => {
        switch (status) {
            case 'active':
                return 'باقة الوصول الكامل (مشترك)';
            case 'free':
            default:
                return 'الباقة التجريبية المجانية';
        }
    }
};
