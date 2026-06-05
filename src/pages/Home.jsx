import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockSubjects } from '../data/subjects';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { authService } from '../services/authService';
import { Play, BookOpen, Check, X, Plus, Minus, ArrowLeft, Star, Video, Award, TrendingUp, Unlock } from 'lucide-react';

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
                            <span>منصة تعليمية لطلاب الأول الثانوي</span>
                        </div>
                        <h1>ابدأ رحلة التفوق في مواد <span>جيل 2010</span></h1>
                        <p>منصة تعليمية منظمة لطلاب الصف الأول الثانوي، تجمع بين الفيديوهات، الملخصات، الأنشطة، والاختبارات القصيرة لتساعدك على الدراسة بثقة ووضوح.</p>
                        <div className="hero-btns">
                            <Link to="/subjects" className="btn btn-primary">
                                <span>ابدأ التعلم الآن</span>
                                <ArrowLeft size={20} />
                            </Link>
                            <Link to="/subjects" className="btn btn-outline">تصفح المواد</Link>
                        </div>
                        
                        {/* Social Proof / Stats */}
                        <div className="hero-stats">
                            <div className="student-avatars">
                                <div className="avatar-placeholder" style={{ backgroundColor: '#ffdad6', color: '#ba1a1a' }}>أ</div>
                                <div className="avatar-placeholder" style={{ backgroundColor: '#dee2ed', color: '#252a32' }}>م</div>
                                <div className="avatar-placeholder" style={{ backgroundColor: '#dce1ff', color: '#00236f' }}>س</div>
                                <div className="avatar-placeholder" style={{ backgroundColor: '#d3e4fe', color: '#0058be' }}>+10k</div>
                            </div>
                            <div className="stats-text">
                                <div className="stars-row">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span className="stats-label">4.9/5 من قبل الطلاب المتميزين</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual Card / Logo Column */}
                    <div className="hero-visual hero-logo-visual">
                        <div className="hero-logo-card">
                            <img
                                src="/logo.webp"
                                alt="شعار امتحان النجاح"
                                className="hero-platform-logo"
                            />
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
                        <h2>ميزات منصة جيل 2010</h2>
                        <p>كل ما تحتاجه للتميز والتفوق الدراسي في مكان واحد وبطريقة منظمة</p>
                    </div>
                    
                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <Video size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>دروس منظمة</h3>
                                <p>فيديوهات وملخصات مرتبة حسب المادة والوحدة والدرس.</p>
                            </div>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: '#E8F7E6', color: '#00AF45' }}>
                                <Award size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>اختبارات قصيرة</h3>
                                <p>أسئلة بعد كل درس لقياس الفهم مباشرة.</p>
                            </div>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: '#F4E9F8', color: '#A000EA' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>متابعة التقدم</h3>
                                <p>اعرف آخر درس شاهدته ونتائج اختباراتك.</p>
                            </div>
                        </div>
                        
                        {/* Feature 4 */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper" style={{ backgroundColor: '#FAE8E8', color: '#EA3C07' }}>
                                <Unlock size={24} />
                            </div>
                            <div className="feature-info">
                                <h3>اشتراك بسيط</h3>
                                <p>أول درسين مجانًا، وباقي المحتوى للمشتركين.</p>
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
                                <div className="pricing-price">0 ج.م <span>/ دائماً</span></div>
                                <p>مثالية لتجربة المنصة والتأكد من ملاءمة أسلوب الشرح لك قبل أي اشتراك.</p>
                            </div>
                            
                            <ul className="pricing-features">
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> مشاهدة أول درسين من كل مادة</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> خوض الاختبارات القصيرة لأول درسين</li>
                                <li className="unavailable"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></i> الوصول لباقي المنهج والدروس</li>
                                <li className="unavailable"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></i> تحميل ملخصات ومذكرات الـ PDF</li>
                                <li className="unavailable"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></i> تقارير متابعة تقدم الطالب الدراسية</li>
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
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> مشاهدة جميع دروس المنهج بلا استثناء</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> خوض كافة الاختبارات والواجبات الدورية</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> تحميل كافة ملخصات ومذكرات الـ PDF للطباعة</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> تقارير دورية متكاملة لمتابعة مستوى التقدم الدراسي</li>
                                <li className="available"><i style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} /></i> تواصل مباشر مع المدرسين لحل الأسئلة الصعبة</li>
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
