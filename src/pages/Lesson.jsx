import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockSubjects } from '../data/subjects';
import { mockLessons } from '../data/lessons';
import { authService } from '../services/authService';
import { progressService } from '../services/progressService';
import { subscriptionService } from '../services/subscriptionService';
import { CurriculumSidebar } from '../components/subjects/CurriculumSidebar';
import { VideoPlayerSection } from '../components/lesson/VideoPlayerSection';
import { PdfSection } from '../components/lesson/PdfSection';
import { LessonNavigation } from '../components/lesson/LessonNavigation';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Lock, MessageCircle, PartyPopper, Lightbulb, CheckCircle2, Circle } from 'lucide-react';

export const Lesson = () => {
    const { subjectId, lessonId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);

    // Find subject & lessons list
    const subject = mockSubjects.find(s => s.id === subjectId);
    const units = mockLessons[subjectId] || [];
    const allLessons = units.flatMap(unit => unit.lessons);
    
    // Find current lesson
    const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
    const lesson = allLessons[lessonIndex];

    // Find prev/next lessons
    const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
            const completed = progressService.isLessonComplete(currentUser.email, lessonId);
            setIsCompleted(completed);
            setCompletedLessonIds(progressService.getCompletedLessons(currentUser.email));
            
            // Phase B: Auto-save last viewed lesson
            progressService.setLastViewedLesson(currentUser.email, subjectId, lessonId);
        }
    }, [lessonId, subjectId]);

    if (!subject || !lesson) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2>الدرس غير موجود</h2>
                <p>يرجى التأكد من الرابط الصحيح.</p>
                <Link to="/subjects" className="btn btn-primary">العودة للمواد</Link>
            </div>
        );
    }

    const hasAccess = subscriptionService.hasAccessToLesson(lesson, user);

    const handleToggleComplete = () => {
        if (!user) {
            alert('يرجى تسجيل الدخول أولاً لتسجيل تقدمك الدراسي.');
            return;
        }
        const nextState = !isCompleted;
        progressService.markLessonComplete(user.email, lessonId, nextState);
        setIsCompleted(nextState);
        // Refresh completed list
        setCompletedLessonIds(progressService.getCompletedLessons(user.email));
    };

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="container">
                {/* Back Link */}
                <div style={{ marginBottom: '20px' }}>
                    <Link to={`/subject/${subjectId}`} style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowRight size={18} />
                        العودة لقائمة دروس مادة {subject.title}
                    </Link>
                </div>

                <div className="lesson-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '2.2fr 0.8fr',
                    gap: '40px',
                    alignItems: 'start'
                }}>
                    
                    {/* Main Lesson Content Area */}
                    <div className="lesson-content-card" style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '35px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                    }}>
                        
                        {/* Title bar */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            gap: '15px',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '20px',
                            marginBottom: '30px'
                        }}>
                            <div>
                                <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: '0 0 5px 0' }}>
                                    {lesson.title}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                                    {lesson.description}
                                </p>
                            </div>
                            
                            <div>
                                {lesson.isFree ? (
                                    <Badge type="success">شرح مجاني</Badge>
                                ) : (
                                    <Badge type="primary">محتوى كامل العضوية</Badge>
                                )}
                            </div>
                        </div>

                        {/* Lock Warning Overlay Card or Content Render */}
                        {!hasAccess ? (
                            <div className="locked-content-box">
                                <Lock size={48} className="locked-icon" style={{ color: 'var(--secondary-color)', margin: '0 auto 20px auto', display: 'block' }} />
                                <h3>هذا الدرس مغلق ويتطلب اشتراكاً</h3>
                                <p>هذا الدرس جزء من باقة الوصول الكامل لمنهج الصف الأول الثانوي لجيل 2010. لتتمكن من المتابعة وحل الاختبارات وتحميل الملخصات، يرجى تفعيل اشتراكك.</p>
                                
                                <div className="locked-actions">
                                    <a href="https://wa.me/201012345678" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <MessageCircle size={18} />
                                        تواصل وتفعيل عبر واتساب
                                    </a>
                                    <a href="#footer" className="btn btn-outline">
                                        معرفة تفاصيل الدفع
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Video Player Section */}
                                <VideoPlayerSection lessonVideo={lesson.lessonVideo} />
                                
                                {/* Completion Toggle */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '18px 25px',
                                    backgroundColor: isCompleted ? 'var(--bg-islamic)' : 'var(--bg-math)',
                                    borderRadius: 'var(--border-radius-md)',
                                    marginBottom: '30px',
                                    borderLeft: `5px solid ${isCompleted ? 'var(--accent-islamic)' : 'var(--primary-color)'}`
                                }}>
                                    <div>
                                        <h5 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {isCompleted ? <PartyPopper size={18} style={{ color: 'var(--accent-islamic)' }} /> : <Lightbulb size={18} style={{ color: 'var(--primary-color)' }} />}
                                            {isCompleted ? 'لقد أكملت دراسة هذا الدرس!' : 'هل انتهيت من دراسة الدرس بالكامل؟'}
                                        </h5>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                            قم بتعليم الدرس كمكتمل لتسجيل تقدمك في المادة.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={handleToggleComplete}
                                        className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
                                        style={{ 
                                            padding: '8px 18px', 
                                            fontSize: '0.9rem',
                                            borderColor: isCompleted ? 'var(--accent-islamic)' : 'var(--primary-color)',
                                            color: isCompleted ? 'var(--accent-islamic)' : '#FFF',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                        {isCompleted ? 'مكتمل (اضغط للإلغاء)' : 'تم الانتهاء والمذاكرة'}
                                    </button>
                                </div>

                                {/* PDF Summary Download */}
                                <PdfSection pdfUrl={lesson.pdfUrl} lessonTitle={lesson.title} />
                                
                                {/* Navigation buttons */}
                                <LessonNavigation 
                                    subjectId={subjectId}
                                    prevLesson={prevLesson}
                                    nextLesson={nextLesson}
                                    lessonId={lessonId}
                                    user={user}
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Sticky Sidebar Right */}
                    <div className="lesson-sidebar-wrapper" style={{ position: 'sticky', top: '100px' }}>
                        <CurriculumSidebar 
                            subject={subject}
                            units={units}
                            user={user}
                            completedLessonIds={completedLessonIds}
                            activeLessonId={lessonId}
                        />
                    </div>
                </div>
            </div>
            {/* Inject media queries style override */}
            <style>{`
                @media (max-width: 1024px) {
                    .lesson-grid {
                        grid-template-columns: 1fr !important;
                        gap: 25px !important;
                    }
                    .lesson-sidebar-wrapper {
                        position: static !important;
                    }
                }
                @media (max-width: 768px) {
                    .lesson-content-card {
                        padding: 20px !important;
                    }
                }
            `}</style>
        </section>
    );
};
