import React from 'react';
import { Check, X, MessageCircle, Gem, BookOpen, Users, Bell, ClipboardList } from 'lucide-react';

export const Subscription = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 350px)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <h2>باقات الاشتراك وتنشيط العضوية</h2>
                    <p>انضم إلى منصة امتحان النجاح لجيل 2010 واحصل على أفضل تجربة تعليمية مخصصة لتفوقك الدراسي.</p>
                </div>

                <div className="pricing-grid" style={{ marginBottom: '50px' }}>
                    {/* Free Card */}
                    <div className="pricing-card" style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '40px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div className="pricing-header" style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.4rem' }}>الباقة المجانية (التجريبية)</h3>
                            <div className="pricing-price" style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)', margin: '15px 0' }}>
                                0 د.أ <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>/ دائماً</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>مثالية لتجربة جودة الشرح وملاءمة المنصة لأسلوبك الدراسي.</p>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 35px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>مشاهدة أول درسين من كل مادة</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>حل الاختبارات التقييمية لأول درسين</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--accent-arabic)', display: 'inline-flex' }}><X size={16} /></span>
                                <span>الدوسيات والملخصات الخاصة للمواد</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--accent-arabic)', display: 'inline-flex' }}><X size={16} /></span>
                                <span>الانضمام إلى قروبات VIP والمتابعة</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--accent-arabic)', display: 'inline-flex' }}><X size={16} /></span>
                                <span>تنبيهات المحتوى الجديد مباشرة</span>
                            </li>
                        </ul>
                    </div>

                    {/* Paid Card */}
                    <div className="pricing-card popular" style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '40px',
                        boxShadow: 'var(--shadow-lg)',
                        border: '2px solid var(--primary-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '20px',
                            backgroundColor: 'var(--primary-color)',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '4px 12px',
                            borderRadius: '50px'
                        }}>الأكثر طلباً</div>

                        <div className="pricing-header" style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.4rem' }}>باقة الوصول الكامل + VIP</h3>
                            <div className="pricing-price" style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-color)', margin: '15px 0', lineHeight: '1.4', minHeight: '50px', display: 'flex', alignItems: 'center' }}>
                                تواصل لمعرفة تفاصيل الاشتراك الرمزي
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>تفتح لك كامل المنهج والميزات وتضمن لك التفوق الدراسي الكامل ومتابعة حية مع المعلمين.</p>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 35px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>مشاهدة جميع دروس المنهج بلا استثناء</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>تحميل كافة الدوسيات والملخصات (PDF)</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>خوض كافة الاختبارات والواجبات الدورية</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>متابعة VIP مع المعلمين لحل الأسئلة الصعبة</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>قروبات VIP خاصة على واتساب وتيليغرام</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--success-color)', display: 'inline-flex' }}><Check size={16} /></span>
                                <span>تنبيهات فورية للمحتوى الجديد والملخصات</span>
                            </li>
                        </ul>

                        <a 
                            href="https://api.whatsapp.com/send?phone=962782496144&text=مرحباً، أريد الاشتراك وتفعيل باقة الوصول الكامل لمنصة امتحان النجاح لجيل 2010" 
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}
                        >
                            <MessageCircle size={18} />
                            <span>اشترك الآن عبر واتساب</span>
                        </a>
                    </div>
                </div>

                {/* Subscription Benefits Details */}
                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.4rem', marginBottom: '25px', textAlign: 'center' }}>
                    تفاصيل مزايا اشتراك VIP كامل العضوية
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--primary-color)', marginBottom: '12px' }}><BookOpen size={28} /></div>
                        <h4 style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--secondary-color)' }}>الدوسية الخاصة لكل مادة</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>كل مادة تحتوي على ملخص ودوسية PDF ممتازة يتم تجهيزها لمساعدتك في المراجعة والاستعداد للاختبارات.</p>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--primary-color)', marginBottom: '12px' }}><Users size={28} /></div>
                        <h4 style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--secondary-color)' }}>قروبات VIP ومتابعة المعلمين</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>تواصل مباشر ومستمر داخل مجموعات خاصة VIP على واتساب وتيليغرام للحصول على إجابات لأسئلتك من المدرسين.</p>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--primary-color)', marginBottom: '12px' }}><ClipboardList size={28} /></div>
                        <h4 style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--secondary-color)' }}>اختبارات تفاعلية مستمرة</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>تمارين واختبارات تفاعلية قصيرة (Quizzes) بعد كل درس لمراقبة تقدمك والتأكد من استيعابك الكامل للأفكار.</p>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--primary-color)', marginBottom: '12px' }}><Bell size={28} /></div>
                        <h4 style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--secondary-color)' }}>إشعارات وتنبيهات مستمرة</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>سنبقيك على اطلاع دائم بكل درس جديد أو ملف أو تنبيه مهم يتم رفعه على المنصة حتى لا تفوتك أي تفاصيل.</p>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(234, 60, 7, 0.05)',
                    border: '1px dashed var(--primary-color)',
                    padding: '25px',
                    borderRadius: 'var(--border-radius-md)',
                    textAlign: 'center'
                }}>
                    <h4 style={{ fontWeight: '800', color: 'var(--secondary-color)', marginBottom: '10px' }}>خطوات تفعيل الحساب بعد الدفع:</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 auto 15px auto', maxWidth: '600px', lineHeight: '1.6' }}>
                        بعد إتمام عملية الدفع الرمزي، سيقوم فريق الدعم الفني بإرسال كود التفعيل المخصص لحسابك. يمكنك استخدامه لتنشيط حسابك فوراً والبدء في الدراسة بلا حدود.
                    </p>
                    <a 
                        href="https://api.whatsapp.com/send?phone=962782496144" 
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        <MessageCircle size={16} />
                        <span>تواصل معنا للاشتراك والتفعيل</span>
                    </a>
                </div>
            </div>
        </section>
    );
};
