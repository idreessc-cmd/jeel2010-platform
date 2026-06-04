import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { quizService } from '../../services/quizService';
import { PartyPopper, Star, ThumbsUp, BookOpen, RotateCcw, Video, ClipboardList } from 'lucide-react';

export const QuizResult = ({ 
    score, 
    totalQuestions, 
    onRetake,
    subjectId,
    lessonId
}) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    
    const correctCount = score;
    const wrongCount = totalQuestions - score;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Fetch attempts history
    let attemptsHistory = [];
    if (user) {
        const allResults = quizService.getAllResults(user.email);
        const record = allResults[lessonId];
        if (record && record.history) {
            attemptsHistory = record.history;
        }
    }
    
    const attemptsCount = attemptsHistory.length;
    const avgScore = attemptsCount > 0
        ? Math.round((attemptsHistory.reduce((sum, att) => sum + att.score, 0) / attemptsCount) * 10) / 10
        : score;
    const avgPercentage = attemptsCount > 0
        ? Math.round(attemptsHistory.reduce((sum, att) => sum + att.percentage, 0) / attemptsCount)
        : percentage;

    // Choose status icon and text based on grade
    let StatusIcon = PartyPopper;
    let statusText = 'ممتاز! لقد اجتزت الاختبار بنجاح باهر';
    let statusColor = 'var(--accent-islamic)';
    
    if (percentage >= 80) {
        StatusIcon = Star;
        statusText = 'رائع جداً! مستوى متميز ومبهر';
        statusColor = 'var(--accent-islamic)';
    } else if (percentage >= 60) {
        StatusIcon = ThumbsUp;
        statusText = 'أحسنت! لقد نجحت في الاختبار، ويمكنك تحسين درجتك';
        statusColor = 'var(--primary-color)';
    } else {
        StatusIcon = BookOpen;
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
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: statusColor + '15', color: statusColor, marginBottom: '20px' }}>
                <StatusIcon size={44} />
            </div>
            
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
                margin: '0 auto 30px auto',
                backgroundColor: 'var(--bg-color)',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)'
            }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary-color)', lineHeight: '1' }}>
                    {correctCount}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', borderTop: '2px solid #E2E8F0', padding: '5px 10px', marginTop: '4px', width: '60%' }}>
                    من {totalQuestions}
                </span>
            </div>

            {/* Attempts Statistics Section */}
            {attemptsCount > 1 && (
                <div style={{
                    backgroundColor: 'var(--primary-light)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '15px 20px',
                    marginBottom: '30px',
                    border: '1px solid rgba(1, 113, 241, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <ClipboardList size={16} style={{ color: 'var(--primary-color)' }} />
                        <span>سجل محاولاتك في هذا الاختبار:</span>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '5px' }}>
                        <div>
                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary-color)' }}>{attemptsCount}</span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>المحاولات</p>
                        </div>
                        <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', height: '30px' }}></div>
                        <div>
                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-color)' }}>{avgScore} / {totalQuestions}</span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>متوسط الدرجات</p>
                        </div>
                        <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', height: '30px' }}></div>
                        <div>
                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-islamic)' }}>{avgPercentage}%</span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>نسبة النجاح</p>
                        </div>
                    </div>
                </div>
            )}

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
                    style={{ padding: '12px 25px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <RotateCcw size={16} />
                    <span>إعادة خوض الاختبار</span>
                </button>
                <button 
                    onClick={() => navigate(`/subject/${subjectId}/lesson/${lessonId}`)}
                    className="btn btn-primary"
                    style={{ padding: '12px 25px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <Video size={16} />
                    <span>العودة إلى صفحة الدرس</span>
                </button>
            </div>
        </div>
    );
};
