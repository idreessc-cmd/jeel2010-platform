import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Styling
import './styles/style.css';
import './styles/global.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Subjects } from './pages/Subjects';
import { SubjectDetails } from './pages/SubjectDetails';
import { Lesson } from './pages/Lesson';
import { Quiz } from './pages/Quiz';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';
import { Subscription } from './pages/Subscription';
import { Contact } from './pages/Contact';
import { AccessDenied } from './pages/AccessDenied';
import { NotFound } from './pages/NotFound';

import { authService } from './services/authService';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

// Route Guard for Student Dashboard
const ProtectedRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    if (user.subscriptionStatus === 'disabled' || user.isActive === false) {
        return <Navigate to="/access-denied" state={{ disabled: true }} replace />;
    }
    
    return children;
};

// Route Guard for Admin Panel
const AdminRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.role !== 'admin') {
        return <Navigate to="/access-denied" replace />;
    }
    
    return children;
};

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/subjects" element={<Subjects />} />
                        <Route path="/subject/:id" element={<SubjectDetails />} />
                        <Route path="/subject/:subjectId/lesson/:lessonId" element={<Lesson />} />
                        <Route path="/subject/:subjectId/lesson/:lessonId/quiz" element={<Quiz />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/subscription" element={<Subscription />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/access-denied" element={<AccessDenied />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
