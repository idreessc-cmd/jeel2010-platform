import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // If already logged in, redirect to home
        if (authService.getCurrentUser()) {
            navigate('/subjects');
        }
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }

        const res = authService.login(email, password);
        if (res.success) {
            navigate('/subjects');
        } else {
            setError(res.error);
        }
    };

    // Quick Login Helper for easy testing
    const handleQuickLogin = (quickEmail) => {
        setError('');
        const res = authService.login(quickEmail, '123');
        if (res.success) {
            navigate('/subjects');
        } else {
            setError(res.error);
        }
    };

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 350px)', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '450px' }}>
                <div className="login-card" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '40px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.7rem', textAlign: 'center', marginBottom: '8px' }}>
                        تسجيل الدخول للمنصة
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '30px' }}>
                        سجل دخولك لتسجيل تقدمك الدراسي وحل اختبارات جيل 2010
                    </p>

                    {error && (
                        <div style={{
                            padding: '12px 15px',
                            backgroundColor: 'var(--bg-arabic)',
                            color: 'var(--accent-arabic)',
                            borderRadius: 'var(--border-radius-sm)',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            borderRight: '4px solid var(--accent-arabic)'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.95rem', color: 'var(--secondary-color)' }}>
                                البريد الإلكتروني:
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--border-radius-md)',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-family)',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '0.95rem', color: 'var(--secondary-color)' }}>
                                كلمة المرور:
                            </label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--border-radius-md)',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-family)',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', fontSize: '1.05rem', fontWeight: '800' }}
                        >
                            🔐 تسجيل الدخول
                        </button>
                    </form>

                    {/* Quick Login Shortcuts for Verification */}
                    <div style={{
                        marginTop: '30px',
                        borderTop: '1px dashed var(--border-color)',
                        paddingTop: '25px',
                        textAlign: 'center'
                    }}>
                        <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '0.95rem', marginBottom: '15px' }}>
                            💡 اختصارات سريعة لتجربة المصحح:
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button 
                                onClick={() => handleQuickLogin('free@jeel2010.com')}
                                className="btn btn-outline"
                                style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }}
                            >
                                👤 الدخول كطالب تجريبي (مجاني)
                            </button>
                            <button 
                                onClick={() => handleQuickLogin('active@jeel2010.com')}
                                className="btn btn-outline"
                                style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', color: 'var(--accent-islamic)', borderColor: 'var(--accent-islamic)' }}
                            >
                                💎 الدخول كطالب مشترك (نشط بالكامل)
                            </button>
                        </div>
                        
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                            * كلمة المرور الافتراضية للحسابات هي <strong>123</strong>
                        </p>
                    </div>
                </div>
            </div>
            {/* Inline CSS Helper for Login page responsiveness */}
            <style>{`
                @media (max-width: 480px) {
                    .login-card {
                        padding: 25px 15px !important;
                    }
                }
            `}</style>
        </section>
    );
};
