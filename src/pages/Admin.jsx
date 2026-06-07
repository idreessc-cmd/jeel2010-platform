import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';
import { AdminStats } from '../components/admin/AdminStats';
import { StudentsTable } from '../components/admin/StudentsTable';
import { LogOut, PlusCircle, Save, UserPlus, BookOpen, ClipboardList, Users } from 'lucide-react';

export const Admin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    
    // Form States
    const [activeTab, setActiveTab] = useState('students');
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
    const [newStudentPhone, setNewStudentPhone] = useState('');
    const [newStudentSub, setNewStudentSub] = useState('free');

    const refreshStudentList = async () => {
        try {
            const data = await authService.getStudents();
            setStudents(data);
        } catch (err) {
            console.error("Failed to load students:", err);
        }
    };

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
            refreshStudentList();

            // Load subjects list
            contentService.getSubjects()
                .then(data => setSubjectsList(data))
                .catch(err => console.error("Failed to load subjects:", err));
        }
    }, []);

    const handleToggleSubscription = async (email, nextStatus) => {
        try {
            const res = await authService.updateStudentSubscription(email, nextStatus);
            if (res.success) {
                await refreshStudentList();
                alert(`تم تغيير حالة اشتراك الطالب ${email} إلى: ${nextStatus === 'active' ? 'مشترك بالكامل' : 'تجريبي مجاني'} بنجاح!`);
            } else {
                alert(res.error || 'فشلت عملية تحديث الاشتراك');
            }
        } catch (err) {
            alert('حدث خطأ أثناء تغيير حالة الاشتراك');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!newStudentName || !newStudentEmail) {
            alert('يرجى ملء الاسم والبريد الإلكتروني.');
            return;
        }

        try {
            const res = await authService.addStudentManual({
                studentName: newStudentName,
                email: newStudentEmail,
                phone: newStudentPhone,
                subscriptionStatus: newStudentSub
            });

            if (res.success) {
                await refreshStudentList();
                setNewStudentName('');
                setNewStudentEmail('');
                setNewStudentPhone('');
                
                if (res.exists) {
                    alert('الحساب موجود مسبقًا، تم تحديث بيانات الطالب وصلاحياته بنجاح.');
                } else {
                    alert('تم إنشاء دعوة للطالب بنجاح. عندما يسجل الطالب بنفس البريد سيتم تطبيق الصلاحيات تلقائيًا.');
                }
            } else {
                alert(res.error || 'فشلت عملية إضافة الطالب/الدعوة');
            }
        } catch (err) {
            alert('حدث خطأ أثناء إضافة الطالب الجديد');
        }
    };

    const handleAddLessonMock = async (e) => {
        e.preventDefault();
        if (!lessonTitle || !lessonVideoId) {
            alert('يرجى تعبئة عنوان الدرس ومعرف فيديو اليوتيوب.');
            return;
        }

        const newLessonId = `${lessonSubject}-l${Date.now()}`;
        const newLesson = {
            id: newLessonId,
            title: lessonTitle,
            isFree: lessonIsFree,
            description: lessonDesc || 'تمت إضافة هذا الدرس حديثاً من لوحة الإدارة.',
            pdfUrl: '#',
            lessonVideo: {
                provider: "youtube",
                videoId: lessonVideoId,
                isProtected: false,
                protectionNote: "VIP only"
            }
        };

        const res = await contentService.addLessonToSubject(lessonSubject, `${lessonSubject}-u1`, newLesson);
        
        if (res.success) {
            alert(`تمت إضافة الدرس الجديد بنجاح!
المادة: ${lessonSubject}
العنوان: ${lessonTitle}
الوصول: ${lessonIsFree ? 'مجاني' : 'مدفوع'}`);
            
            // Clear
            setLessonTitle('');
            setLessonDesc('');
            setLessonVideoId('');
        } else {
            alert(res.error || 'فشلت عملية إضافة الدرس');
        }
    };

    const handleAddQuestionMock = async (e) => {
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

        const res = await contentService.addQuestionToQuiz(questionLesson, newQuestion);
        
        if (res.success) {
            alert(`تمت إضافة السؤال الجديد للاختبار الخاص بالدرس [${questionLesson}] بنجاح!
السؤال: ${questionText}
الخيارات: ${options.join(' | ')}
الإجابة الصحيحة: الخيار رقم ${correctOpt + 1}`);

            // Clear
            setQuestionText('');
            setOptA('');
            setOptB('');
            setOptC('');
            setOptD('');
        } else {
            alert(res.error || 'فشلت عملية إضافة السؤال');
        }
    };

    const tabStyle = (tabId) => ({
        padding: '10px 18px',
        borderRadius: 'var(--border-radius-pill)',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'var(--transition)',
        border: activeTab === tabId ? '1px solid var(--primary-color)' : '1px solid transparent',
        backgroundColor: activeTab === tabId ? 'var(--primary-light)' : 'transparent',
        color: activeTab === tabId ? 'var(--primary-color)' : 'var(--text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        flexGrow: 1,
        justifyContent: 'center',
        minWidth: '120px'
    });

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
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                
                {/* Hero Section */}
                <div style={{
                    backgroundColor: 'var(--primary-color)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '30px 24px',
                    marginBottom: '30px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    {/* Decorative blurred circles */}
                    <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-100px', left: '-50px', filter: 'blur(20px)' }}></div>
                    <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '-50px', right: '-50px', filter: 'blur(10px)' }}></div>
                    
                    <div style={{ zIndex: 1, position: 'relative' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 8px 0', color: '#FFFFFF' }}>
                            لوحة الإدارة – منصة امتحان النجاح
                        </h1>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.6' }}>
                            إدارة الطلاب، الاشتراكات، الدروس، والاختبارات من مكان واحد.
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            authService.logout();
                            navigate('/login');
                        }}
                        className="btn"
                        style={{ 
                            backgroundColor: '#FFFFFF', 
                            color: 'var(--primary-color)', 
                            border: 'none',
                            zIndex: 1,
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            fontSize: '0.9rem',
                            borderRadius: 'var(--border-radius-pill)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <LogOut size={16} />
                        <span>خروج من لوحة الإدارة</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <AdminStats students={students} />

                {/* Tabs Navigation */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '30px',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '12px',
                    width: '100%'
                }}>
                    <button 
                        onClick={() => setActiveTab('students')}
                        style={tabStyle('students')}
                    >
                        <Users size={18} />
                        <span>الطلاب والاشتراكات</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('add-lesson')}
                        style={tabStyle('add-lesson')}
                    >
                        <BookOpen size={18} />
                        <span>إضافة درس</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('add-quiz')}
                        style={tabStyle('add-quiz')}
                    >
                        <ClipboardList size={18} />
                        <span>إضافة سؤال</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('add-student')}
                        style={tabStyle('add-student')}
                    >
                        <UserPlus size={18} />
                        <span>إضافة طالب</span>
                    </button>
                </div>

                {/* Tab Panels */}
                <div style={{ width: '100%' }}>
                    
                    {/* Tab: Students & Subscriptions */}
                    {activeTab === 'students' && (
                        <div>
                            <StudentsTable 
                                students={students} 
                                onToggleSubscription={handleToggleSubscription} 
                                onRefresh={refreshStudentList} 
                            />
                        </div>
                    )}

                    {/* Tab: Add Lesson */}
                    {activeTab === 'add-lesson' && (
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            width: '100%'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlusCircle size={20} style={{ color: 'var(--primary-color)' }} />
                                <span>إضافة درس جديد</span>
                            </h3>
                            
                            <form onSubmit={handleAddLessonMock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>اختر المادة:</label>
                                    <select 
                                        value={lessonSubject}
                                        onChange={(e) => setLessonSubject(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    >
                                        {subjectsList.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>عنوان الدرس:</label>
                                    <input 
                                        type="text"
                                        value={lessonTitle}
                                        onChange={(e) => setLessonTitle(e.target.value)}
                                        placeholder="مثال: مقدمة في الحركة الدائرية"
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>معرف فيديو يوتيوب (Video ID):</label>
                                    <input 
                                        type="text"
                                        value={lessonVideoId}
                                        onChange={(e) => setLessonVideoId(e.target.value)}
                                        placeholder="مثال: dQw4w9WgXcQ"
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', direction: 'ltr', textAlign: 'right', backgroundColor: '#F8FAFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>حالة الدرس:</label>
                                    <select 
                                        value={lessonIsFree ? 'true' : 'false'}
                                        onChange={(e) => setLessonIsFree(e.target.value === 'true')}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    >
                                        <option value="true">درس مجاني للجميع</option>
                                        <option value="false">درس للمشتركين فقط</option>
                                    </select>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    سيتم حفظ الدرس حسب نظام التخزين الحالي.
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                                    <Save size={16} />
                                    <span>حفظ الدرس</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Tab: Add Question */}
                    {activeTab === 'add-quiz' && (
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            width: '100%'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlusCircle size={20} style={{ color: 'var(--primary-color)' }} />
                                <span>إضافة سؤال اختبار</span>
                            </h3>
                            
                            <form onSubmit={handleAddQuestionMock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>اختر الدرس المستهدف:</label>
                                    <select 
                                        value={questionLesson}
                                        onChange={(e) => setQuestionLesson(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    >
                                        <option value="arabic-l1">اللغة العربية - الدرس الأول</option>
                                        <option value="math-l1">الرياضيات - الدرس الأول</option>
                                        <option value="history-l1">التاريخ - الدرس الأول</option>
                                        <option value="islamic-l1">التربية الإسلامية - الدرس الأول</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>نص السؤال:</label>
                                    <input 
                                        type="text"
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="اكتب نص السؤال هنا..."
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>خيار أ:</label>
                                        <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="الخيار الأول" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>خيار ب:</label>
                                        <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="الخيار الثاني" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>خيار جـ (اختياري):</label>
                                        <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="الخيار الثالث" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>خيار د (اختياري):</label>
                                        <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="الخيار الرابع" style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>الإجابة الصحيحة:</label>
                                    <select 
                                        value={correctOpt}
                                        onChange={(e) => setCorrectOpt(parseInt(e.target.value))}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    >
                                        <option value="0">خيار أ</option>
                                        <option value="1">خيار ب</option>
                                        <option value="2">خيار جـ</option>
                                        <option value="3">خيار د</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                                    <Save size={16} />
                                    <span>حفظ السؤال</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Tab: Add Student */}
                    {activeTab === 'add-student' && (
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            width: '100%'
                        }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserPlus size={20} style={{ color: 'var(--primary-color)' }} />
                                <span>إضافة طالب جديد</span>
                            </h3>
                            
                            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>اسم الطالب الكامل:</label>
                                    <input 
                                        type="text"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                        placeholder="مثال: أحمد عبد الله"
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>البريد الإلكتروني:</label>
                                    <input 
                                        type="email"
                                        value={newStudentEmail}
                                        onChange={(e) => setNewStudentEmail(e.target.value)}
                                        placeholder="example@email.com"
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>رقم الهاتف (اختياري):</label>
                                    <input 
                                        type="tel"
                                        value={newStudentPhone}
                                        onChange={(e) => setNewStudentPhone(e.target.value)}
                                        placeholder="مثال: 0790000000"
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>حالة الاشتراك المبدئية:</label>
                                    <select 
                                        value={newStudentSub}
                                        onChange={(e) => setNewStudentSub(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-family)', backgroundColor: '#F8FAFC' }}
                                    >
                                        <option value="free">مجاني (أول درسين فقط)</option>
                                        <option value="active">مشترك بالكامل (كل المحتوى)</option>
                                        <option value="custom">صلاحيات مخصصة (تحدد من جدول الطلاب)</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                                    <UserPlus size={16} />
                                    <span>إضافة الطالب / إنشاء دعوة</span>
                                </button>
                            </form>
                        </div>
                    )}

                </div>

            </div>
        </section>
    );
};
