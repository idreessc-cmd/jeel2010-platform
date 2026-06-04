import React from 'react';
import { useNavigate } from 'react-router-dom';

export const QuizResult = ({ 
    score, 
    totalQuestions, 
    onRetake,
    subjectId,
    lessonId
}) => {
    const navigate = useNavigate();
    const correctCount = score;
    const wrongCount = totalQuestions - score;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Choose status texts and emojis based on grade
    let statusEmoji = '🎉';
    let statusText = 'ممتاز! لقد اجتزت الاختبار بنجاح باهر';
    let statusColor = 'var(--accent-islamic)';
    
    if (percentage >= 80) {
        statusEmoji = '🌟';
        statusText = 'رائع جداً! مستوى متميز ومبهر';
        statusColor = 'var(--accent-islamic)';
    } else if (percentage >= 60) {
        statusEmoji = '👍';
        statusText = 'أحسنت! لقد نجحت في الاختبار، ويمكنك تحسين درجتك';
        statusColor = 'var(--primary-color)';
    } else {
        statusEmoji = '📚';
        statusText = 'حاول مجدداً! ننصحك بمراجعة الدرس مرة أخرى لزيادة الفهم';
        statusColor = 'var(--accent-arabic)';
    }

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            padding: '40px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            maxWidth: '650px',
            margin: '0 auto'
        }}>
            <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '15px' }}>{statusEmoji}</span>
            <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.8rem', marginBottom: '10px' }}>
                نتيجة الاختبار التقييمي
            </h2>
            <p style={{ color: statusColor, fontWeight: '700', fontSize: '1.25rem', marginBottom: '30px' }}>
                {statusText}
            </p>

            {/* Score circle */}
            <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: `8px solid ${statusColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 35px auto',
                backgroundColor: 'var(--bg-color)',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)'
            }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary-color)', lineHeight: '1' }}>
                    {correctCount}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', borderTop: '2px solid #E2E8F0', paddingClassName: '5px 10px', marginTop: '4px', width: '60%' }}>
                    من {totalQuestions}
                </span>
            </div>

            {/* Details Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '35px',
                borderTop: '1px dashed var(--border-color)',
                borderBottom: '1px dashed var(--border-color)',
                padding: '20px 0'
            }}>
                <div>
                    <h4 style={{ color: 'var(--accent-islamic)', fontSize: '1.5rem', fontWeight: '800' }}>{correctCount}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>إجابات صحيحة</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--accent-arabic)', fontSize: '1.5rem', fontWeight: '800' }}>{wrongCount}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>إجابات خاطئة</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: '800' }}>{percentage}%</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>نسبة النجاح</p>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                    onClick={onRetake}
                    className="btn btn-outline"
                    style={{ padding: '12px 25px', fontSize: '0.95rem' }}
                >
                    🔄 إعادة خوض الاختبار
                </button>
                <button 
                    onClick={() => navigate(`/subject/${subjectId}/lesson/${lessonId}`)}
                    className="btn btn-primary"
                    style={{ padding: '12px 25px', fontSize: '0.95rem' }}
                >
                    📺 العودة إلى صفحة الدرس
                </button>
            </div>
        </div>
    );
};
