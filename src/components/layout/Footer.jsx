import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer id="footer">
            <div className="container footer-grid">
                <div className="footer-col footer-about">
                    <h3>جيل <span>2010</span></h3>
                    <p>منصة تعليمية مبتكرة مصممة خصيصاً لطلاب الصف الأول الثانوي من جيل 2010. نسعى لتوفير بيئة تعليمية ذكية، ممتعة، وخالية من التعقيد لمساعدة الطلاب على التفوق والتميز الدراسي بأسهل الطرق الممكنة.</p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="فيسبوك">📘</a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link" aria-label="يوتيوب">📺</a>
                        <a href="https://telegram.org" target="_blank" rel="noreferrer" className="social-link" aria-label="تليجرام">✈️</a>
                        <a href="https://wa.me/201012345678" target="_blank" rel="noreferrer" className="social-link" aria-label="واتساب">💬</a>
                    </div>
                </div>
                
                <div className="footer-col footer-links">
                    <h4>روابط سريعة</h4>
                    <ul>
                        <li><Link to="/">الرئيسية</Link></li>
                        <li><Link to="/subjects">المواد الدراسية</Link></li>
                        <li><a href="#how-it-works">كيف تعمل المنصة؟</a></li>
                        <li><a href="#pricing">الباقات والاشتراكات</a></li>
                        <li><a href="#faq">الأسئلة الشائعة</a></li>
                    </ul>
                </div>
                
                <div className="footer-col footer-contact">
                    <h4>تواصل معنا</h4>
                    <ul>
                        <li>
                            <span>📍</span>
                            جمهورية مصر العربية - القاهرة
                        </li>
                        <li>
                            <span>📞</span>
                            +20 101 234 5678 (واتساب الفني)
                        </li>
                        <li>
                            <span>✉️</span>
                            info@jeel2010.com
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="container">
                    جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة جيل 2010 التعليمية
                </div>
            </div>
        </footer>
    );
};
