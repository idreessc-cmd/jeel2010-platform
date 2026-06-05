import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockSubjects } from '../data/subjects';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { authService } from '../services/authService';
import { Play, BookOpen, Check, X, Plus, Minus, ArrowLeft, Star, Video, Award, TrendingUp, Unlock, MessageCircle, Users, Bell, ClipboardList } from 'lucide-react';

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
                        <div className="hero-badge">
                            <Star size={16} fill="currentColor" />
                            <span>امتحان النجاح – جيل 2010 -</span>
                        </div>
                        <h1>منصة امتحان النجاح لجيل <span>2010</span></h1>
                        <p>منصة تعليمية أردنية لطلاب الصف الأول الثانوي، تجمع بين الدروس المصورة، الدوسيات الخاصة، الاختبارات القصيرة، والمتابعة المستمرة داخل قروبات VIP على واتساب وتيليغرام.</p>
                        <div className="hero-btns">
                            <a 
                                href="https://api.whatsapp.com/send?phone=962782496144"
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span>اشترك عبر واتساب</span>
                                <ArrowLeft size={20} />
                            </a>
                            <Link to="/subjects" className="btn btn-outline">تصفح المواد</Link>
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

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>ميزات منصة امتحان النجاح</h2>
                        <p>كل ما تحتاجه للتميز والتفوق الدراسي في مكان واحد وبطريقة منظمة</p>
                    </div>
                    
                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <Video size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>دروس منظمة حسب المادة</h3>
                                <p>فيديوهات تعليمية مرتبة حسب المادة والوحدة والدرس، مع إمكانية متابعة التقدم.</p>
                            </div>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: '#E8F7E6', color: '#00AF45' }}>
                                <BookOpen size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>دوسية خاصة لكل مادة</h3>
                                <p>كل مادة مدفوعة تحتوي على دوسية خاصة للطالب تساعده على المراجعة والتركيز.</p>
                            </div>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: '#F4E9F8', color: '#A000EA' }}>
                                <MessageCircle size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>متابعة VIP مع المعلمين</h3>
                                <p>المشترك يحصل على متابعة داخل قروبات خاصة VIP على واتساب وتيليغرام، بإشراف المعلمين.</p>
                            </div>
                        </div>
                        
                        {/* Feature 4 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: '#FAE8E8', color: '#EA3C07' }}>
                                <ClipboardList size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>اختبارات قصيرة و Quizzes</h3>
                                <p>اختبارات قصيرة داخل المنصة وداخل القروبات لمتابعة مستوى الطالب وقياس الفهم أولًا بأول.</p>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                                <Bell size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>تنبيهات المحتوى الجديد</h3>
                                <p>يتم إعلام الطلاب داخل القروبات عند رفع أي درس أو اختبار أو محتوى جديد على المنصة.</p>
                            </div>
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
                                <div className="pricing-price">0 د.أ <span>/ دائماً</span></div>
                                <p>مثالية لتجربة المنصة والتأكد من ملاءمة أسلوب الشرح لك قبل أي اشتراك.</p>
                            </div>
                            
                            <ul className="pricing-features">
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> مشاهدة أول درسين من كل مادة</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> خوض الاختبارات القصيرة لأول درسين</li>
                                <li className="unavailable"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></i> الدوسية الخاصة لكل مادة</li>
                                <li className="unavailable"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></i> متابعة VIP مع المعلمين</li>
                                <li className="unavailable"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></i> تنبيهات المحتوى الجديد</li>
                            </ul>
                            
                            <Link to="/subjects" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center' }}>
                                ابدأ التجربة المجانية
                            </Link>
                        </div>
                        
                        <div className="pricing-card popular">
                            <div className="popular-badge">الأكثر اختياراً</div>
                            <div className="pricing-header">
                                <h3>باقة الوصول الكامل</h3>
                                <div className="pricing-price" style={{ fontSize: '1.4rem', lineHeight: '1.4', minHeight: '60px', display: 'flex', alignItems: 'center' }}>تواصل معنا لمعرفة تفاصيل الاشتراك</div>
                                <p>تفتح لك كامل المنهج والميزات وتضمن لك التفوق الدراسي الكامل ومتابعة حية.</p>
                            </div>
                            
                            <ul className="pricing-features">
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> مشاهدة جميع دروس المنهج بلا استثناء</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> خوض كافة الاختبارات والواجبات الدورية</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> تحميل كافة ملخصات ومذكرات الـ PDF للطباعة</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> متابعة VIP مع المعلمين وتواصل مباشر</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> تنبيهات المحتوى الجديد فوراً</li>
                            </ul>
                            
                            <a 
                                href="https://api.whatsapp.com/send?phone=962782496144" 
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary" 
                                style={{ marginTop: 'auto', textAlign: 'center' }}
                            >
                                اشترك الآن عبر واتساب
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Soon Section */}
            <section id="soon" className="section-padding" style={{ backgroundColor: '#f8fafc' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>قريباً في منصتنا</h2>
                        <p>نعمل باستمرار على إطلاق ميزات وأقسام جديدة لدعم رحلتك التعليمية</p>
                    </div>
                    
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '40px',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(234, 60, 7, 0.1)',
                            color: '#EA3C07',
                            padding: '12px 24px',
                            borderRadius: 'var(--border-radius-pill)',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Award size={18} />
                            <span>تأسيس اللغة العربية والرياضيات</span>
                        </div>
                        
                        <h3 style={{ fontSize: '1.8rem', color: 'var(--secondary-color)', fontWeight: '800' }}>قسم التأسيس الشامل</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.7' }}>
                            نحضّر حالياً لقسم تأسيسي متكامل لمادتي الرياضيات واللغة العربية، لتمكين الطلاب من بناء أساس قوي يساعدهم على التفوق الدراسي بيسر وسهولة.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
                            <TrendingUp size={20} />
                            <span>تابعونا لمعرفة موعد الإطلاق عبر قروباتنا</span>
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
                                        <span className="faq-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{isActive ? <Minus size={18} /> : <Plus size={18} />}</span>
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
