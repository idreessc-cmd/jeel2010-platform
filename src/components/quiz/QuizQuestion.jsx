import React from 'react';

export const QuizQuestion = ({ 
    question, 
    selectedOption, 
    onSelectOption,
    questionIndex,
    totalQuestions
}) => {
    // Option letters for Arabic multiple choice questions
    const optionLetters = ['أ', 'ب', 'جـ', 'د'];

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            padding: '35px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '25px'
        }}>
            {/* Question Header Status */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '15px'
            }}>
                <span style={{ 
                    fontWeight: 'bold', 
                    color: 'var(--primary-color)',
                    fontSize: '1.1rem'
                }}>
                    السؤال {questionIndex + 1} من {totalQuestions}
                </span>
                
                {/* Progress Bar Indicator */}
                <div style={{
                    width: '120px',
                    height: '8px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '50px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '50px',
                        transition: 'var(--transition)'
                    }}></div>
                </div>
            </div>

            {/* Question Text */}
            <h3 style={{ 
                color: 'var(--secondary-color)', 
                fontWeight: '800', 
                fontSize: '1.35rem',
                lineHeight: '1.6',
                marginBottom: '30px'
            }}>
                {question.text}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {question.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelectOption(idx)}
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                border: '2px solid',
                                borderColor: isSelected ? 'var(--primary-color)' : 'var(--border-color)',
                                backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                                borderRadius: 'var(--border-radius-md)',
                                textAlign: 'right',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-family)',
                                fontSize: '1.05rem',
                                fontWeight: isSelected ? '700' : '500',
                                color: isSelected ? 'var(--primary-color)' : 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                transition: 'var(--transition)'
                            }}
                        >
                            <span style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? 'var(--primary-color)' : 'var(--bg-color)',
                                color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                fontSize: '0.9rem'
                            }}>
                                {optionLetters[idx]}
                            </span>
                            <span>{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
