import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { progressService } from '../services/progressService';
import { quizService } from '../services/quizService';
import { mockSubjects } from '../data/subjects';
import { mockLessons } from '../data/lessons';
import { Badge } from '../components/ui/Badge';
import { 
    GraduationCap, 
    Award, 
    Unlock, 
    Gem, 
    Play, 
    CheckCircle2, 
    ClipboardList, 
    BookOpen, 
    ChevronLeft, 
    MessageCircle,
    User
} from 'lucide-react';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [lastViewed, setLastViewed] = useState(null);
    const [quizLogs, setQuizLogs] = useState([]);
    const [subjectProgress, setSubjectProgress] = useState([]);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);

        // Load last viewed lesson
        const lastViewedData = progressService.getLastViewedLesson(currentUser.email);
        if (lastViewedData) {
            // Find lesson details
            const units = mockLessons[lastViewedData.subjectId] || [];
            const lesson = units.flatMap(u => u.lessons).find(l => l.id === lastViewedData.lessonId);
            const subject = mockSubjects.find(s => s.id === lastViewedData.subjectId);
            
            if (lesson && subject) {
                setLastViewed({
                    subjectId: lastViewedData.subjectId,
                    lessonId: lastViewedData.lessonId,
                    lessonTitle: lesson.title,
                    subjectTitle: subject.title
                });
            }
        }

        // Calculate progress for each subject
        const progressList = mockSubjects.map(subject => {
            const units = mockLessons[subject.id] || [];
            const allLessons = units.flatMap(u => u.lessons);
            const progress = progressService.getSubjectProgressPercentage(currentUser.email, allLessons);
            const completedCount = allLessons.filter(l => 
                progressService.isLessonComplete(currentUser.email, l.id)
            ).length;

            return {
                id: subject.id,
                title: subject.title,
                themeClass: subject.themeClass,
                totalLessons: allLessons.length,
                completedCount,
                percentage: progress
            };
        });
        setSubjectProgress(progressList);

        // Load quiz logs
        const allQuizzes = quizService.getAllResults(currentUser.email);
        const logs = [];
        
        // Loop through subjects to map quizzes
        mockSubjects.forEach(sub => {
            const units = mockLessons[sub.id] || [];
            units.forEach(unit => {
                unit.lessons.forEach(lesson => {
                    const quizResult = allQuizzes[lesson.id];
                    if (quizResult) {
                        const history = quizResult.history || [quizResult];
                        const latestAttempt = quizResult.latest || quizResult;
                        logs.push({
                            subjectId: sub.id,
                            subjectTitle: sub.title,
                            lessonId: lesson.id,
                            lessonTitle: lesson.title,
                            score: latestAttempt.score,
                            total: latestAttempt.total,
                            percentage: latestAttempt.percentage,
                            date: latestAttempt.date,
                            attemptsCount: history.length
                        });
                    }
                });
            });
        });
        setQuizLogs(logs);
    }, [navigate]);

    if (!user) return null;

    const isSubscribed = user.subscriptionStatus === 'active';
    const totalCompletedLessons = subjectProgress.reduce((sum, sp) => sum + sp.completedCount, 0);
    const totalLessonsCount = subjectProgress.reduce((sum, sp) => sum + sp.totalLessons, 0);
    const overallProgressPercent = totalLessonsCount > 0 
        ? Math.round((totalCompletedLessons / totalLessonsCount) * 100) 
        : 0;

    const subjectThemes = {
        arabic: 'var(--accent-arabic)',
        math: 'var(--accent-math)',
        history: 'var(--accent-history)',
        islamic: 'var(--accent-islamic)'
    };

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 350px)' }}>
            <div className="container">
                {/* Greeting Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '30px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                            width: '70px', 
                            height: '70px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--primary-light)', 
                            color: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <GraduationCap size={36} />
                        </div>
                        <div>
                            <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0, fontSize: '1.6rem' }}>
                                مرحباً بك مجدداً، {user.studentName}!
                            </h2>
                            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
                                نتمنى لك دراسة ممتعة وتفوقاً مستمراً في مناهج الأول الثانوي.
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{
                            backgroundColor: '#F1F5F9',
                            padding: '8px 16px',
                            borderRadius: 'var(--border-radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '700'
                        }}>
                            <CheckCircle2 size={16} style={{ color: 'var(--accent-islamic)' }} />
                            <span>مكتمل: {totalCompletedLessons} من {totalLessonsCount} درس</span>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Cards */}
                <div className="dashboard-top-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '30px',
                    marginBottom: '30px'
                }}>
                    {/* Resume Learning / Account Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Resume Card */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: '30px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Play size={20} style={{ color: 'var(--primary-color)' }} />
                                <span>تابع طريق علمك:</span>
                            </h3>
                            
                            {lastViewed ? (
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '8px' }}>
                                        آخر درس كنت تتصفحه هو:
                                    </p>
                                    <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BookOpen size={16} style={{ color: 'var(--primary-color)' }} />
                                        <span>{lastViewed.lessonTitle} ({lastViewed.subjectTitle})</span>
                                    </h4>
                                    <Link 
                                        to={`/subject/${lastViewed.subjectId}/lesson/${lastViewed.lessonId}`}
                                        className="btn btn-primary"
                                        style={{ display: 'inline-flex', alignSelf: 'flex-start' }}
                                    >
                                        <span>استكمال المذاكرة الآن</span>
                                        <ChevronLeft size={16} />
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                                        لم تقم بفتح أي درس مؤخراً. تصفح المواد المتاحة واختر أحد الدروس لتبدأ رحلتك التعليمية!
                                    </p>
                                    <Link 
                                        to="/subjects"
                                        className="btn btn-primary"
                                        style={{ display: 'inline-flex', alignSelf: 'flex-start' }}
                                    >
                                        <span>تصفح المواد الدراسية</span>
                                        <ChevronLeft size={16} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subscription Card */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '30px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: isSubscribed ? 'var(--bg-islamic)' : 'var(--primary-light)',
                            color: isSubscribed ? 'var(--accent-islamic)' : 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px'
                        }}>
                            {isSubscribed ? <Gem size={30} /> : <Unlock size={30} />}
                        </div>
                        
                        <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.25rem', marginBottom: '10px' }}>
                            حالة عضوية الحساب
                        </h4>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <Badge type={isSubscribed ? 'success' : 'primary'} className="badge-lg">
                                {isSubscribed ? 'مشترك بالكامل' : 'عضوية تجريبية مجانية'}
                            </Badge>
                        </div>

                        {isSubscribed ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
                                رائع! حسابك مفعل بالكامل ومفتوح لك كافة الوحدات والدروس والملفات والاختبارات بلا أي قيود.
                            </p>
                        ) : (
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.7' }}>
                                    أنت تتصفح المنصة بالعضوية التجريبية المجانية (تفتح أول درسين فقط من كل مادة).
                                </p>
                                <a 
                                    href="https://wa.me/201012345678?text=مرحباً، أريد تفعيل باقة الوصول الكامل لحساب الطالب: "
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
                                >
                                    <MessageCircle size={16} />
                                    <span>ترقية الباقة عبر واتساب</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Grid */}
                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={22} style={{ color: 'var(--primary-color)' }} />
                    <span>تقدمك الدراسي في المواد:</span>
                </h3>
                
                <div className="subjects-grid" style={{ marginBottom: '40px' }}>
                    {subjectProgress.map((sp) => {
                        const themeColor = subjectThemes[sp.id] || 'var(--primary-color)';
                        return (
                            <div key={sp.id} className={`subject-card ${sp.themeClass}`} style={{ position: 'relative' }}>
                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.25rem', marginBottom: '15px' }}>
                                    {sp.title}
                                </h4>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>معدل الإنجاز:</span>
                                    <span style={{ color: themeColor }}>{sp.percentage}%</span>
                                </div>
                                
                                <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '50px', overflow: 'hidden', marginBottom: '15px' }}>
                                    <div style={{ width: `${sp.percentage}%`, height: '100%', backgroundColor: themeColor, borderRadius: '50px', transition: 'var(--transition)' }}></div>
                                </div>
                                
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px', marginTop: 0 }}>
                                    أتممت دراسة {sp.completedCount} من أصل {sp.totalLessons} دروس مقررة.
                                </p>
                                
                                <Link 
                                    to={`/subject/${sp.id}`}
                                    className="subject-btn"
                                    style={{ textClassName: 'center', border: 'none', cursor: 'pointer', width: '100%', marginTop: 'auto' }}
                                >
                                    عرض المنهج
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Quizzes Logs Section */}
                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={22} style={{ color: 'var(--primary-color)' }} />
                    <span>سجل الاختبارات الأخيرة:</span>
                </h3>

                <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden'
                }}>
                    {quizLogs.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                textAlign: 'right',
                                fontSize: '0.95rem'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>المادة</th>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>الدرس</th>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>آخر تاريخ محاولة</th>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>عدد المحاولات</th>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>الدرجة الأخيرة</th>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>نسبة النجاح</th>
                                        <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>الإجراء</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quizLogs.map((log, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                                            <td style={{ padding: '15px 25px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{log.subjectTitle}</td>
                                            <td style={{ padding: '15px 25px', color: 'var(--text-main)' }}>{log.lessonTitle}</td>
                                            <td style={{ padding: '15px 25px', color: 'var(--text-muted)' }}>{log.date}</td>
                                            <td style={{ padding: '15px 25px', textAlign: 'center', fontWeight: 'bold' }}>{log.attemptsCount}</td>
                                            <td style={{ padding: '15px 25px', textAlign: 'center', fontWeight: 'bold', color: log.percentage >= 60 ? 'var(--accent-islamic)' : 'var(--accent-arabic)' }}>
                                                {log.score} / {log.total}
                                            </td>
                                            <td style={{ padding: '15px 25px', textAlign: 'center' }}>
                                                <Badge type={log.percentage >= 80 ? 'success' : log.percentage >= 60 ? 'warning' : 'primary'}>
                                                    {log.percentage}%
                                                </Badge>
                                            </td>
                                            <td style={{ padding: '15px 25px', textAlign: 'center' }}>
                                                <Link 
                                                    to={`/subject/${log.subjectId}/lesson/${log.lessonId}/quiz`}
                                                    className="btn btn-outline"
                                                    style={{ padding: '5px 12px', fontSize: '0.8rem', borderRadius: 'var(--border-radius-sm)' }}
                                                >
                                                    إعادة الاختبار
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <ClipboardList size={40} style={{ color: '#CBD5E1', marginBottom: '10px' }} />
                            <p style={{ margin: 0 }}>لم تقم بحل أي اختبار تقييمي بعد. خض الاختبارات المتاحة تحت كل درس لقياس فهمك وحفظ نتائجك!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inline CSS Helper for Dashboard layout responsiveness */}
            <style>{`
                @media (max-width: 991px) {
                    .dashboard-top-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};
