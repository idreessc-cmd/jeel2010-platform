import React from 'react';
import { Link } from 'react-router-dom';
import { Send, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
    return (
        <footer id="footer">
            <div className="container footer-grid">
                <div className="footer-col footer-about">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <img src="/logo.webp" alt="شعار امتحان النجاح" style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '6px' }} />
                        <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-white)' }}>
                            امتحان <span style={{ color: 'var(--primary-light)' }}>النجاح</span>
                        </h3>
                    </div>
                    <p>منصة تعليمية مبتكرة مصممة خصيصاً لطلاب الصف الأول الثانوي من جيل 2010 في المملكة الأردنية الهاشمية. نسعى لتوفير بيئة تعليمية ذكية، ممتعة، وخالية من التعقيد لمساعدة الطلاب على التفوق والتميز الدراسي.</p>
                    <div className="social-links">
                        <a href="https://www.facebook.com/profile.php?id=100063160512932" target="_blank" rel="noreferrer" className="social-link" aria-label="فيسبوك" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="https://youtube.com/@امتحان_النجاح" target="_blank" rel="noreferrer" className="social-link" aria-label="يوتيوب" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                        </a>
                        <a href="https://instagram.com/1_2010_2009_2008" target="_blank" rel="noreferrer" className="social-link" aria-label="انستجرام" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://t.me/Success_exam" target="_blank" rel="noreferrer" className="social-link" aria-label="تليجرام" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Send size={18} />
                        </a>
                        <a href="https://api.whatsapp.com/send?phone=962782496144" target="_blank" rel="noreferrer" className="social-link" aria-label="واتساب" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageCircle size={18} />
                        </a>
                    </div>
                </div>
                
                <div className="footer-col footer-links">
                    <h4>روابط سريعة</h4>
                    <ul>
                        <li><Link to="/">الرئيسية</Link></li>
                        <li><Link to="/subjects">المواد الدراسية</Link></li>
                        <li><a href="#features">ميزات المنصة</a></li>
                        <li><a href="#pricing">الباقات والاشتراكات</a></li>
                        <li><a href="#faq">الأسئلة الشائعة</a></li>
                    </ul>
                </div>
                
                <div className="footer-col footer-contact">
                    <h4>تواصل معنا</h4>
                    <ul>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={18} style={{ color: 'var(--primary-color)' }} />
                            المملكة الأردنية الهاشمية
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Phone size={18} style={{ color: 'var(--primary-color)' }} />
                            +962 7 8249 6144 (الدعم الفني)
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={18} style={{ color: 'var(--primary-color)' }} />
                            info@success-exam.com
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="container">
                    جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة امتحان النجاح لجيل 2010
                </div>
            </div>
        </footer>
    );
};
