import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Book, Compass, Landmark, BookOpen, FolderOpen, Video } from 'lucide-react';

export const SubjectCard = ({ subject }) => {
    const navigate = useNavigate();
    
    const handleViewSubject = () => {
        navigate(`/subject/${subject.id}`);
    };

    const getSubjectIcon = (id) => {
        switch (id) {
            case 'arabic':
                return <Book size={32} />;
            case 'math':
                return <Compass size={32} />;
            case 'history':
                return <Landmark size={32} />;
            case 'islamic':
                return <BookOpen size={32} />;
            default:
                return <BookOpen size={32} />;
        }
    };

    return (
        <Card className={subject.themeClass}>
            <div className="subject-icon-box" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {getSubjectIcon(subject.id)}
            </div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {subject.title}
                {(subject.id === 'math' || subject.id === 'arabic') && (
                    <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '2px 8px', 
                        backgroundColor: 'rgba(234, 60, 7, 0.1)', 
                        color: '#EA3C07', 
                        borderRadius: 'var(--border-radius-pill)', 
                        fontWeight: '700',
                        border: '1px solid rgba(234, 60, 7, 0.2)',
                        whiteSpace: 'nowrap'
                    }}>
                        قسم التأسيس قريبًا
                    </span>
                )}
            </h3>
            <p>{subject.description}</p>
            <div className="subject-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <FolderOpen size={16} />
                    {subject.unitsCount} وحدات
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Video size={16} />
                    {subject.lessonsCount} درساً
                </span>
            </div>
            <button onClick={handleViewSubject} className="subject-btn" style={{ border: 'none', cursor: 'pointer', width: '100%' }}>
                عرض المادة
            </button>
        </Card>
    );
};
