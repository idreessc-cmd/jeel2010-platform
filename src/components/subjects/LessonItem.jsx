import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { CheckCircle2, PlayCircle, Lock, Unlock } from 'lucide-react';

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
                <span style={{ display: 'inline-flex', alignItems: 'center', color: isCompleted ? 'var(--accent-islamic)' : 'var(--text-muted)' }}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <Lock size={14} />
                            مغلق
                        </span>
                    ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                            <Unlock size={14} />
                            مفتوح
                        </span>
                    )
                )}
            </div>
        </li>
    );
};
