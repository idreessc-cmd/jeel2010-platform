import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { 
    UserCheck, UserX, User, Mail, Calendar, Search, Filter, 
    KeyRound, Trash2, Settings, X, Info, ChevronDown, ChevronUp, 
    Check, Lock, ShieldAlert, Award, RefreshCw, BookOpen, ClipboardList,
    Send, Phone
} from 'lucide-react';
import { authService } from '../../services/authService';
import { contentService } from '../../services/contentService';
import { subscriptionService } from '../../services/subscriptionService';

export const StudentsTable = ({ students = [], onToggleSubscription, onRefresh }) => {
    // Sub Tab State
    const [activeSubTab, setActiveSubTab] = useState('registered'); // 'registered' | 'invites'

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('joinDate');
    const [sortOrder, setSortOrder] = useState('desc');

    // Invitations State
    const [invites, setInvites] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(false);

    // Access Control Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [activeAccessTab, setActiveAccessTab] = useState('subjects'); // 'subjects' | 'units' | 'lessons' | 'quizzes'
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    
    // Content data cache for modal
    const [allSubjects, setAllSubjects] = useState([]);
    const [allUnits, setAllUnits] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [loadingAccessData, setLoadingAccessData] = useState(false);

    // Checked permissions lists for selected student/invite
    const [checkedSubjects, setCheckedSubjects] = useState([]);
    const [checkedUnits, setCheckedUnits] = useState([]);
    const [checkedLessons, setCheckedLessons] = useState([]);
    const [checkedQuizzes, setCheckedQuizzes] = useState([]);

    // Fetch Content data for Access Modal once opened
    const loadAccessData = async () => {
        if (allSubjects.length > 0) return; // already loaded cache
        setLoadingAccessData(true);
        try {
            const subjects = await contentService.getSubjects();
            setAllSubjects(subjects);
            
            let unitsList = [];
            let lessonsList = [];
            let quizzesList = [];
            
            for (const subject of subjects) {
                const units = await contentService.getUnitsBySubject(subject.id);
                unitsList = [...unitsList, ...units];
                
                const lessons = await contentService.getLessonsBySubject(subject.id);
                lessonsList = [...lessonsList, ...lessons];
                
                for (const lesson of lessons) {
                    const quiz = await contentService.getQuizByLessonId(lesson.id);
                    if (quiz) {
                        quizzesList.push(quiz);
                    }
                }
            }
            
            setAllUnits(unitsList);
            setAllLessons(lessonsList);
            setAllQuizzes(quizzesList);
        } catch (err) {
            console.error("Failed to load content for access control:", err);
        } finally {
            setLoadingAccessData(false);
        }
    };

    // Load invites from Firestore/mock
    const loadInvitesList = async () => {
        setLoadingInvites(true);
        try {
            const data = await authService.getInvites();
            setInvites(data);
        } catch (err) {
            console.error("Failed to load invites:", err);
        } finally {
            setLoadingInvites(false);
        }
    };

    // Keep checked states synced with selectedStudent
    useEffect(() => {
        if (selectedStudent) {
            const access = selectedStudent.access || { subjects: [], units: [], lessons: [], quizzes: [] };
            setCheckedSubjects(access.subjects || []);
            setCheckedUnits(access.units || []);
            setCheckedLessons(access.lessons || []);
            setCheckedQuizzes(access.quizzes || []);
            loadAccessData();
        }
    }, [selectedStudent]);

    // Load invites when invites sub-tab is chosen
    useEffect(() => {
        if (activeSubTab === 'invites') {
            loadInvitesList();
        }
    }, [activeSubTab]);

    // Trigger double refresh helper
    const handleRefreshData = async () => {
        if (onRefresh) onRefresh();
        if (activeSubTab === 'invites') {
            loadInvitesList();
        }
    };

    // Sorting helper
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Action handlers for registered students
    const handleResetPassword = async (email) => {
        if (window.confirm(`هل أنت متأكد من إرسال رابط إعادة تعيين كلمة المرور للطالب: ${email}؟`)) {
            try {
                const res = await authService.sendPasswordReset(email);
                if (res.success) {
                    alert(`تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني: ${email}`);
                } else {
                    alert(`فشل إرسال الرابط: ${res.error}`);
                }
            } catch (err) {
                alert(`حدث خطأ: ${err.message}`);
            }
        }
    };

    const handleDisableStudent = async (uid, name) => {
        if (window.confirm(`هل أنت متأكد من تعطيل حساب الطالب: ${name}؟ لن يتمكن من تسجيل الدخول أو تصفح المحتوى.`)) {
            try {
                const res = await authService.disableStudent(uid);
                if (res.success) {
                    alert(`تم تعطيل الحساب بنجاح.`);
                    handleRefreshData();
                } else {
                    alert(`فشل التعطيل: ${res.error}`);
                }
            } catch (err) {
                alert(`حدث خطأ: ${err.message}`);
            }
        }
    };

    const handleDeleteStudent = async (student) => {
        const confirmDelete = window.confirm(`هل أنت متأكد من حذف الطالب ${student.studentName}؟`);
        if (!confirmDelete) return;
        
        try {
            const res = await authService.deleteStudentFirestore(student.uid);
            if (res.success) {
                alert('تم الحذف بنجاح.');
                handleRefreshData();
            } else {
                alert(`تنبيه أمني هام:\n${res.error}`);
            }
        } catch (err) {
            alert(`حدث خطأ: ${err.message}`);
        }
    };

    // Action handlers for invites
    const handleCancelInvite = async (email) => {
        if (window.confirm(`هل أنت متأكد من إلغاء دعوة الطالب صاحب البريد الإلكتروني: ${email}؟`)) {
            try {
                const res = await authService.cancelInvite(email);
                if (res.success) {
                    alert('تم إلغاء الدعوة بنجاح.');
                    loadInvitesList();
                } else {
                    alert(`فشل إلغاء الدعوة: ${res.error}`);
                }
            } catch (err) {
                alert(`حدث خطأ: ${err.message}`);
            }
        }
    };

    const handleSendInviteInstructions = async (invite) => {
        try {
            await authService.sendPasswordReset(invite.email);
            alert(`إذا كان لهذا البريد حساب مسجل، سيصله رابط إعادة التعيين مباشرةً.
إن لم يكن مسجلاً، يرجى الطلب من الطالب الدخول إلى صفحة "إنشاء حساب جديد" والتسجيل باستخدام هذا البريد الإلكتروني (${invite.email})، وسيتم تفعيل حسابه وتطبيق صلاحياته تلقائياً.`);
        } catch (err) {
            alert(`حدث خطأ: ${err.message}`);
        }
    };

    const handleSaveAccess = async () => {
        try {
            const updatedAccess = {
                subjects: checkedSubjects,
                units: checkedUnits,
                lessons: checkedLessons,
                quizzes: checkedQuizzes
            };
            const res = await authService.updateStudentAccess(selectedStudent.uid, updatedAccess);
            if (res.success) {
                alert('تم تحديث صلاحيات الوصول بنجاح.');
                setIsAccessModalOpen(false);
                setSelectedStudent(null);
                handleRefreshData();
            } else {
                alert(`فشل التحديث: ${res.error}`);
            }
        } catch (err) {
            alert(`حدث خطأ: ${err.message}`);
        }
    };

    const handleClearAllAccess = () => {
        if (window.confirm('هل تريد مسح جميع الصلاحيات المخصصة لهذا الطالب وإعادته للصلاحيات الافتراضية؟')) {
            setCheckedSubjects([]);
            setCheckedUnits([]);
            setCheckedLessons([]);
            setCheckedQuizzes([]);
        }
    };

    // Filter & Sort registered students
    const filteredStudents = (students || []).filter(student => {
        const name = (student.studentName || '').toLowerCase();
        const email = (student.email || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        
        const matchesSearch = name.includes(term) || email.includes(term);
            
        let matchesStatus = true;
        const status = student.subscriptionStatus;
        const plan = student.subscriptionPlan;
        const isActive = student.isActive !== false;
        
        if (statusFilter === 'active') {
            matchesStatus = status === 'active' && plan !== 'custom' && isActive;
        } else if (statusFilter === 'free') {
            matchesStatus = status === 'free' && plan !== 'custom' && isActive;
        } else if (statusFilter === 'custom') {
            matchesStatus = plan === 'custom' && isActive;
        } else if (statusFilter === 'disabled') {
            matchesStatus = !isActive || status === 'disabled';
        }
        
        return matchesSearch && matchesStatus;
    });

    const sortedStudents = [...filteredStudents].sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        
        if (sortBy === 'studentName') {
            valA = a.studentName || '';
            valB = b.studentName || '';
        }
        
        if (sortOrder === 'asc') {
            return valA.toString().localeCompare(valB.toString(), 'ar');
        } else {
            return valB.toString().localeCompare(valA.toString(), 'ar');
        }
    });

    // Filter & Sort Invites
    const filteredInvites = (invites || []).filter(invite => {
        const name = (invite.name || '').toLowerCase();
        const email = (invite.email || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        
        const matchesSearch = name.includes(term) || email.includes(term);
        
        let matchesStatus = true;
        const status = invite.subscriptionStatus;
        const plan = invite.subscriptionPlan;
        
        if (statusFilter === 'active') {
            matchesStatus = status === 'active' && plan !== 'custom';
        } else if (statusFilter === 'free') {
            matchesStatus = status === 'free' && plan !== 'custom';
        } else if (statusFilter === 'custom') {
            matchesStatus = plan === 'custom' || status === 'custom';
        } else if (statusFilter === 'disabled') {
            matchesStatus = status === 'disabled';
        }
        
        return matchesSearch && matchesStatus;
    });

    const sortedInvites = [...filteredInvites].sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        
        if (sortBy === 'studentName') {
            valA = a.name || '';
            valB = b.name || '';
        } else if (sortBy === 'joinDate') {
            valA = a.createdAt || '';
            valB = b.createdAt || '';
        }
        
        if (sortOrder === 'asc') {
            return valA.toString().localeCompare(valB.toString(), 'ar');
        } else {
            return valB.toString().localeCompare(valA.toString(), 'ar');
        }
    });

    // Helper to render sort arrows next to header text on desktop
    const renderSortHeader = (label, field) => {
        const isCurrent = sortBy === field;
        return (
            <th 
                onClick={() => handleSort(field)}
                style={{ 
                    padding: '15px 20px', 
                    color: isCurrent ? 'var(--primary-color)' : 'var(--text-muted)', 
                    fontWeight: '700',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'var(--transition)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{label}</span>
                    {isCurrent ? (
                        sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                        <ChevronDown size={14} style={{ opacity: 0.3 }} />
                    )}
                </div>
            </th>
        );
    };

    // Filter modal lists based on search term inside modal
    const getFilteredSubjects = () => allSubjects.filter(sub => sub.title.toLowerCase().includes(modalSearchTerm.toLowerCase()));
    
    const getGroupedUnits = () => {
        return allSubjects.map(subject => {
            const units = allUnits.filter(u => u.subjectId === subject.id && u.title.toLowerCase().includes(modalSearchTerm.toLowerCase()));
            return { subject, units };
        }).filter(group => group.units.length > 0);
    };

    const getGroupedLessons = () => {
        return allUnits.map(unit => {
            const lessons = allLessons.filter(l => l.unitId === unit.id && l.title.toLowerCase().includes(modalSearchTerm.toLowerCase()));
            const subject = allSubjects.find(s => s.id === unit.subjectId);
            return { subject, unit, lessons };
        }).filter(group => group.lessons.length > 0);
    };

    const getGroupedQuizzes = () => {
        return allUnits.map(unit => {
            const unitLessons = allLessons.filter(l => l.unitId === unit.id);
            const quizzes = unitLessons.map(l => {
                const quizId = `quiz-${l.id}`;
                const quiz = allQuizzes.find(q => q.id === quizId || q.lessonId === l.id) || {
                    id: quizId,
                    lessonId: l.id,
                    title: `اختبار: ${l.title}`
                };
                return quiz;
            }).filter(q => q.title.toLowerCase().includes(modalSearchTerm.toLowerCase()));
            
            const subject = allSubjects.find(s => s.id === unit.subjectId);
            return { subject, unit, quizzes };
        }).filter(group => group.quizzes.length > 0);
    };

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            marginBottom: '35px'
        }}>
            {/* Table Header Section */}
            <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0 }}>إدارة اشتراكات وصلاحيات الطلاب</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>ابحث، رتّب، وعطّل الحسابات، أو امنح صلاحيات مخصصة للمواد والدروس.</p>
            </div>

            {/* Sub Tabs Bar */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                padding: '0 25px',
                backgroundColor: '#FFFFFF',
                gap: '15px'
            }}>
                <button
                    onClick={() => { setActiveSubTab('registered'); setSearchTerm(''); }}
                    style={{
                        padding: '14px 15px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeSubTab === 'registered' ? '3px solid var(--primary-color)' : '3px solid transparent',
                        color: activeSubTab === 'registered' ? 'var(--primary-color)' : 'var(--text-muted)',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                    }}
                >
                    الطلاب المسجلون ({students.length})
                </button>
                <button
                    onClick={() => { setActiveSubTab('invites'); setSearchTerm(''); }}
                    style={{
                        padding: '14px 15px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeSubTab === 'invites' ? '3px solid var(--primary-color)' : '3px solid transparent',
                        color: activeSubTab === 'invites' ? 'var(--primary-color)' : 'var(--text-muted)',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                    }}
                >
                    الدعوات المعلقة ({invites.filter(i => i.status === 'pending').length})
                </button>
            </div>
            
            {/* Control Panel (Search & Filters) */}
            <div style={{
                padding: '15px 25px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAFBFC'
            }}>
                <div style={{ display: 'flex', flex: '1', minWidth: '250px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="ابحث عن اسم أو بريد إلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 40px 10px 15px',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid var(--border-color)',
                            fontFamily: 'var(--font-family)',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Status Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>الحالة:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--border-radius-sm)',
                                border: '1px solid var(--border-color)',
                                fontFamily: 'var(--font-family)',
                                fontSize: '0.85rem',
                                backgroundColor: '#FFFFFF',
                                outline: 'none'
                            }}
                        >
                            <option value="all">الكل</option>
                            <option value="active">مشترك بالكامل</option>
                            <option value="free">تجريبي مجاني</option>
                            <option value="custom">صلاحيات مخصصة</option>
                            {activeSubTab === 'registered' && <option value="disabled">حساب معطل</option>}
                        </select>
                    </div>

                    {/* Sorting dropdown for mobile */}
                    <div className="mobile-sort-select" style={{ display: 'none', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>ترتيب:</span>
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--border-radius-sm)',
                                border: '1px solid var(--border-color)',
                                fontFamily: 'var(--font-family)',
                                fontSize: '0.85rem',
                                backgroundColor: '#FFFFFF',
                                outline: 'none'
                            }}
                        >
                            <option value="studentName-asc">الاسم (أ-ي)</option>
                            <option value="studentName-desc">الاسم (ي-أ)</option>
                            <option value="email-asc">البريد (أ-ي)</option>
                            <option value="email-desc">البريد (ي-أ)</option>
                            <option value="joinDate-desc">الأحدث انضماماً</option>
                            <option value="joinDate-asc">الأقدم انضماماً</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* REGISTERED STUDENTS SUB-TAB */}
            {activeSubTab === 'registered' && (
                <>
                    {/* Desktop Table View */}
                    <div className="desktop-students-view" style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'right',
                            fontSize: '0.95rem'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                                    {renderSortHeader('اسم الطالب', 'studentName')}
                                    {renderSortHeader('البريد الإلكتروني', 'email')}
                                    {renderSortHeader('تاريخ الانضمام', 'joinDate')}
                                    <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '700' }}>حالة الاشتراك</th>
                                    <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>التحكم وإدارة الحساب</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                            لم يتم العثور على طلاب مطابخين لخيارات البحث.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedStudents.map((student) => {
                                        const label = subscriptionService.getSubscriptionLabel(student);
                                        const isUserActive = student.isActive !== false;
                                        return (
                                            <tr key={student.email} style={{ borderBottom: '1px solid #EDF2F7', transition: 'var(--transition)' }} className="table-row-hover">
                                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <User size={16} style={{ color: 'var(--text-muted)' }} />
                                                        <span>{student.studentName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px 20px', color: 'var(--text-main)' }}>{student.email}</td>
                                                <td style={{ padding: '15px 20px', color: 'var(--text-muted)' }}>{student.joinDate || '2026-06-01'}</td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <Badge type={!isUserActive ? 'danger' : (student.subscriptionPlan === 'custom' ? 'warning' : (student.subscriptionStatus === 'active' ? 'success' : 'primary'))}>
                                                        {label}
                                                    </Badge>
                                                </td>
                                                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                        
                                                        {/* Subscription Toggle */}
                                                        <button 
                                                            onClick={() => onToggleSubscription(
                                                                student.email, 
                                                                student.subscriptionStatus === 'active' ? 'free' : 'active'
                                                            )}
                                                            className={`btn ${student.subscriptionStatus === 'active' ? 'btn-outline' : 'btn-primary'}`}
                                                            style={{ 
                                                                padding: '6px 12px', 
                                                                fontSize: '0.8rem', 
                                                                borderRadius: 'var(--border-radius-sm)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                borderWidth: '1px'
                                                            }}
                                                            title={student.subscriptionStatus === 'active' ? "التحويل للباقة المجانية" : "تفعيل باقة الوصول الكامل"}
                                                        >
                                                            {student.subscriptionStatus === 'active' ? <UserX size={13} /> : <UserCheck size={13} />}
                                                            <span>{student.subscriptionStatus === 'active' ? 'تخفيض مجاني' : 'ترقية للكامل'}</span>
                                                        </button>

                                                        {/* Custom Access Dialog */}
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setIsAccessModalOpen(true);
                                                            }}
                                                            className="btn btn-outline"
                                                            style={{ 
                                                                padding: '6px 12px', 
                                                                fontSize: '0.8rem', 
                                                                borderRadius: 'var(--border-radius-sm)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                borderColor: 'var(--secondary-color)',
                                                                color: 'var(--secondary-color)'
                                                            }}
                                                            title="إدارة الصلاحيات المخصصة"
                                                        >
                                                            <Settings size={13} />
                                                            <span>الصلاحيات</span>
                                                        </button>

                                                        {/* Reset Password */}
                                                        <button 
                                                            onClick={() => handleResetPassword(student.email)}
                                                            className="btn btn-outline"
                                                            style={{ 
                                                                padding: '6px 10px', 
                                                                borderRadius: 'var(--border-radius-sm)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#64748B',
                                                                borderColor: '#CBD5E1'
                                                            }}
                                                            title="إرسال رابط إعادة تعيين كلمة المرور"
                                                        >
                                                            <KeyRound size={13} />
                                                        </button>

                                                        {/* Account Block/Deactivate */}
                                                        {isUserActive ? (
                                                            <button 
                                                                onClick={() => handleDisableStudent(student.uid, student.studentName)}
                                                                className="btn btn-outline"
                                                                style={{ 
                                                                    padding: '6px 10px', 
                                                                    borderRadius: 'var(--border-radius-sm)',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#EF4444',
                                                                    borderColor: '#FCA5A5'
                                                                }}
                                                                title="تعطيل وحظر الحساب الدراسي"
                                                            >
                                                                <UserX size={13} />
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => onToggleSubscription(student.email, 'free')}
                                                                className="btn btn-outline"
                                                                style={{ 
                                                                    padding: '6px 10px', 
                                                                    borderRadius: 'var(--border-radius-sm)',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#16A34A',
                                                                    borderColor: '#86EFAC'
                                                                }}
                                                                title="تفعيل الحساب المعطل مجدداً"
                                                            >
                                                                <UserCheck size={13} />
                                                            </button>
                                                        )}

                                                        {/* Permanent Delete */}
                                                        <button 
                                                            onClick={() => handleDeleteStudent(student)}
                                                            className="btn btn-outline"
                                                            style={{ 
                                                                padding: '6px 10px', 
                                                                borderRadius: 'var(--border-radius-sm)',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#B91C1C',
                                                                borderColor: '#FCA5A5'
                                                            }}
                                                            title="حذف الحساب نهائياً"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mobile-students-view" style={{ display: 'none', padding: '15px', flexDirection: 'column', gap: '15px' }}>
                        {sortedStudents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                لم يتم العثور على طلاب مطابخين لخيارات البحث.
                            </div>
                        ) : (
                            sortedStudents.map((student) => {
                                const label = subscriptionService.getSubscriptionLabel(student);
                                const isUserActive = student.isActive !== false;
                                return (
                                    <div key={student.email} style={{
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: 'var(--border-radius-md)',
                                        padding: '16px',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                            <div>
                                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1rem', margin: 0 }}>
                                                    {student.studentName}
                                                </h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <Mail size={12} />
                                                    <span style={{ wordBreak: 'break-all' }}>{student.email}</span>
                                                </div>
                                            </div>
                                            <Badge type={!isUserActive ? 'danger' : (student.subscriptionPlan === 'custom' ? 'warning' : (student.subscriptionStatus === 'active' ? 'success' : 'primary'))}>
                                                {label.split(' ')[0]} {/* shortened for mobile */}
                                            </Badge>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                                            <Calendar size={12} />
                                            <span>انضم في: {student.joinDate || '2026-06-01'}</span>
                                        </div>
                                        
                                        {/* Action Buttons Grid on Mobile */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                                            {/* Upgrade / Downgrade */}
                                            <button 
                                                onClick={() => onToggleSubscription(
                                                    student.email, 
                                                    student.subscriptionStatus === 'active' ? 'free' : 'active'
                                                )}
                                                className={`btn ${student.subscriptionStatus === 'active' ? 'btn-outline' : 'btn-primary'}`}
                                                style={{ 
                                                    padding: '8px', 
                                                    fontSize: '0.8rem', 
                                                    borderRadius: 'var(--border-radius-sm)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    borderWidth: '1px'
                                                }}
                                            >
                                                {student.subscriptionStatus === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                                                <span>{student.subscriptionStatus === 'active' ? 'تخفيض مجاني' : 'ترقية كاملة'}</span>
                                            </button>

                                            {/* Permissions Modal trigger */}
                                            <button 
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setIsAccessModalOpen(true);
                                                }}
                                                className="btn btn-outline"
                                                style={{ 
                                                    padding: '8px', 
                                                    fontSize: '0.8rem', 
                                                    borderRadius: 'var(--border-radius-sm)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    borderColor: 'var(--secondary-color)',
                                                    color: 'var(--secondary-color)'
                                                }}
                                            >
                                                <Settings size={14} />
                                                <span>تعديل الصلاحيات</span>
                                            </button>

                                            {/* Reset Password */}
                                            <button 
                                                onClick={() => handleResetPassword(student.email)}
                                                className="btn btn-outline"
                                                style={{ 
                                                    padding: '8px', 
                                                    fontSize: '0.8rem',
                                                    borderRadius: 'var(--border-radius-sm)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    color: '#64748B',
                                                    borderColor: '#CBD5E1'
                                                }}
                                            >
                                                <KeyRound size={14} />
                                                <span>كلمة المرور</span>
                                            </button>

                                            {/* Disable / Block / Delete options */}
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {isUserActive ? (
                                                    <button 
                                                        onClick={() => handleDisableStudent(student.uid, student.studentName)}
                                                        className="btn btn-outline"
                                                        style={{ 
                                                            flex: '1',
                                                            padding: '8px', 
                                                            borderRadius: 'var(--border-radius-sm)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#EF4444',
                                                            borderColor: '#FCA5A5'
                                                        }}
                                                        title="حظر الحساب"
                                                    >
                                                        <UserX size={14} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => onToggleSubscription(student.email, 'free')}
                                                        className="btn btn-outline"
                                                        style={{ 
                                                            flex: '1',
                                                            padding: '8px', 
                                                            borderRadius: 'var(--border-radius-sm)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#16A34A',
                                                            borderColor: '#86EFAC'
                                                        }}
                                                        title="إعادة التفعيل"
                                                    >
                                                        <UserCheck size={14} />
                                                    </button>
                                                )}

                                                <button 
                                                    onClick={() => handleDeleteStudent(student)}
                                                    className="btn btn-outline"
                                                    style={{ 
                                                        flex: '1',
                                                        padding: '8px', 
                                                        borderRadius: 'var(--border-radius-sm)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#B91C1C',
                                                        borderColor: '#FCA5A5'
                                                    }}
                                                    title="حذف نهائي"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* STUDENT INVITATIONS SUB-TAB */}
            {activeSubTab === 'invites' && (
                <>
                    {/* Desktop Table View */}
                    <div className="desktop-students-view" style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'right',
                            fontSize: '0.95rem'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                                    {renderSortHeader('اسم الطالب', 'studentName')}
                                    {renderSortHeader('البريد الإلكتروني', 'email')}
                                    {renderSortHeader('رقم الهاتف', 'phone')}
                                    <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '700' }}>الباقة المحددة</th>
                                    <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '700' }}>الحالة</th>
                                    <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>التحكم وإرسال الدعوة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingInvites ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                                            <RefreshCw size={24} className="spin-animation" style={{ color: 'var(--primary-color)', margin: 'auto' }} />
                                        </td>
                                    </tr>
                                ) : sortedInvites.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                            لا توجد دعوات معلقة مطابقة لخيارات البحث.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedInvites.map((invite) => {
                                        let planLabel = 'تجريبي مجاني';
                                        if (invite.subscriptionStatus === 'active') planLabel = 'مشترك بالكامل';
                                        else if (invite.subscriptionPlan === 'custom') planLabel = 'صلاحيات مخصصة';
                                        
                                        return (
                                            <tr key={invite.email} style={{ borderBottom: '1px solid #EDF2F7', transition: 'var(--transition)' }} className="table-row-hover">
                                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <User size={16} style={{ color: 'var(--text-muted)' }} />
                                                        <span>{invite.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px 20px', color: 'var(--text-main)' }}>{invite.email}</td>
                                                <td style={{ padding: '15px 20px', color: 'var(--text-muted)' }}>{invite.phone || '—'}</td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <Badge type={invite.subscriptionPlan === 'custom' ? 'warning' : (invite.subscriptionStatus === 'active' ? 'success' : 'primary')}>
                                                        {planLabel}
                                                    </Badge>
                                                </td>
                                                <td style={{ padding: '15px 20px' }}>
                                                    <Badge type={invite.status === 'accepted' ? 'success' : (invite.status === 'cancelled' ? 'neutral' : 'warning')}>
                                                        {invite.status === 'accepted' ? 'مقبولة' : (invite.status === 'cancelled' ? 'ملغاة' : 'معلقة (قيد الانتظار)')}
                                                    </Badge>
                                                </td>
                                                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                        {invite.status === 'pending' && (
                                                            <>
                                                                {/* Custom Access Dialog */}
                                                                <button 
                                                                    onClick={() => {
                                                                        setSelectedStudent({
                                                                            uid: invite.id,
                                                                            studentName: invite.name,
                                                                            email: invite.email,
                                                                            access: invite.access
                                                                        });
                                                                        setIsAccessModalOpen(true);
                                                                    }}
                                                                    className="btn btn-outline"
                                                                    style={{ 
                                                                        padding: '6px 12px', 
                                                                        fontSize: '0.8rem', 
                                                                        borderRadius: 'var(--border-radius-sm)',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        borderColor: 'var(--secondary-color)',
                                                                        color: 'var(--secondary-color)'
                                                                    }}
                                                                    title="تعديل الصلاحيات المحددة مسبقاً للدعوة"
                                                                >
                                                                    <Settings size={13} />
                                                                    <span>تعديل الصلاحيات</span>
                                                                </button>

                                                                {/* Send Registration Instructions */}
                                                                <button 
                                                                    onClick={() => handleSendInviteInstructions(invite)}
                                                                    className="btn btn-primary"
                                                                    style={{ 
                                                                        padding: '6px 12px', 
                                                                        fontSize: '0.8rem', 
                                                                        borderRadius: 'var(--border-radius-sm)',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                    }}
                                                                    title="إرسال رابط للتسجيل وإعادة التعيين"
                                                                >
                                                                    <Send size={13} />
                                                                    <span>إرسال الرابط</span>
                                                                </button>

                                                                {/* Cancel Invite */}
                                                                <button 
                                                                    onClick={() => handleCancelInvite(invite.email)}
                                                                    className="btn btn-outline"
                                                                    style={{ 
                                                                        padding: '6px 12px', 
                                                                        fontSize: '0.8rem',
                                                                        borderRadius: 'var(--border-radius-sm)',
                                                                        color: '#EF4444',
                                                                        borderColor: '#FCA5A5'
                                                                    }}
                                                                    title="إلغاء وتجميد الدعوة"
                                                                >
                                                                    <UserX size={13} />
                                                                    <span>إلغاء</span>
                                                                </button>
                                                            </>
                                                        )}
                                                        {invite.status !== 'pending' && (
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>مكتملة</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="mobile-students-view" style={{ display: 'none', padding: '15px', flexDirection: 'column', gap: '15px' }}>
                        {loadingInvites ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
                                <RefreshCw size={24} className="spin-animation" style={{ color: 'var(--primary-color)' }} />
                            </div>
                        ) : sortedInvites.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                لا توجد دعوات معلقة مطابقة لخيارات البحث.
                            </div>
                        ) : (
                            sortedInvites.map((invite) => {
                                let planLabel = 'مجاني';
                                if (invite.subscriptionStatus === 'active') planLabel = 'مشترك';
                                else if (invite.subscriptionPlan === 'custom') planLabel = 'مخصص';
                                
                                return (
                                    <div key={invite.email} style={{
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: 'var(--border-radius-md)',
                                        padding: '16px',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                            <div>
                                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1rem', margin: 0 }}>
                                                    {invite.name}
                                                </h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <Mail size={12} />
                                                    <span style={{ wordBreak: 'break-all' }}>{invite.email}</span>
                                                </div>
                                                {invite.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <Phone size={12} />
                                                        <span>{invite.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                                                <Badge type={invite.status === 'accepted' ? 'success' : (invite.status === 'cancelled' ? 'neutral' : 'warning')}>
                                                    {invite.status === 'accepted' ? 'مقبولة' : (invite.status === 'cancelled' ? 'ملغاة' : 'معلقة')}
                                                </Badge>
                                                <Badge type={invite.subscriptionPlan === 'custom' ? 'warning' : (invite.subscriptionStatus === 'active' ? 'success' : 'primary')}>
                                                    {planLabel}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                                            <Calendar size={12} />
                                            <span>أرسلت في: {(invite.createdAt || '2026-06-01').split('T')[0]}</span>
                                        </div>

                                        {invite.status === 'pending' && (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '4px' }}>
                                                {/* Manage Access */}
                                                <button 
                                                    onClick={() => {
                                                        setSelectedStudent({
                                                            uid: invite.id,
                                                            studentName: invite.name,
                                                            email: invite.email,
                                                            access: invite.access
                                                        });
                                                        setIsAccessModalOpen(true);
                                                    }}
                                                    className="btn btn-outline"
                                                    style={{ 
                                                        padding: '8px 4px', 
                                                        fontSize: '0.75rem', 
                                                        borderRadius: 'var(--border-radius-sm)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '2px',
                                                        borderColor: 'var(--secondary-color)',
                                                        color: 'var(--secondary-color)'
                                                    }}
                                                >
                                                    <Settings size={12} />
                                                    <span>الصلاحيات</span>
                                                </button>

                                                {/* Send registration instructions */}
                                                <button 
                                                    onClick={() => handleSendInviteInstructions(invite)}
                                                    className="btn btn-primary"
                                                    style={{ 
                                                        padding: '8px 4px', 
                                                        fontSize: '0.75rem', 
                                                        borderRadius: 'var(--border-radius-sm)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '2px',
                                                    }}
                                                >
                                                    <Send size={12} />
                                                    <span>رابط الدعوة</span>
                                                </button>

                                                {/* Cancel Invite */}
                                                <button 
                                                    onClick={() => handleCancelInvite(invite.email)}
                                                    className="btn btn-outline"
                                                    style={{ 
                                                        padding: '8px 4px', 
                                                        fontSize: '0.75rem', 
                                                        borderRadius: 'var(--border-radius-sm)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '2px',
                                                        color: '#EF4444',
                                                        borderColor: '#FCA5A5'
                                                    }}
                                                >
                                                    <UserX size={12} />
                                                    <span>إلغاء</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* ACCESS CONTROL MODAL (إدارة صلاحيات الوصول المخصصة) */}
            {isAccessModalOpen && selectedStudent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div className="modal-container" style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-color)',
                        width: '650px',
                        maxWidth: '92%',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '18px 24px',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#FAFBFC'
                        }}>
                            <div>
                                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0, fontSize: '1.2rem' }}>
                                    تعديل صلاحيات الوصول
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                                    للطالب: <strong style={{ color: 'var(--text-main)' }}>{selectedStudent.studentName}</strong> ({selectedStudent.email})
                                </p>
                            </div>
                            <button 
                                onClick={() => { setIsAccessModalOpen(false); setSelectedStudent(null); }}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Warning Bar */}
                        <div style={{
                            padding: '10px 24px',
                            backgroundColor: '#EFF6FF',
                            color: '#1E40AF',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            borderBottom: '1px solid #DBEAFE'
                        }}>
                            <Info size={16} style={{ flexShrink: 0 }} />
                            <span>تسري هذه الصلاحيات فقط عندما تكون باقة الطالب هي باقة الصلاحيات المخصصة أو الباقة المجانية.</span>
                        </div>

                        {/* Modal search bar */}
                        <div style={{
                            padding: '12px 24px',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: '#FAFBFC',
                            position: 'relative'
                        }}>
                            <Search size={16} style={{ position: 'absolute', right: '35px', top: '22px', color: 'var(--text-muted)' }} />
                            <input 
                                type="text"
                                placeholder="ابحث داخل القائمة الحالية..."
                                value={modalSearchTerm}
                                onChange={(e) => setModalSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 35px 8px 15px',
                                    borderRadius: 'var(--border-radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    fontFamily: 'var(--font-family)',
                                    fontSize: '0.85rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Modal Tab Bar */}
                        <div style={{
                            display: 'flex',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: '#FAFBFC',
                            gap: '10px',
                            padding: '0 24px'
                        }}>
                            {[
                                { id: 'subjects', label: 'المواد الدراسية', icon: <Award size={15} /> },
                                { id: 'units', label: 'الوحدات', icon: <BookOpen size={15} /> },
                                { id: 'lessons', label: 'الدروس الفردية', icon: <BookOpen size={15} /> },
                                { id: 'quizzes', label: 'الاختبارات', icon: <ClipboardList size={15} /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveAccessTab(tab.id); setModalSearchTerm(''); }}
                                    style={{
                                        padding: '12px 10px',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeAccessTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                                        color: activeAccessTab === tab.id ? 'var(--primary-color)' : 'var(--text-muted)',
                                        fontWeight: '800',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.2s ease',
                                        outline: 'none'
                                    }}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Modal Body (Checklists) */}
                        <div style={{
                            padding: '24px',
                            overflowY: 'auto',
                            flexGrow: 1,
                            backgroundColor: '#FFFFFF'
                        }}>
                            {loadingAccessData ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '15px' }}>
                                    <RefreshCw size={32} className="spin-animation" style={{ color: 'var(--primary-color)' }} />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>جاري تحميل البيانات التعليمية...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Subjects Checklist */}
                                    {activeAccessTab === 'subjects' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {getFilteredSubjects().length === 0 ? (
                                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>لا توجد مواد مطابقة للبحث.</div>
                                            ) : (
                                                getFilteredSubjects().map(sub => {
                                                    const isChecked = checkedSubjects.includes(sub.id);
                                                    return (
                                                        <label key={sub.id} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '12px 16px',
                                                            borderRadius: 'var(--border-radius-md)',
                                                            border: '1px solid var(--border-color)',
                                                            cursor: 'pointer',
                                                            backgroundColor: isChecked ? 'var(--primary-light)' : '#FFFFFF',
                                                            transition: 'var(--transition)'
                                                        }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isChecked}
                                                                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)' }}
                                                                onChange={() => {
                                                                    if (isChecked) {
                                                                        setCheckedSubjects(checkedSubjects.filter(id => id !== sub.id));
                                                                    } else {
                                                                        setCheckedSubjects([...checkedSubjects, sub.id]);
                                                                    }
                                                                }}
                                                            />
                                                            <span style={{ fontWeight: '700', color: isChecked ? 'var(--primary-color)' : 'var(--text-main)', fontSize: '0.95rem' }}>
                                                                {sub.title}
                                                            </span>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}

                                    {/* Units Checklist */}
                                    {activeAccessTab === 'units' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {getGroupedUnits().length === 0 ? (
                                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>لا توجد وحدات مطابقة للبحث.</div>
                                            ) : (
                                                getGroupedUnits().map(({ subject, units }) => (
                                                    <div key={subject.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <h5 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '0.9rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px', margin: 0 }}>
                                                            {subject.title}
                                                        </h5>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                                                            {units.map(unit => {
                                                                const isChecked = checkedUnits.includes(unit.id);
                                                                return (
                                                                    <label key={unit.id} style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        padding: '10px',
                                                                        borderRadius: 'var(--border-radius-sm)',
                                                                        border: '1px solid var(--border-color)',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: isChecked ? 'var(--primary-light)' : '#FFFFFF'
                                                                    }}>
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={isChecked}
                                                                            style={{ accentColor: 'var(--primary-color)' }}
                                                                            onChange={() => {
                                                                                if (isChecked) {
                                                                                    setCheckedUnits(checkedUnits.filter(id => id !== unit.id));
                                                                                } else {
                                                                                    setCheckedUnits([...checkedUnits, unit.id]);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{unit.title}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* Lessons Checklist */}
                                    {activeAccessTab === 'lessons' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {getGroupedLessons().length === 0 ? (
                                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>لا توجد دروس مطابقة للبحث.</div>
                                            ) : (
                                                getGroupedLessons().map(({ subject, unit, lessons }) => (
                                                    <div key={unit.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <h5 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '0.9rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px', margin: 0 }}>
                                                            {subject?.title} – {unit.title}
                                                        </h5>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                                                            {lessons.map(lesson => {
                                                                const isChecked = checkedLessons.includes(lesson.id);
                                                                return (
                                                                    <label key={lesson.id} style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        padding: '10px',
                                                                        borderRadius: 'var(--border-radius-sm)',
                                                                        border: '1px solid var(--border-color)',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: isChecked ? 'var(--primary-light)' : '#FFFFFF'
                                                                    }}>
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={isChecked}
                                                                            style={{ accentColor: 'var(--primary-color)' }}
                                                                            onChange={() => {
                                                                                if (isChecked) {
                                                                                    setCheckedLessons(checkedLessons.filter(id => id !== lesson.id));
                                                                                } else {
                                                                                    setCheckedLessons([...checkedLessons, lesson.id]);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{lesson.title}</span>
                                                                            {lesson.isFree && <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 'bold' }}>درس مجاني تلقائي</span>}
                                                                        </div>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* Quizzes Checklist */}
                                    {activeAccessTab === 'quizzes' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {getGroupedQuizzes().length === 0 ? (
                                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>لا توجد اختبارات مطابقة للبحث.</div>
                                            ) : (
                                                getGroupedQuizzes().map(({ subject, unit, quizzes }) => (
                                                    <div key={unit.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <h5 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '0.9rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px', margin: 0 }}>
                                                            {subject?.title} – {unit.title}
                                                        </h5>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                                                            {quizzes.map(quiz => {
                                                                const isChecked = checkedQuizzes.includes(quiz.id);
                                                                return (
                                                                    <label key={quiz.id} style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        padding: '10px',
                                                                        borderRadius: 'var(--border-radius-sm)',
                                                                        border: '1px solid var(--border-color)',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: isChecked ? 'var(--primary-light)' : '#FFFFFF'
                                                                    }}>
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={isChecked}
                                                                            style={{ accentColor: 'var(--primary-color)' }}
                                                                            onChange={() => {
                                                                                if (isChecked) {
                                                                                    setCheckedQuizzes(checkedQuizzes.filter(id => id !== quiz.id));
                                                                                } else {
                                                                                    setCheckedQuizzes([...checkedQuizzes, quiz.id]);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{quiz.title}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '15px 24px',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#FAFBFC'
                        }}>
                            <button
                                onClick={handleClearAllAccess}
                                className="btn btn-outline"
                                style={{
                                    padding: '10px 15px',
                                    fontSize: '0.85rem',
                                    color: '#B91C1C',
                                    borderColor: '#FCA5A5'
                                }}
                            >
                                مسح كل الصلاحيات
                            </button>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => { setIsAccessModalOpen(false); setSelectedStudent(null); }}
                                    className="btn btn-outline"
                                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSaveAccess}
                                    className="btn btn-primary"
                                    style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                    disabled={loadingAccessData}
                                >
                                    حفظ الصلاحيات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .table-row-hover:hover {
                    background-color: #F8FAFC;
                }
                .spin-animation {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @media (max-width: 768px) {
                    .desktop-students-view {
                        display: none !important;
                    }
                    .mobile-students-view {
                        display: flex !important;
                    }
                    .mobile-sort-select {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    );
};
