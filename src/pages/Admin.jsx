import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { mockSubjects } from '../data/subjects';
import { mockLessons, addLessonToSubject } from '../data/lessons';
import { addQuestionToQuiz } from '../data/quizzes';
import { AdminStats } from '../components/admin/AdminStats';
import { StudentsTable } from '../components/admin/StudentsTable';
import { LogOut, PlusCircle, Save, UserPlus } from 'lucide-react';

export const Admin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    
    // Form States
    const [lessonSubject, setLessonSubject] = useState('arabic');
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDesc, setLessonDesc] = useState('');
    const [lessonVideoId, setLessonVideoId] = useState('');
    const [lessonIsFree, setLessonIsFree] = useState(true);

    const [questionLesson, setQuestionLesson] = useState('arabic-l1');
    const [questionText, setQuestionText] = useState('');
    const [optA, setOptA] = useState('');
    const [optB, setOptB] = useState('');
    const [optC, setOptC] = useState('');
    const [optD, setOptD] = useState('');
    const [correctOpt, setCorrectOpt] = useState(0);

    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentSub, setNewStudentSub] = useState('free');

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        // If not logged in, redirect to login
        if (!currentUser) {
            alert('يرجى تسجيل الدخول كمسؤول للوصول إلى لوحة الإدارة.');
            navigate('/login');
            return;
        }

        // Get student list if admin
        if (currentUser.role === 'admin') {
            setStudents(authService.getStudents());
        }
    }, []);

    const handleToggleSubscription = (email, nextStatus) => {
        const res = authService.updateStudentSubscription(email, nextStatus);
        if (res.success) {
            setStudents(authService.getStudents());
            alert(`تم تغيير حالة اشتراك الطالب ${email} إلى: ${nextStatus === 'active' ? 'مشترك بالكامل' : 'تجريبي مجاني'} بنجاح!`);
        }
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!newStudentName || !newStudentEmail) {
            alert('يرجى ملء الاسم والبريد الإلكتروني للرمز التجريبي.');
            return;
        }

        const res = authService.addStudentManual({
            studentName: newStudentName,
            email: newStudentEmail,
            subscriptionStatus: newStudentSub
        });

        if (res.success) {
            setStudents(authService.getStudents());
            setNewStudentName('');
            setNewStudentEmail('');
            alert('تم إضافة الطالب التجريبي الجديد بنجاح في القائمة.');
        } else {
            alert(res.error);
        }
    };

    const handleAddLessonMock = (e) => {
        e.preventDefault();
        if (!lessonTitle || !lessonVideoId) {
            alert('يرجى تعبئة عنوان الدرس ومعرف فيديو اليوتيوب.');
            return;
        }

        const newLessonId = `${lessonSubject}-l${Date.now()}`;
        const newLesson = {
            id: newLessonId,
            title: `الدرس الجديد: ${lessonTitle}`,
            isFree: lessonIsFree,
            description: lessonDesc || 'تمت إضافة هذا الدرس حديثاً من لوحة الإدارة التجريبية.',
            pdfUrl: '#',
            lessonVideo: {
                provider: "youtube",
                videoId: lessonVideoId,
                isProtected: false,
                protectionNote: "MVP only"
            }
        };

        const res = addLessonToSubject(lessonSubject, `${lessonSubject}-u1`, newLesson);
        
        if (res.success) {
            alert(`تمت إضافة الدرس الجديد بنجاح وحفظه في LocalStorage!
المادة: ${lessonSubject}
العنوان: ${lessonTitle}
الوصول: ${lessonIsFree ? 'مجاني' : 'مدفوع'}`);
            
            // Clear
            setLessonTitle('');
            setLessonDesc('');
            setLessonVideoId('');
        }
    };

    const handleAddQuestionMock = (e) => {
        e.preventDefault();
        if (!questionText || !optA || !optB) {
            alert('يرجى كتابة نص السؤال وخيارين على الأقل.');
            return;
        }

        const options = [optA, optB];
        if (optC) options.push(optC);
        if (optD) options.push(optD);

        const newQuestion = {
            text: questionText,
            options: options,
            correctAnswer: correctOpt
        };

        const res = addQuestionToQuiz(questionLesson, newQuestion);
        
        if (res.success) {
            alert(`تمت إضافة السؤال الجديد للاختبار الخاص بالدرس [${questionLesson}] بنجاح وحفظه في LocalStorage!
السؤال: ${questionText}
الخيارات: ${options.join(' | ')}
الإجابة الصحيحة: الخيار رقم ${correctOpt + 1}`);

            // Clear
            setQuestionText('');
            setOptA('');
            setOptB('');
            setOptC('');
            setOptD('');
        }
    };

    const currentUserSession = authService.getCurrentUser();
    if (!currentUserSession || currentUserSession.role !== 'admin') {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center', minHeight: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '20px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800' }}>هذه الصفحة مخصصة للإدارة فقط.</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '1rem', lineHeight: '1.6' }}>ليست لديك الصلاحيات الكافية للوصول إلى لوحة الإدارة. إذا كنت طالباً، يمكنك العودة إلى لوحة الطالب الخاصة بك.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                    العودة إلى لوحة الطالب
                </button>
            </div>
        );
    }

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '20px',
                    marginBottom: '35px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <div>
                        <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0 }}>
                            لوحة الإدارة – منصة امتحان النجاح
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
                            لوحة إدارة الطلاب، والاشتراكات، والمناهج التدريسية
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => {
                            authService.logout();
                            navigate('/login');
                        }}
                        className="btn btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        <LogOut size={16} />
                        <span>خروج من لوحة الإدارة</span>
                    </button>
                </div>

                {/* Dashboard Stats Grid */}
                <AdminStats students={students} />

                {/* Students Management Table */}
                <StudentsTable students={students} onToggleSubscription={handleToggleSubscription} />

                {/* Add dynamic items forms */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '30px',
                    marginTop: '40px'
                }}>
                    
                    {/* Add Lesson Form */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '30px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PlusCircle size={20} style={{ color: 'var(--primary-color)' }} />
                            <span>إضافة درس جديد (تجريبي)</span>
                        </h3>
                        
                        <form onSubmit={handleAddLessonMock}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>اختر المادة:</label>
                                <select 
                                    value={lessonSubject}
                                    onChange={(e) => setLessonSubject(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                >
                                    {mockSubjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>عنوان الدرس:</label>
                                <input 
                                    type="text"
                                    value={lessonTitle}
                                    onChange={(e) => setLessonTitle(e.target.value)}
                                    placeholder="مثال: كان وأخواتها التامة"
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>معرف فيديو يوتيوب (Video ID):</label>
                                <input 
                                    type="text"
                                    value={lessonVideoId}
                                    onChange={(e) => setLessonVideoId(e.target.value)}
                                    placeholder="مثال: JgV10L1w6zM"
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', direction: 'ltr', textAlign: 'right' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>حالة الدرس الحالية:</label>
                                <select 
                                    value={lessonIsFree ? 'true' : 'false'}
                                    onChange={(e) => setLessonIsFree(e.target.value === 'true')}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                >
                                    <option value="true">درس مجاني للجميع</option>
                                    <option value="false">درس مدفوع (يطلب اشتراك)</option>
                                </select>
                            </div>

                             <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Save size={16} />
                                <span>حفظ الدرس تجريبياً</span>
                            </button>
                        </form>
                    </div>

                    {/* Add MCQ Question Form */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '30px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PlusCircle size={20} style={{ color: 'var(--primary-color)' }} />
                            <span>إضافة سؤال اختبار (تجريبي)</span>
                        </h3>
                        
                        <form onSubmit={handleAddQuestionMock}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>اختر الدرس المستهدف:</label>
                                <select 
                                    value={questionLesson}
                                    onChange={(e) => setQuestionLesson(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                >
                                    <option value="arabic-l1">اللغة العربية - الدرس الأول</option>
                                    <option value="math-l1">الرياضيات - الدرس الأول</option>
                                    <option value="history-l1">التاريخ - الدرس الأول</option>
                                    <option value="islamic-l1">التربية الإسلامية - الدرس الأول</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>نص السؤال:</label>
                                <input 
                                    type="text"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    placeholder="مثال: من هو كاتب معلقة الحوليات؟"
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                />
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '10px',
                                marginBottom: '15px'
                            }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>خيار أ:</label>
                                    <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-family)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>خيار ب:</label>
                                    <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-family)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>خيار جـ (اختياري):</label>
                                    <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-family)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>خيار د (اختياري):</label>
                                    <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-family)' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>الإجابة الصحيحة:</label>
                                <select 
                                    value={correctOpt}
                                    onChange={(e) => setCorrectOpt(parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                >
                                    <option value="0">خيار أ</option>
                                    <option value="1">خيار ب</option>
                                    <option value="2">خيار جـ</option>
                                    <option value="3">خيار د</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Save size={16} />
                                <span>حفظ السؤال تجريبياً</span>
                            </button>
                        </form>
                    </div>

                    {/* Add Dummy Student Form */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '30px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserPlus size={20} style={{ color: 'var(--primary-color)' }} />
                            <span>إضافة طالب تجريبي جديد</span>
                        </h3>
                        
                        <form onSubmit={handleAddStudent}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>اسم الطالب:</label>
                                <input 
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="مثال: سيف الدين طارق"
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>البريد الإلكتروني:</label>
                                <input 
                                    type="email"
                                    value={newStudentEmail}
                                    onChange={(e) => setNewStudentEmail(e.target.value)}
                                    placeholder="مثال: seif@example.com"
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>حالة الاشتراك المبدئية:</label>
                                <select 
                                    value={newStudentSub}
                                    onChange={(e) => setNewStudentSub(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)' }}
                                >
                                    <option value="free">تجريبي مجاني (أول درسين فقط)</option>
                                    <option value="active">مشترك بالكامل (كل المحتوى)</option>
                                </select>
                            </div>

                             <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <UserPlus size={16} />
                                <span>إضافة وتنشيط الطالب</span>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};
