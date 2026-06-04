import React from 'react';

export const Card = ({ 
    children, 
    className = '', 
    onClick,
    style = {}
}) => {
    return (
        <div 
            className={`subject-card ${className}`} 
            onClick={onClick}
            style={{ 
                cursor: onClick ? 'pointer' : 'default',
                ...style 
            }}
        >
            {children}
        </div>
    );
};
