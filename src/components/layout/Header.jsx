import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Badge } from '../ui/Badge';

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Check user session on render or location change
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    }, [location]);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/');
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close menu when clicking links
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const isAdmin = user && user.role === 'admin';
    const isStudent = user && user.role === 'student';
    const isVisitor = !user;

    return (
        <header>
            <div className="container header-container">
                <Link to="/" className="logo" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/logo.webp" alt="شعار امتحان النجاح" style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '6px' }} />
                    <span>امتحان <span>النجاح</span></span>
                </Link>
                
                <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {/* الرئيسية: shown to everyone */}
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={handleLinkClick}
                    >
                        الرئيسية
                    </Link>

                    {/* المواد: visitor & student only */}
                    {(isVisitor || isStudent) && (
                        <Link 
                            to="/subjects" 
                            className={`nav-link ${location.pathname.startsWith('/subjects') || location.pathname.startsWith('/subject/') ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            المواد
                        </Link>
                    )}
                    
                    {/* لوحة الطالب: student only */}
                    {isStudent && (
                        <Link 
                            to="/dashboard" 
                            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            لوحة الطالب
                        </Link>
                    )}

                    {/* لوحة الإدارة: admin only */}
                    {isAdmin && (
                        <Link 
                            to="/admin" 
                            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            لوحة الإدارة
                        </Link>
                    )}

                    {/* الاشتراك: visitor & student only */}
                    {(isVisitor || isStudent) && (
                        <Link 
                            to="/subscription" 
                            className={`nav-link ${location.pathname === '/subscription' ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            الاشتراك
                        </Link>
                    )}

                    {/* تواصل معنا: visitor & student only */}
                    {(isVisitor || isStudent) && (
                        <Link 
                            to="/contact" 
                            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            تواصل معنا
                        </Link>
                    )}
                    
                    {/* Mobile Only Session Info & Actions */}
                    {user ? (
                        <div className="mobile-user-box" style={{ display: 'none', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '15px' }}>
                            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 'bold' }}>{user.studentName}</span>
                                <Badge type={user.role === 'admin' ? 'success' : user.subscriptionStatus === 'active' ? 'success' : 'primary'}>
                                    {user.role === 'admin' ? 'إدارة المنصة' : user.subscriptionStatus === 'active' ? 'مشترك' : 'مجاني'}
                                </Badge>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="btn btn-outline" 
                                style={{ width: '100%', padding: '10px' }}
                            >
                                تسجيل الخروج
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="btn btn-primary"
                            style={{ display: 'none', width: '100%', marginTop: '15px', textAlign: 'center' }}
                            onClick={handleLinkClick}
                        >
                            تسجيل الدخول
                        </Link>
                    )}
                </nav>
                
                <div className="nav-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user.studentName}</span>
                                <Badge type={user.role === 'admin' ? 'success' : user.subscriptionStatus === 'active' ? 'success' : 'primary'}>
                                    {user.role === 'admin' ? 'إدارة المنصة' : user.subscriptionStatus === 'active' ? 'مشترك بالكامل' : 'حساب مجاني'}
                                </Badge>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="btn btn-outline" 
                                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                            >
                                خروج
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.95rem' }}>
                            تسجيل الدخول
                        </Link>
                    )}
                </div>
                
                <button 
                    className={`hamburger ${isOpen ? 'active' : ''}`} 
                    onClick={toggleMenu} 
                    aria-label="فتح القائمة"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            
            {/* Inline CSS Helper for Mobile responsive box injection */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-menu.active .mobile-user-box,
                    .nav-menu.active .btn-primary {
                        display: block !important;
                    }
                }
            `}</style>
        </header>
    );
};
