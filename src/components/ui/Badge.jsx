import React from 'react';

export const Badge = ({ 
    children, 
    type = 'info', // info, success, warning, danger, primary
    className = '' 
}) => {
    // Determine colors based on type
    let styles = {
        padding: '4px 10px',
        borderRadius: '50px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        width: 'fit-content'
    };

    if (type === 'primary') {
        styles.backgroundColor = 'var(--primary-light)';
        styles.color = 'var(--primary-color)';
    } else if (type === 'success') {
        styles.backgroundColor = 'var(--bg-islamic)';
        styles.color = 'var(--accent-islamic)';
    } else if (type === 'danger') {
        styles.backgroundColor = 'var(--bg-arabic)';
        styles.color = 'var(--accent-arabic)';
    } else if (type === 'warning') {
        styles.backgroundColor = 'var(--bg-history)';
        styles.color = 'var(--accent-history)';
    } else {
        styles.backgroundColor = '#E2E8F0';
        styles.color = 'var(--text-main)';
    }

    return (
        <span style={styles} className={className}>
            {children}
        </span>
    );
};
