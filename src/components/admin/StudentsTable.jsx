import React from 'react';
import { Badge } from '../ui/Badge';
import { UserCheck, UserX } from 'lucide-react';

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
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>قائمة بالطلاب المسجلين، يمكنك تنشيط أو إلغاء اشتراكاتهم يدوياً فوراً</p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
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
                                <td style={{ padding: '15px 25px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{student.studentName}</td>
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
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

            <style>{`
                .table-row-hover:hover {
                    background-color: #F8FAFC;
                }
            `}</style>
        </div>
    );
};
