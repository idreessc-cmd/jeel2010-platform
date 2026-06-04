import React from 'react';
import { UnitAccordion } from './UnitAccordion';

export const CurriculumSidebar = ({ 
    subject, 
    units = [], 
    user, 
    completedLessonIds = [], 
    activeLessonId 
}) => {
    return (
        <aside style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
            padding: '25px',
            border: '1px solid var(--border-color)',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
        }}>
            <h3 style={{ 
                color: 'var(--secondary-color)', 
                fontWeight: '800', 
                fontSize: '1.25rem',
                marginBottom: '5px' 
            }}>
                منهج {subject.title}
            </h3>
            <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.85rem',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '15px'
            }}>
                تصفح الوحدات والدروس لتبدأ التعلم
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {units.map((unit, index) => (
                    <UnitAccordion 
                        key={unit.unitId}
                        unit={unit}
                        subjectId={subject.id}
                        user={user}
                        completedLessonIds={completedLessonIds}
                        activeLessonId={activeLessonId}
                        defaultOpen={index === 0 || unit.lessons.some(l => l.id === activeLessonId)}
                    />
                ))}
            </div>
        </aside>
    );
};
