import React from 'react';

export const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    variant = 'primary', // primary, outline, secondary, text
    className = '', 
    disabled = false,
    icon = null,
    href = null
}) => {
    const baseClass = 'btn';
    let variantClass = 'btn-primary';
    
    if (variant === 'outline') variantClass = 'btn-outline';
    if (variant === 'secondary') variantClass = 'btn-secondary';
    if (variant === 'text') variantClass = 'btn-text';
    
    const combinedClasses = `${baseClass} ${variantClass} ${className}`;
    
    if (href) {
        return (
            <a href={href} className={combinedClasses} onClick={onClick}>
                {children}
                {icon && <span className="btn-icon">{icon}</span>}
            </a>
        );
    }
    
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className={combinedClasses} 
            disabled={disabled}
        >
            {children}
            {icon && <span className="btn-icon">{icon}</span>}
        </button>
    );
};
