import React from 'react';
import { MessageCircle, Send, Mail, Phone, MapPin } from 'lucide-react';

export const Contact = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 350px)', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <h2>تواصل معنا</h2>
                    <p>فريق الدعم الفني وإدارة المنصة في خدمتكم دائماً للإجابة على استفساراتكم ومساعدتكم في تفعيل الحسابات.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    marginBottom: '40px'
                }}>
                    {/* Quick Channels Cards */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '35px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', margin: 0 }}>
                            بيانات التواصل المباشر
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(234, 60, 7, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>الدعم الفني والاشتراكات</h4>
                                    <p style={{ margin: 0, fontWeight: '700', color: 'var(--secondary-color)', direction: 'ltr' }}>+962 7 8249 6144</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(234, 60, 7, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>البريد الإلكتروني</h4>
                                    <p style={{ margin: 0, fontWeight: '700', color: 'var(--secondary-color)' }}>info@success-exam.com</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(234, 60, 7, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>مقر المنصة</h4>
                                    <p style={{ margin: 0, fontWeight: '700', color: 'var(--secondary-color)' }}>المملكة الأردنية الهاشمية</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social links */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '35px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', margin: 0 }}>
                            قنوات التواصل الاجتماعي
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <a 
                                href="https://api.whatsapp.com/send?phone=962782496144" 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', padding: '12px 20px', border: '1px solid #e2e8f0' }}
                            >
                                <span style={{ color: '#25D366', display: 'inline-flex' }}><MessageCircle size={20} /></span>
                                <span style={{ fontWeight: 'bold' }}>واتساب المنصة الرسمي</span>
                            </a>

                            <a 
                                href="https://t.me/Success_exam" 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', padding: '12px 20px', border: '1px solid #e2e8f0' }}
                            >
                                <span style={{ color: '#0088cc', display: 'inline-flex' }}><Send size={20} /></span>
                                <span style={{ fontWeight: 'bold' }}>قناة التليغرام الرسمية</span>
                            </a>

                            <a 
                                href="https://www.facebook.com/profile.php?id=100063160512932" 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', padding: '12px 20px', border: '1px solid #e2e8f0' }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#1877F2" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                <span style={{ fontWeight: 'bold' }}>صفحة الفيسبوك الرسمية</span>
                            </a>

                            <a 
                                href="https://www.instagram.com/1_2010_2009_2008/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', padding: '12px 20px', border: '1px solid #e2e8f0' }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#E1306C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                <span style={{ fontWeight: 'bold' }}>حساب الإنستغرام</span>
                            </a>

                            <a 
                                href="https://www.youtube.com/@امتحان_النجاح" 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', padding: '12px 20px', border: '1px solid #e2e8f0' }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#FF0000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                                <span style={{ fontWeight: 'bold' }}>قناة اليوتيوب الرسمية</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
