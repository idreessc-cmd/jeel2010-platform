import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockSubjects } from '../data/subjects';
import { mockLessons } from '../data/lessons';
import { authService } from '../services/authService';
import { progressService } from '../services/progressService';
import { subscriptionService } from '../services/subscriptionService';
import { UnitAccordion } from '../components/subjects/UnitAccordion';
import { Badge } from '../components/ui/Badge';

export const SubjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('lessons'); // lessons, overview, quizzes, files
    const [completedLessons, setCompletedLessons] = useState([]);
    
    // Find matching subject
    const subject = mockSubjects.find(s => s.id === id);
    const units = mockLessons[id] || [];

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
            setCompletedLessons(progressService.getCompletedLessons(currentUser.email));
        }
    }, [id]);

    if (!subject) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2>المادة غير موجودة</h2>
                <p>يرجى التأكد من الرابط الصحيح.</p>
                <Link to="/subjects" className="btn btn-primary" style={{ marginTop: '20px' }}>العودة للمواد</Link>
            </div>
        );
    }

    // Flatten lessons to calculate statistics
    const allLessons = units.flatMap(unit => unit.lessons);
    const progress = user ? progressService.getSubjectProgressPercentage(user.email, allLessons) : 0;
    const completedCount = allLessons.filter(l => completedLessons.includes(l.id)).length;
    
    const isSubscribed = user && user.subscriptionStatus === 'active';

    return (
        <section className="section-padding">
            <div className="container">
                {/* Course Header */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '40px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '35px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '30px'
                }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <span style={{ fontSize: '3rem' }}>{subject.icon}</span>
                            <div>
                                <h1 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0 }}>
                                    منهج {subject.title}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>المعلم: {subject.teacher}</p>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.8' }}>
                            {subject.description}
                        </p>
                        
                        {/* Progress Bar (Only show if logged in) */}
                        {user && (
                            <div style={{ maxWidth: '400px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    <span>تقدمك الدراسي في المادة:</span>
                                    <span style={{ color: 'var(--primary-color)' }}>{progress}% ({completedCount} من {allLessons.length} دروس)</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '50px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '50px', transition: 'var(--transition)' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subscription & Call to Action Box */}
                    <div style={{
                        width: '100%',
                        maxWidth: '320px',
                        backgroundColor: 'var(--bg-color)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '25px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px dashed var(--border-color)',
                        textAlign: 'center'
                    }}>
                        {user ? (
                            <>
                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '10px' }}>حالة اشتراكك:</h4>
                                <div style={{ marginBottom: '20px' }}>
                                    <Badge type={isSubscribed ? 'success' : 'primary'} className="badge-lg">
                                        {isSubscribed ? '👑 الباقة كاملة الوصول' : '🔓 الحساب التجريبي المجاني'}
                                    </Badge>
                                </div>
                                
                                {isSubscribed ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                        مرحباً بك! جميع دروس هذه المادة مفتوحة ومتاحة لك بالكامل الآن. نتمنى لك تفوقاً باهراً.
                                    </p>
                                ) : (
                                    <>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                            يمكنك مشاهدة أول درسين مجاناً، ويجب تفعيل الباقة لمشاهدة المنهج كاملاً.
                                        </p>
                                        <a href="#footer" className="btn btn-primary">💎 اشترك لفتح المادة كاملة</a>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '10px' }}>سجل دخولك لبدء التعلم</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                    سجل حسابك مجاناً لتسجيل تقدمك وحل الاختبارات ومشاهدة الشروحات.
                                </p>
                                <button onClick={() => navigate('/login')} className="btn btn-primary">🔐 تسجيل دخول تجريبي</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="tabs-header">
                    <button 
                        onClick={() => setActiveTab('lessons')}
                        className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
                    >
                        📚 المحتوى والدروس
                    </button>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                        🔍 نظرة عامة عن المادة
                    </button>
                    <button 
                        onClick={() => setActiveTab('quizzes')}
                        className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
                    >
                        📝 الاختبارات
                    </button>
                    <button 
                        onClick={() => setActiveTab('files')}
                        className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                    >
                        📥 الملفات والمذكرات
                    </button>
                </div>

                {/* Tab content rendering */}
                <div style={{ minHeight: '300px' }}>
                    {activeTab === 'lessons' && (
                        <div>
                            {units.length > 0 ? (
                                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                                    {units.map((unit, index) => (
                                        <UnitAccordion 
                                            key={unit.unitId}
                                            unit={unit}
                                            subjectId={subject.id}
                                            user={user}
                                            completedLessonIds={completedLessons}
                                            activeLessonId={null}
                                            defaultOpen={index === 0}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>قريباً سيتم إضافة محتوى المادة الدراسية بالكامل.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: '35px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            maxWidth: '850px',
                            margin: '0 auto',
                            lineHeight: '1.8'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '15px' }}>أهداف دراسة منهج {subject.title}:</h3>
                            <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '30px' }}>
                                {subject.objectives}
                            </p>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '15px' }}>توزيع المنهج للترم الأول:</h3>
                            <ul style={{ paddingRight: '20px', listStyleType: 'decimal', color: 'var(--text-muted)' }}>
                                <li>الشهر الأول: شرح الوحدات الأولى والمفاهيم التأسيسية للمادة.</li>
                                <li>الشهر الثاني: دروس التعمق وحل التدريبات والواجبات الدورية.</li>
                                <li>الشهر الثالث: مراجعة عامة وحل امتحانات السنوات السابقة والاختبارات التفاعلية الشاملة.</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
                            <div style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 'var(--border-radius-lg)',
                                padding: '40px',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>📝</span>
                                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '10px' }}>الاختبارات التقييمية للمادة</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 25px auto' }}>
                                    يحتوي كل درس على اختبار تقييمي تفاعلي من 5 أسئلة، يمكنك الدخول إليه بعد تصفح الدرس لتقييم فهمك وحفظ نتيجتك.
                                </p>
                                <button 
                                    onClick={() => setActiveTab('lessons')} 
                                    className="btn btn-primary"
                                >
                                    👀 تصفح قائمة الدروس لبدء اختباراتها
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                            <div style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 'var(--border-radius-lg)',
                                padding: '45px 30px',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--border-color)',
                                textAlign: 'center'
                            }}>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>📚</span>
                                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginBottom: '10px' }}>مركز تحميل ملفات المادة</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 30px auto' }}>
                                    مذكرات الشرح وتلخيص الدروس بصيغة PDF قابلة للتحميل والطباعة متوفرة ومرفقة داخل كل درس دراسي.
                                </p>
                                
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '15px',
                                    flexWrap: 'wrap'
                                }}>
                                    {isSubscribed ? (
                                        <button 
                                            onClick={() => alert('ميزة تجريبية: جاري تجميع كل ملفات الـ PDF في أرشيف واحد لتحميلها!')}
                                            className="btn btn-primary"
                                        >
                                            📥 تحميل كل مذكرات المادة (PDF) دفعة واحدة
                                        </button>
                                    ) : (
                                        <div style={{ padding: '15px 25px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--border-radius-md)', border: '1px dashed var(--primary-color)' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>🔒 ميزة تحميل كافة مذكرات الـ PDF مقصورة على المشتركين بالكامل.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
