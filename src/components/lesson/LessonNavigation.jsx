import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LessonNavigation = ({ 
    subjectId,
    prevLesson, 
    nextLesson,
    lessonId,
    user
}) => {
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate(`/subject/${subjectId}/lesson/${lessonId}/quiz`);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '15px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '25px',
            marginTop: '30px'
        }}>
            {/* Previous Lesson */}
            {prevLesson ? (
                <button 
                    onClick={() => navigate(`/subject/${subjectId}/lesson/${prevLesson.id}`)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.95rem', padding: '10px 20px' }}
                >
                    ➡️ الدرس السابق: {prevLesson.title.split(':')[0]}
                </button>
            ) : (
                <div style={{ width: '100px' }}></div>
            )}

            {/* Start Quiz (Center) */}
            <button 
                onClick={handleStartQuiz}
                className="btn btn-secondary"
                style={{ 
                    fontSize: '1rem', 
                    padding: '12px 28px',
                    boxShadow: '0 4px 14px rgba(68, 46, 102, 0.2)'
                }}
            >
                📝 بدء اختبار الدرس التقييمي
            </button>

            {/* Next Lesson */}
            {nextLesson ? (
                <button 
                    onClick={() => {
                        // Check if locked
                        const isFree = nextLesson.isFree;
                        const hasActiveSub = user && user.subscriptionStatus === 'active';
                        if (!isFree && !hasActiveSub) {
                            alert('هذا الدرس مقفل. يرجى تفعيل باقة الوصول الكامل أولاً لتتمكن من الانتقال إليه.');
                        } else {
                            navigate(`/subject/${subjectId}/lesson/${nextLesson.id}`);
                        }
                    }}
                    className={`btn ${(!nextLesson.isFree && !(user && user.subscriptionStatus === 'active')) ? 'btn-outline' : 'btn-primary'}`}
                    style={{ 
                        fontSize: '0.95rem', 
                        padding: '10px 20px',
                        opacity: (!nextLesson.isFree && !(user && user.subscriptionStatus === 'active')) ? 0.7 : 1
                    }}
                >
                    الدرس التالي: {nextLesson.title.split(':')[0]} ⬅️
                    {(!nextLesson.isFree && !(user && user.subscriptionStatus === 'active')) && ' 🔒'}
                </button>
            ) : (
                <div style={{ width: '100px' }}></div>
            )}
        </div>
    );
};
