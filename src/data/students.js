/**
 * Mock Student Accounts for Testing
 */

export const mockStudents = [
    {
        email: 'free@jeel2010.com',
        password: '123',
        studentName: 'طالب مجاني (جيل 2010)',
        subscriptionStatus: 'free', // Only first 2 lessons free
        isLoggedIn: true
    },
    {
        email: 'active@jeel2010.com',
        password: '123',
        studentName: 'طالب مشترك (جيل 2010)',
        subscriptionStatus: 'active', // Access to all lessons
        isLoggedIn: true
    }
];

export const getDefaultStudents = () => {
    return [
        {
            email: 'free@jeel2010.com',
            password: '123',
            studentName: 'أحمد محمود (تجريبي مجاني)',
            subscriptionStatus: 'free',
            joinDate: '2026-06-01'
        },
        {
            email: 'active@jeel2010.com',
            password: '123',
            studentName: 'يوسف عمر (مشترك بالكامل)',
            subscriptionStatus: 'active',
            joinDate: '2026-05-15'
        },
        {
            email: 'parent@jeel2010.com',
            password: '123',
            studentName: 'ولي أمر (سارة خالد)',
            subscriptionStatus: 'active',
            joinDate: '2026-05-20'
        }
    ];
};
