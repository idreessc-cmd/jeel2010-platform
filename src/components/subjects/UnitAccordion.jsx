import React, { useState } from 'react';
import { LessonItem } from './LessonItem';

export const UnitAccordion = ({ 
    unit, 
    subjectId, 
    user, 
    completedLessonIds = [], 
    activeLessonId,
    defaultOpen = true
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '15px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
        }}>
            <button 
                onClick={toggleOpen}
                style={{
                    width: '100%',
                    padding: '15px 20px',
                    backgroundColor: 'var(--bg-color)',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-family)',
                    fontSize: '1.05rem',
                    fontWeight: '800',
                    color: 'var(--secondary-color)'
                }}
            >
                <span>{unit.unitTitle}</span>
                <span style={{ 
                    fontSize: '1.2rem', 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'var(--transition)'
                }}>
                    ▼
                </span>
            </button>
            
            {isOpen && (
                <ul style={{ padding: '0', margin: '0' }}>
                    {unit.lessons.map(lesson => {
                        // Check if this lesson is locked for current user
                        const isFree = lesson.isFree;
                        const hasActiveSub = user && user.subscriptionStatus === 'active';
                        const isLocked = !isFree && !hasActiveSub;
                        const isCompleted = completedLessonIds.includes(lesson.id);

                        return (
                            <LessonItem 
                                key={lesson.id}
                                lesson={lesson}
                                subjectId={subjectId}
                                isLocked={isLocked}
                                isCompleted={isCompleted}
                                activeLessonId={activeLessonId}
                            />
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
