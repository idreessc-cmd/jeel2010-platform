import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockSubjects } from '../data/subjects';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { authService } from '../services/authService';

export const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeFaq, setActiveFaq] = useState(null);

    useEffect(() => {
        setUser(authService.getCurrentUser());
    }, []);

    const faqItems = [
        {
            q: 'هل الدروس الأولى مجانية فعلاً؟',
            a: 'نعم، نتيح لك مشاهدة أول درسين من كل مادة دراسية مجاناً بالكامل، بالإضافة لخوض اختباراتها التقييمية والاطلاع على ملخص الـ PDF الخاص بها لمساعدتك في اتخاذ القرار المناسب.'
        },
        {
            q: 'كيف يمكنني الاشتراك وتفعيل الباقة الكاملة؟',
            a: 'الاشتراك سهل للغاية! تواصل معنا عبر رقم الواتساب الموضح أسفل الصفحة، وسيتم إرشادك لخطوات دفع الاشتراك، ومن ثم سنقوم بتفعيل الحساب فوراً برمز كود مخصص.'
        },
        {
            q: 'هل يمكنني استخدام المنصة من الهاتف المحمول؟',
            a: 'نعم بكل تأكيد. المنصة مصممة لتكون متجاوبة بالكامل لتعمل بأعلى كفاءة وسرعة على الهواتف الذكية بمختلف أحجامها، وكذلك الأجهزة اللوحية (Tablets) وأجهزة الكمبيوتر.'
        },
        {
            q: 'هل يوجد امتحانات واختبارات بعد كل درس؟',
            a: 'نعم، بعد نهاية شرح كل درس، يوجد اختبار تفاعلي قصير يتكون من 5 أسئلة اختيار من متعدد، يقوم بتصحيح إجاباتك فورياً وإظهار النتيجة لمساعدتك على تقييم فهمك للدرس بشكل دقيق ومباشر.'
        }
    ];

    const toggleFaq = (index) => {
        if (activeFaq === index) {
            setActiveFaq(null);
        } else {
            setActiveFaq(index);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <h1>منصة <span>جيل 2010</span> التعليمية</h1>
                        <p>تعلم مواد الصف الأول الثانوي بطريقة منظمة وبأسلوب تفاعلي ممتع من خلال فيديوهات شرح مبسطة، ملخصات مركزة، أنشطة عملية، واختبارات قصيرة تقيس فهمك أولاً بأول.</p>
                        <div className="hero-btns">
                            <Link to="/subjects" className="btn btn-primary">
                                <span>ابدأ التعلم الآن</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                            <Link to="/subjects" className="btn btn-outline">شاهد الدروس المجانية</Link>
                        </div>
                    </div>
                    
                    <div className="hero-image-wrapper">
                        <div className="hero-image-bg"></div>
                        <img src="./assets/images/girl.webp" alt="طالبة تدرس بتركيز" className="hero-image" />
                        
                        {/* Floating Badge 1 */}
                        <div className="badge-floating badge-1">
                            <div className="badge-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                🎬
                            </div>
                            <div className="badge-info">
                                <h4>فيديوهات مسجلة</h4>
                                <p>بجودة عالية وشرح مبسط</p>
                            </div>
                        </div>
                        
                        {/* Floating Badge 2 */}
                        <div className="badge-floating badge-2">
                            <div className="badge-icon" style={{ backgroundColor: 'var(--bg-islamic)', color: 'var(--accent-islamic)' }}>
                                📝
                            </div>
                            <div className="badge-info">
                                <h4>ملخصات واختبارات</h4>
                                <p>لكل درس دراسي مباشرة</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subjects Section */}
            <section id="subjects" className="section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2>المواد الدراسية الأساسية</h2>
                        <p>نقدم شرحاً تفصيلياً متكاملاً وممتعاً لأربعة من أهم المواد المقررة على الصف الأول الثانوي لجيل 2010</p>
                    </div>
                    
                    <div className="subjects-grid">
                        {mockSubjects.map(subject => (
                            <SubjectCard key={subject.id} subject={subject} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="section-padding how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2>كيف تعمل المنصة؟</h2>
                        <p>أربع خطوات بسيطة تفصلك عن التفوق الدراسي والتعلم بذكاء من منزلك</p>
                    </div>
                    
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <h3>أنشئ حسابك</h3>
                            <p>قم بإنشاء حساب طالب جديد مجاناً في ثوانٍ معدودة لتسجيل تقدمك الدراسي.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">02</div>
                            <h3>اختر المادة</h3>
                            <p>تصفح قائمة المواد المتاحة واختر المادة التي ترغب في دراستها الآن.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">03</div>
                            <h3>شاهد أول درسين مجاناً</h3>
                            <p>جرب الشرح والملخصات التفاعلية وحل الاختبارات لأول درسين من كل مادة مجاناً.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">04</div>
                            <h3>اشترك للوصول الكامل</h3>
                            <p>اشترك في باقة الوصول الكامل لتفتح جميع الوحدات والدروس والاختبارات المتبقية.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2>باقات الاشتراك المتاحة</h2>
                        <p>اختر الباقة المناسبة لاحتياجاتك وابدأ مسار التفوق والتفوق الدراسي اليوم</p>
                    </div>
                    
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>الباقة المجانية</h3>
                                <div className="pricing-price">0 ج.م <span>/ دائماً</span></div>
                                <p>مثالية لتجربة المنصة والتأكد من ملاءمة أسلوب الشرح لك قبل أي اشتراك.</p>
                            </div>
                            
                            <ul className="pricing-features">
                                <li className="available"><i>✓</i> مشاهدة أول درسين من كل مادة</li>
                                <li className="available"><i>✓</i> خوض الاختبارات القصيرة لأول درسين</li>
                                <li className="unavailable"><i>✗</i> الوصول لباقي المنهج والدروس</li>
                                <li className="unavailable"><i>✗</i> تحميل ملخصات ومذكرات الـ PDF</li>
                                <li className="unavailable"><i>✗</i> تقارير متابعة تقدم الطالب الدراسية</li>
                            </ul>
                            
                            <Link to="/subjects" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center' }}>
                                ابدأ التجربة المجانية
                            </Link>
                        </div>
                        
                        <div className="pricing-card popular">
                            <div className="popular-badge">الأكثر اختياراً</div>
                            <div className="pricing-header">
                                <h3>باقة الوصول الكامل</h3>
                                <div className="pricing-price">اشتراك شهري <span>/ رمزي</span></div>
                                <p>تفتح لك كامل المنهج والميزات وتضمن لك التفوق الدراسي الكامل ومتابعة حية.</p>
                            </div>
                            
                            <ul className="pricing-features">
                                <li className="available"><i>✓</i> مشاهدة جميع دروس المنهج بلا استثناء</li>
                                <li className="available"><i>✓</i> خوض كافة الاختبارات والواجبات الدورية</li>
                                <li className="available"><i>✓</i> تحميل كافة ملخصات ومذكرات الـ PDF للطباعة</li>
                                <li className="available"><i>✓</i> تقارير دورية متكاملة لمتابعة مستوى التقدم الدراسي</li>
                                <li className="available"><i>✓</i> تواصل مباشر مع المدرسين لحل الأسئلة الصعبة</li>
                            </ul>
                            
                            <a href="#footer" className="btn btn-primary" style={{ marginTop: 'auto', textAlign: 'center' }}>
                                اشترك الآن بالكامل
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="section-padding faq">
                <div className="container">
                    <div className="section-header">
                        <h2>الأسئلة الشائعة</h2>
                        <p>إجابات وافية وسريعة على أهم الأسئلة التي قد تدور في ذهنك حول المنصة</p>
                    </div>
                    
                    <div className="faq-container">
                        {faqItems.map((item, idx) => {
                            const isActive = activeFaq === idx;
                            return (
                                <div key={idx} className={`faq-item ${isActive ? 'active' : ''}`}>
                                    <button className="faq-trigger" onClick={() => toggleFaq(idx)}>
                                        <span>{item.q}</span>
                                        <span className="faq-icon">{isActive ? '×' : '+'}</span>
                                    </button>
                                    {isActive && (
                                        <div className="faq-content" style={{ maxHeight: '500px' }}>
                                            <p>{item.a}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};
