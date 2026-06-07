import React from 'react';
import { Users, CheckCircle, BookOpen } from 'lucide-react';

export const AdminStats = ({ students = [] }) => {
    const totalStudents = students.length;
    const activeSubscribers = students.filter(s => s.subscriptionStatus === 'active').length;
    const freeTrialists = students.filter(s => s.subscriptionStatus === 'free').length;
    const activeRate = totalStudents > 0 ? Math.round((activeSubscribers / totalStudents) * 100) : 0;

    const stats = [
        {
            title: 'إجمالي الطلاب',
            value: totalStudents,
            icon: <Users size={24} />,
            bgColor: '#EAF8FF',
            iconColor: '#0171F1',
            subtext: 'عدد الطلاب المسجلين في النظام'
        },
        {
            title: 'الطلاب المشتركين',
            value: activeSubscribers,
            icon: <CheckCircle size={24} />,
            bgColor: '#E8F7E6',
            iconColor: '#00AF45',
            subtext: `نسبة الاشتراك الفعلي: ${activeRate}%`
        },
        {
            title: 'الحسابات المجانية',
            value: freeTrialists,
            icon: <BookOpen size={24} />,
            bgColor: '#F1F5F9',
            iconColor: '#64748B',
            subtext: 'أول درسين فقط متاحان مجاناً'
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '35px',
            width: '100%'
        }}>
            {stats.map((stat, idx) => (
                <div key={idx} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%'
                }}>
                    <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--border-radius-md)',
                        backgroundColor: stat.bgColor,
                        color: stat.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        {stat.icon}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', margin: '0 0 4px 0' }}>
                            {stat.title}
                        </h4>
                        <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)', display: 'block', lineHeight: '1.2' }}>
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
