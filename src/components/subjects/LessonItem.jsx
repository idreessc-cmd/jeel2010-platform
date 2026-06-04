import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';

export const LessonItem = ({ 
    lesson, 
    subjectId, 
    isLocked, 
    isCompleted,
    activeLessonId
}) => {
    const isActive = activeLessonId === lesson.id;
    
    return (
        <li style={{
            padding: '12px 15px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
            transition: 'var(--transition)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>
                    {isCompleted ? '✅' : '🎥'}
                </span>
                
                {isLocked ? (
                    <span style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }}>
                        {lesson.title}
                    </span>
                ) : (
                    <Link 
                        to={`/subject/${subjectId}/lesson/${lesson.id}`}
                        style={{ 
                            fontWeight: isActive ? '700' : '600',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-main)'
                        }}
                    >
                        {lesson.title}
                    </Link>
                )}
            </div>
            
            <div>
                {lesson.isFree ? (
                    <Badge type="success">مجاني</Badge>
                ) : (
                    isLocked ? (
                        <span style={{ fontSize: '1rem' }}>🔒 مغلق</span>
                    ) : (
                        <span style={{ fontSize: '1rem' }}>🔓 مفتوح</span>
                    )
                )}
            </div>
        </li>
    );
};
