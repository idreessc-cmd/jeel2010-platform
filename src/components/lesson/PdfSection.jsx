import React from 'react';
import { FileText, Download } from 'lucide-react';

export const PdfSection = ({ pdfUrl, lessonTitle }) => {
    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '30px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={40} style={{ color: 'var(--primary-color)' }} />
                    </span>
                    <div>
                        <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0 }}>ملخص ومذكرة الدرس (PDF)</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>ملخص مركز وشامل لجميع عناصر الدرس بصيغة قابلة للطباعة</p>
                    </div>
                </div>
                
                <a 
                    href={pdfUrl} 
                    download={`ملخص_${lessonTitle}.pdf`}
                    onClick={(e) => {
                        e.preventDefault();
                        alert('تنبيه تجريبي: تم حفظ ملف الـ PDF بنجاح في مجلد التنزيلات!');
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.95rem', padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <Download size={16} />
                    <span>تحميل الملخص الآن</span>
                </a>
            </div>
            
            {/* Embedded Simulated PDF Reader Preview */}
            <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-md)',
                backgroundColor: '#F8FAFC',
                padding: '40px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    backgroundColor: '#FFFFFF',
                    padding: '30px 20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    lineHeight: '1.8'
                }}>
                    <h5 style={{ color: 'var(--secondary-color)', fontWeight: '800', borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', marginBottom: '15px' }}>
                        {lessonTitle} - ملخص سريع
                    </h5>
                    <ul style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-main)', padding: '0 15px', listStyleType: 'disc' }}>
                        <li>العنصر الأول: مراجعة شاملة لجميع المفاهيم الأساسية الواردة بالدرس.</li>
                        <li>العنصر الثاني: توضيح الأمثلة المحلولة والتمارين التدريبية الهامة.</li>
                        <li>العنصر الثالث: خرائط ذهنية وجداول مقارنة لتبسيط الحفظ والاستيعاب.</li>
                    </ul>
                    <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                        الصفحة 1 من 3
                    </div>
                </div>
                
                {/* Visual indicator of pages below */}
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    alignItems: 'center'
                }}>
                    <button disabled style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', cursor: 'not-allowed', background: '#F1F5F9' }}>السابق</button>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>صفحة 1 / 3</span>
                    <button onClick={() => alert('للاطلاع على باقي الصفحات بالكامل يرجى تحميل ملف الـ PDF المرفق أعلاه.')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', cursor: 'pointer', background: '#FFF' }}>التالي</button>
                </div>
            </div>
        </div>
    );
};
