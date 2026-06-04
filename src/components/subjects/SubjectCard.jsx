import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

export const SubjectCard = ({ subject }) => {
    const navigate = useNavigate();
    
    const handleViewSubject = () => {
        navigate(`/subject/${subject.id}`);
    };

    return (
        <Card className={subject.themeClass}>
            <div className="subject-icon-box">
                {subject.icon}
            </div>
            <h3>{subject.title}</h3>
            <p>{subject.description}</p>
            <div className="subject-meta">
                <span>
                    📁 {subject.unitsCount} وحدات
                </span>
                <span>
                    🎥 {subject.lessonsCount} درساً
                </span>
            </div>
            <button onClick={handleViewSubject} className="subject-btn" style={{ border: 'none', cursor: 'pointer', width: '100%' }}>
                عرض المادة
            </button>
        </Card>
    );
};
