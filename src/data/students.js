/**
 * Mock Student Accounts for Testing
 */

export const mockStudents = [
    {
        email: 'free@jeel2010.com',
        password: '123',
        studentName: 'طالب مجاني (جيل 2010)',
        role: 'student',
        subscriptionStatus: 'free',
        isLoggedIn: true
    },
    {
        email: 'active@jeel2010.com',
        password: '123',
        studentName: 'طالب مشترك (جيل 2010)',
        role: 'student',
        subscriptionStatus: 'active',
        isLoggedIn: true
    },
    {
        email: 'admin@jeel2010.com',
        password: '123',
        studentName: 'مسؤول المنصة',
        role: 'admin',
        subscriptionStatus: 'active',
        isLoggedIn: true
    }
];

export const getDefaultStudents = () => {
    return [
        {
            email: 'free@jeel2010.com',
            password: '123',
            studentName: 'طالب مجاني',
            role: 'student',
            subscriptionStatus: 'free',
            joinDate: '2026-06-01'
        },
        {
            email: 'active@jeel2010.com',
            password: '123',
            studentName: 'طالب مشترك',
            role: 'student',
            subscriptionStatus: 'active',
            joinDate: '2026-05-15'
        },
        {
            email: 'admin@jeel2010.com',
            password: '123',
            studentName: 'مسؤول المنصة',
            role: 'admin',
            subscriptionStatus: 'active',
            joinDate: '2026-05-20'
        }
    ];
};
