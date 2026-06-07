import React from 'react';
import { Badge } from '../ui/Badge';
import { UserCheck, UserX, User, Mail, Calendar } from 'lucide-react';

export const StudentsTable = ({ students = [], onToggleSubscription }) => {
    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            marginBottom: '35px'
        }}>
            <div style={{ padding: '20px 25px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0 }}>إدارة اشتراكات الطلاب</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>قائمة بالطلاب المسجلين، يمكنك تفعيل أو إلغاء اشتراكاتهم يدوياً.</p>
            </div>
            
            {/* Desktop Table View */}
            <div className="desktop-students-view" style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'right',
                    fontSize: '0.95rem'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>اسم الطالب</th>
                            <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>البريد الإلكتروني</th>
                            <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>تاريخ الانضمام</th>
                            <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700' }}>حالة الاشتراك</th>
                            <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>التحكم اليدوي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.email} style={{ borderBottom: '1px solid #EDF2F7', transition: 'var(--transition)' }} className="table-row-hover">
                                <td style={{ padding: '15px 25px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={16} style={{ color: 'var(--text-muted)' }} />
                                        <span>{student.studentName}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 25px', color: 'var(--text-main)' }}>{student.email}</td>
                                <td style={{ padding: '15px 25px', color: 'var(--text-muted)' }}>{student.joinDate || '2026-06-01'}</td>
                                <td style={{ padding: '15px 25px' }}>
                                    <Badge type={student.subscriptionStatus === 'active' ? 'success' : 'primary'}>
                                        {student.subscriptionStatus === 'active' ? 'مشترك بالكامل' : 'تجريبي مجاني'}
                                    </Badge>
                                </td>
                                <td style={{ padding: '15px 25px', display: 'flex', justifyContent: 'center' }}>
                                    <button 
                                        onClick={() => onToggleSubscription(
                                            student.email, 
                                            student.subscriptionStatus === 'active' ? 'free' : 'active'
                                        )}
                                        className={`btn ${student.subscriptionStatus === 'active' ? 'btn-outline' : 'btn-primary'}`}
                                        style={{ 
                                            padding: '6px 14px', 
                                            fontSize: '0.85rem', 
                                            borderRadius: 'var(--border-radius-sm)',
                                            width: '140px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            borderWidth: '1px'
                                        }}
                                    >
                                        {student.subscriptionStatus === 'active' ? (
                                            <>
                                                <UserX size={14} />
                                                <span>إلغاء التفعيل</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck size={14} />
                                                <span>تفعيل الحساب</span>
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-students-view" style={{ display: 'none', padding: '15px', flexDirection: 'column', gap: '15px' }}>
                {students.map((student) => (
                    <div key={student.email} style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                            <div>
                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1rem', margin: 0 }}>
                                    {student.studentName}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <Mail size={12} />
                                    <span style={{ wordBreak: 'break-all' }}>{student.email}</span>
                                </div>
                            </div>
                            <Badge type={student.subscriptionStatus === 'active' ? 'success' : 'primary'}>
                                {student.subscriptionStatus === 'active' ? 'مشترك' : 'مجاني'}
                            </Badge>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                            <Calendar size={12} />
                            <span>تاريخ الانضمام: {student.joinDate || '2026-06-01'}</span>
                        </div>
                        
                        <button 
                            onClick={() => onToggleSubscription(
                                student.email, 
                                student.subscriptionStatus === 'active' ? 'free' : 'active'
                            )}
                            className={`btn ${student.subscriptionStatus === 'active' ? 'btn-outline' : 'btn-primary'}`}
                            style={{ 
                                padding: '10px', 
                                fontSize: '0.9rem', 
                                borderRadius: 'var(--border-radius-sm)',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                borderWidth: '1px',
                                marginTop: '4px'
                            }}
                        >
                            {student.subscriptionStatus === 'active' ? (
                                <>
                                    <UserX size={16} />
                                    <span>إلغاء التفعيل</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck size={16} />
                                    <span>تفعيل الحساب</span>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                .table-row-hover:hover {
                    background-color: #F8FAFC;
                }
                @media (max-width: 768px) {
                    .desktop-students-view {
                        display: none !important;
                    }
                    .mobile-students-view {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    );
};
