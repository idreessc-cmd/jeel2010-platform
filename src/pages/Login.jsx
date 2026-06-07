import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AlertCircle, LogIn, UserPlus, Phone, Mail, Lock, User, KeyRound } from 'lucide-react';

export const Login = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    
    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Register form state
    const [registerName, setRegisterName] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        // Redirect if already logged in
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        if (!loginEmail || !loginPassword) {
            setError('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }

        try {
            const res = await authService.loginWithEmail(loginEmail, loginPassword);
            if (res.success) {
                if (res.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(res.error);
            }
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        const name = registerName.trim();
        const phone = registerPhone.trim();
        const email = registerEmail.trim();
        const password = registerPassword;
        const confirmPassword = registerConfirmPassword;

        if (!name) {
            setError('يرجى إدخال الاسم الكامل.');
            return;
        }

        if (!phone) {
            setError('يرجى إدخال رقم الهاتف.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError('يرجى إدخال بريد إلكتروني صحيح.');
            return;
        }

        if (!password || password.length < 6) {
            setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
            return;
        }

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }

        try {
            const res = await authService.registerStudent({
                name: name,
                phone: phone,
                email: email,
                password: password
            });
            if (res.success) {
                setSuccessMsg('تم إنشاء الحساب بنجاح! يتم تحويلك الآن...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setError(res.error);
            }
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        alert('يرجى التواصل مع إدارة المنصة أو الدعم الفني لإعادة تعيين كلمة المرور الخاصة بك.');
    };

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="login-card" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '35px 30px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.6rem', marginBottom: '8px' }}>
                            أكاديمية جيل 2010 التعليمية
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            منصة النجاح والتميز للمرحلة الدراسية
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '2px solid #E2E8F0',
                        marginBottom: '25px',
                        gap: '15px'
                    }}>
                        <button
                            onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'login' ? '3px solid var(--primary-color)' : '3px solid transparent',
                                color: activeTab === 'login' ? 'var(--primary-color)' : 'var(--text-muted)',
                                fontWeight: '800',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                        >
                            تسجيل الدخول
                        </button>
                        <button
                            onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'register' ? '3px solid var(--primary-color)' : '3px solid transparent',
                                color: activeTab === 'register' ? 'var(--primary-color)' : 'var(--text-muted)',
                                fontWeight: '800',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                        >
                            إنشاء حساب جديد
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#FEF2F2',
                            color: '#EF4444',
                            borderRadius: 'var(--border-radius-sm)',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            borderRight: '4px solid #EF4444',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                                <span>{error}</span>
                            </div>
                            {error.includes('تسجيل الدخول') && (
                                <button
                                    onClick={() => {
                                        setLoginEmail(registerEmail);
                                        setActiveTab('login');
                                        setError('');
                                    }}
                                    type="button"
                                    style={{
                                        alignSelf: 'flex-start',
                                        marginTop: '5px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary-color)',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontWeight: '800',
                                        fontSize: '0.85rem',
                                        padding: 0,
                                        fontFamily: 'var(--font-family)'
                                    }}
                                >
                                    الانتقال إلى تسجيل الدخول
                                </button>
                            )}
                        </div>
                    )}

                    {successMsg && (
                        <div style={{
                            padding: '12px 15px',
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            borderRadius: 'var(--border-radius-sm)',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            borderRight: '4px solid #16A34A',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <AlertCircle size={18} style={{ color: '#16A34A' }} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit}>
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                    <Mail size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                    البريد الإلكتروني:
                                </label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="yourname@domain.com"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none',
                                        textAlign: 'left',
                                        direction: 'ltr'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                        <Lock size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                        كلمة المرور:
                                    </label>
                                </div>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    name="password"
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none',
                                        textAlign: 'left',
                                        direction: 'ltr'
                                    }}
                                />
                                <div style={{ marginTop: '8px', textAlign: 'left' }}>
                                    <a
                                        href="#forgot"
                                        onClick={handleForgotPassword}
                                        style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'none' }}
                                    >
                                        نسيت كلمة المرور؟
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
                            >
                                <LogIn size={18} />
                                <span>تسجيل الدخول</span>
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleRegisterSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                    <User size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                    الاسم الكامل:
                                </label>
                                <input
                                    type="text"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    placeholder="مثال: محمد أحمد علي"
                                    required
                                    autoComplete="name"
                                    name="fullName"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                    <Phone size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                    رقم الهاتف:
                                </label>
                                <input
                                    type="tel"
                                    value={registerPhone}
                                    onChange={(e) => setRegisterPhone(e.target.value)}
                                    placeholder="07xxxxxxxx"
                                    required
                                    autoComplete="tel"
                                    name="phone"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none',
                                        textAlign: 'left',
                                        direction: 'ltr'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                    <Mail size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                    البريد الإلكتروني:
                                </label>
                                <input
                                    type="email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none',
                                        textAlign: 'left',
                                        direction: 'ltr'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                    <Lock size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                    كلمة المرور:
                                </label>
                                <input
                                    type="password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    name="newPassword"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none',
                                        textAlign: 'left',
                                        direction: 'ltr'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                    <KeyRound size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                                    تأكيد كلمة المرور:
                                </label>
                                <input
                                    type="password"
                                    value={registerConfirmPassword}
                                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    name="confirmPassword"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--border-radius-md)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'var(--font-family)',
                                        outline: 'none',
                                        textAlign: 'left',
                                        direction: 'ltr'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <UserPlus size={18} />
                                <span>إنشاء حساب جديد</span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
            {/* Responsiveness style */}
            <style>{`
                @media (max-width: 480px) {
                    .login-card {
                        padding: 25px 20px !important;
                    }
                }
            `}</style>
        </section>
    );
};
