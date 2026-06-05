import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';

export const NotFound = () => {
    return (
        <section className="section-padding" style={{ 
            minHeight: 'calc(100vh - 350px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', marginBottom: '20px' }}>
                    <Search size={80} />
                </div>
                <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '2rem', marginBottom: '15px' }}>
                    عذراً، هذه الصفحة غير موجودة!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '35px' }}>
                    قد يكون الرابط الذي اتبعته غير صحيح أو تم نقل الصفحة لمكان آخر. يرجى العودة للرئيسية.
                </p>
                <Link to="/" className="btn btn-primary" style={{ padding: '12px 30px', display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                    <Home size={18} />
                    <span>العودة للصفحة الرئيسية</span>
                </Link>
            </div>
        </section>
    );
};
