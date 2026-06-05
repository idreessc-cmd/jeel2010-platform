import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
import { NotFound } from './pages/NotFound';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
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
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/subscription" element={<Subscription />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
