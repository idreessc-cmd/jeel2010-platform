import React, { useState, useEffect } from 'react';
import { mockSubjects } from '../data/subjects';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { contentService } from '../services/contentService';
import { Lightbulb, Mail } from 'lucide-react';

export const Subjects = () => {
    const [subjects, setSubjects] = useState(mockSubjects);

    useEffect(() => {
        contentService.getSubjects().then(data => {
            if (data && data.length > 0) {
                setSubjects(data);
            }
        });
    }, []);

    return (
        <section className="section-padding" style={{ minHeight: 'calc(100vh - 350px)' }}>
            <div className="container">
                <div className="section-header">
                    <h2>المواد الدراسية المتوفرة</h2>
                    <p>اختر المادة التي ترغب في دراستها الآن وتصفح الوحدات والدروس والامتحانات المتاحة.</p>
                </div>
                
                <div className="subjects-grid">
                    {subjects.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>
                
                <div style={{
                    marginTop: '60px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '40px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Lightbulb size={24} style={{ color: 'var(--primary-color)' }} />
                        هل تبحث عن باقي مواد الصف الأول الثانوي؟
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto 20px auto' }}>
                        نحن نعمل حالياً على إضافة باقي المواد العلمية والأدبية (الفيزياء، الكيمياء، الأحياء، الفلسفة، والجغرافيا) لتوفير تجربة تعليمية متكاملة لجيل 2010 قريباً جداً.
                    </p>
                    <a href="#footer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={18} />
                        اتصل بنا للاقتراحات
                    </a>
                </div>
            </div>
        </section>
    );
};
