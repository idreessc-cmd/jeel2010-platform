import React from 'react';
import { Users, Gem, Unlock } from 'lucide-react';

export const AdminStats = ({ students = [] }) => {
    const totalStudents = students.length;
    const activeSubscribers = students.filter(s => s.subscriptionStatus === 'active').length;
    const freeTrialists = students.filter(s => s.subscriptionStatus === 'free').length;
    const activeRate = totalStudents > 0 ? Math.round((activeSubscribers / totalStudents) * 100) : 0;

    const stats = [
        {
            title: 'إجمالي الطلاب المسجلين',
            value: totalStudents,
            icon: <Users size={28} />,
            bgColor: '#EAF8FF',
            iconColor: '#0171F1',
            subtext: 'نشطين على خادم الـ LocalStorage'
        },
        {
            title: 'الطلاب المشتركين بالكامل',
            value: activeSubscribers,
            icon: <Gem size={28} />,
            bgColor: '#E8F7E6',
            iconColor: '#00AF45',
            subtext: `نسبة الاشتراك الفعلي: ${activeRate}%`
        },
        {
            title: 'حسابات التجربة المجانية',
            value: freeTrialists,
            icon: <Unlock size={28} />,
            bgColor: '#FAE8E8',
            iconColor: '#EA3C07',
            subtext: 'متاح لهم أول درسين فقط مجاناً'
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '35px'
        }}>
            {stats.map((stat, idx) => (
                <div key={idx} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '25px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--border-radius-md)',
                        backgroundColor: stat.bgColor,
                        color: stat.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {stat.icon}
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', margin: '0 0 5px 0' }}>
                            {stat.title}
                        </h4>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary-color)', display: 'block', lineHeight: '1.2' }}>
                            {stat.value}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                            {stat.subtext}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
