import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Home, HelpCircle } from 'lucide-react';

export const AccessDenied = () => {
    const location = useLocation();
    const isDisabled = location.state?.disabled;

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '50px 30px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#FEF2F2',
                        color: '#EF4444',
                        padding: '16px',
                        borderRadius: '50%',
                        marginBottom: '25px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShieldAlert size={48} />
                    </div>

                    <h2 style={{ color: 'var(--secondary-color)', fontWeight: '900', fontSize: '1.8rem', marginBottom: '15px' }}>
                        {isDisabled ? 'تم تعطيل الحساب الدراسي!' : 'عذراً، غير مصرح لك بالدخول!'}
                    </h2>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '35px' }}>
                        {isDisabled 
                            ? 'تم تعطيل الحساب، يرجى التواصل مع الدعم لتسوية حالة الحساب وتفعيله مجدداً.' 
                            : 'هذه الصفحة مخصصة لمدراء ومسؤولي النظام فقط. ليس لديك الصلاحية الكافية لعرض هذا المحتوى. يرجى العودة إلى لوحة التحكم الخاصة بك كطالب.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                        {!isDisabled ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className="btn btn-primary"
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '8px',
                                        padding: '12px',
                                        textDecoration: 'none',
                                        fontWeight: '700'
                                    }}
                                >
                                    <ArrowRight size={18} />
                                    <span>الذهاب للوحة تحكم الطالب</span>
                                </Link>
                                
                                <Link 
                                    to="/" 
                                    className="btn btn-outline"
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '8px',
                                        padding: '12px',
                                        textDecoration: 'none',
                                        fontWeight: '700'
                                    }}
                                >
                                    <Home size={18} />
                                    <span>الصفحة الرئيسية</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/contact" 
                                    className="btn btn-primary"
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '8px',
                                        padding: '12px',
                                        textDecoration: 'none',
                                        fontWeight: '700'
                                    }}
                                >
                                    <HelpCircle size={18} />
                                    <span>تواصل مع الدعم الفني</span>
                                </Link>
                                
                                <Link 
                                    to="/" 
                                    className="btn btn-outline"
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '8px',
                                        padding: '12px',
                                        textDecoration: 'none',
                                        fontWeight: '700'
                                    }}
                                >
                                    <Home size={18} />
                                    <span>الصفحة الرئيسية</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
