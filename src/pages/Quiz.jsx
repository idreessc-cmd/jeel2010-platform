import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuizForLesson } from '../data/quizzes';
import { mockSubjects } from '../data/subjects';
import { mockLessons } from '../data/lessons';
import { authService } from '../services/authService';
import { quizService } from '../services/quizService';
import { QuizQuestion } from '../components/quiz/QuizQuestion';
import { QuizResult } from '../components/quiz/QuizResult';
import { ArrowRight, ArrowLeft, BookOpen, Save } from 'lucide-react';

export const Quiz = () => {
    const { subjectId, lessonId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    // Quiz state
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores { questionIndex: selectedOptionIndex }
    const [isFinished, setIsFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const subject = mockSubjects.find(s => s.id === subjectId);
    const units = mockLessons[subjectId] || [];
    const lesson = units.flatMap(u => u.lessons).find(l => l.id === lessonId);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        // Check if user is logged in
        if (!currentUser) {
            alert('يرجى تسجيل الدخول أولاً لتتمكن من خوض الاختبار وحفظ نتيجتك.');
            navigate('/login');
            return;
        }

        // Load quiz data
        const quizData = getQuizForLesson(lessonId);
        setQuiz(quizData);

        // Reset quiz state when lesson changes
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setIsFinished(false);
        setFinalScore(0);
    }, [lessonId]);

    if (!subject || !lesson || !quiz) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2>الاختبار غير موجود</h2>
                <Link to="/subjects" className="btn btn-primary">العودة للمواد</Link>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;

    const handleSelectOption = (optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: optionIndex
        });
    };

    const handleNext = () => {
        if (selectedAnswers[currentQuestionIndex] === undefined) {
            alert('يرجى اختيار إجابة واحدة أولاً للانتقال للسؤال التالي.');
            return;
        }
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFinish = () => {
        if (selectedAnswers[currentQuestionIndex] === undefined) {
            alert('يرجى اختيار إجابة للسؤال الحالي قبل إنهاء الاختبار.');
            return;
        }

        // Calculate score
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctAnswer) {
                score += 1;
            }
        });

        // Save result
        if (user) {
            const percentage = Math.round((score / totalQuestions) * 100);
            const resultData = {
                score: score,
                total: totalQuestions,
                percentage: percentage
            };
            quizService.saveResult(user.email, lessonId, resultData);
        }

        setFinalScore(score);
        setIsFinished(true);
    };

    const handleRetake = () => {
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setIsFinished(false);
        setFinalScore(0);
    };

    return (
        <section className="section-padding" style={{ backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 350px)' }}>
            <div className="container" style={{ maxWidth: '750px' }}>
                
                {/* Back to Lesson Link */}
                <div style={{ marginBottom: '25px' }}>
                    <Link to={`/subject/${subjectId}/lesson/${lessonId}`} style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowRight size={18} />
                        العودة لدرس: {lesson.title}
                    </Link>
                </div>

                {!isFinished ? (
                    <div>
                        {/* Quiz Title & Header */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: '20px 25px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            marginBottom: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px'
                        }}>
                            <div>
                                <h4 style={{ color: 'var(--secondary-color)', fontWeight: '800', margin: 0 }}>
                                    {quiz.title}
                                </h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                    أجب عن الأسئلة بدقة لقياس مدى استيعابك
                                </p>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <BookOpen size={16} />
                                مادة {subject.title}
                            </span>
                        </div>

                        {/* Active Question Render */}
                        <QuizQuestion 
                            question={currentQuestion}
                            selectedOption={selectedAnswers[currentQuestionIndex]}
                            onSelectOption={handleSelectOption}
                            questionIndex={currentQuestionIndex}
                            totalQuestions={totalQuestions}
                        />

                        {/* Quiz Navigators */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '25px'
                        }}>
                            <button 
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                className="btn btn-outline"
                                style={{ 
                                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <ArrowRight size={16} />
                                السؤال السابق
                            </button>

                            {currentQuestionIndex < totalQuestions - 1 ? (
                                <button 
                                    onClick={handleNext}
                                    className="btn btn-primary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    السؤال التالي
                                    <ArrowLeft size={16} />
                                </button>
                            ) : (
                                <button 
                                    onClick={handleFinish}
                                    className="btn btn-secondary"
                                    style={{ boxShadow: '0 4px 12px rgba(68, 46, 102, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Save size={16} />
                                    إنهاء الاختبار وإظهار النتيجة
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Quiz Result View
                    <QuizResult 
                        score={finalScore}
                        totalQuestions={totalQuestions}
                        onRetake={handleRetake}
                        subjectId={subjectId}
                        lessonId={lessonId}
                    />
                )}
            </div>
        </section>
    );
};
