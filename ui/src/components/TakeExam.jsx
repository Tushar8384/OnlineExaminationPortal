import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TakeExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [examDetails, setExamDetails] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showTimeWarning, setShowTimeWarning] = useState(false);

    const questionRefs = useRef([]);
    const timerIntervalRef = useRef(null);

    // Fetch exam data
    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const [examRes, qRes] = await Promise.all([
                    api.get(`/exams/${id}`),
                    api.get(`/questions/exam/${id}`)
                ]);

                setExamDetails(examRes.data);
                setTimeLeft(examRes.data.durationMinutes ? examRes.data.durationMinutes * 60 : 3600);
                setQuestions(qRes.data);

                // Initialize answers object
                const initialAnswers = {};
                qRes.data.forEach(q => { initialAnswers[q.id] = null; });
                setAnswers(initialAnswers);

            } catch (error) {
                console.error("Error fetching data:", error);
                // Show error toast/notification
                alert("❌ Failed to load exam. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchExamData();

        // Cleanup timer on unmount
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [id]);

    // Timer management
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || score !== null) return;

        // Show warning when 5 minutes remaining
        if (timeLeft === 300) {
            setShowTimeWarning(true);
            setTimeout(() => setShowTimeWarning(false), 5000);
        }

        timerIntervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerIntervalRef.current);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerIntervalRef.current);
    }, [timeLeft, score]);

    const handleAutoSubmit = async () => {
        alert("⏰ Time's up! Your exam will be submitted automatically.");
        await handleSubmit();
    };

    const handleOptionSelect = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));

        // Auto-scroll to next unanswered question after a brief delay
        setTimeout(() => {
            const nextUnanswered = questions.findIndex((q, idx) =>
                idx > currentQuestionIndex && !answers[q.id] && q.id !== questionId
            );
            if (nextUnanswered !== -1) {
                setCurrentQuestionIndex(nextUnanswered);
                questionRefs.current[nextUnanswered]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 300);
    };

    const handleSubmit = async () => {
        if (submitting || score !== null) return;

        // Check for unanswered questions
        const unansweredCount = Object.values(answers).filter(a => !a).length;
        if (unansweredCount > 0 && !window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`)) {
            return;
        }

        setSubmitting(true);

        try {
            const formattedAnswers = Object.entries(answers)
                .filter(([_, value]) => value !== null)
                .reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: value
                }), {});

            const response = await api.post('/results/submit', {
                examId: parseInt(id),
                answers: formattedAnswers
            });

            setScore(response.data.correctAnswers);
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Error submitting exam:", error);
            alert("❌ Failed to submit your exam. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
            setShowConfirmDialog(false);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const answered = Object.values(answers).filter(a => a !== null).length;
        return (answered / questions.length) * 100;
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <h2 style={styles.loadingText}>Loading your exam... 📚</h2>
            </div>
        );
    }

    const isPassing = score !== null && score >= (questions.length / 2);
    const percentage = score !== null ? Math.round((score / questions.length) * 100) : 0;
    const progress = getProgress();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {/* Sticky Header */}
                <div style={{
                    ...styles.header,
                    backgroundColor: score !== null ? '#fff' : (timeLeft < 60 ? '#fee2e2' : '#fff'),
                    borderBottom: timeLeft < 60 && score === null ? '2px solid #ef4444' : 'none'
                }}>
                    <div style={styles.headerLeft}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={styles.backButton}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dee2e6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                        >
                            ← Back to Dashboard
                        </button>
                        <div style={styles.examInfo}>
                            <h2 style={styles.examTitle}>{examDetails?.title || `Exam ID: ${id}`}</h2>
                            {examDetails?.subject && (
                                <span style={styles.subjectBadge}>{examDetails.subject}</span>
                            )}
                        </div>
                    </div>

                    {score === null && (
                        <div style={styles.timerSection}>
                            {/* Progress Bar */}
                            <div style={styles.progressContainer}>
                                <div style={styles.progressBar}>
                                    <div style={{
                                        ...styles.progressFill,
                                        width: `${progress}%`,
                                        backgroundColor: progress === 100 ? '#22c55e' : '#3b82f6'
                                    }} />
                                </div>
                                <span style={styles.progressText}>
                                    {Object.values(answers).filter(a => a !== null).length}/{questions.length} answered
                                </span>
                            </div>

                            <div style={{
                                ...styles.timer,
                                backgroundColor: timeLeft < 60 ? '#fee2e2' : '#e0f2fe',
                                color: timeLeft < 60 ? '#dc2626' : '#0369a1',
                                animation: timeLeft < 300 ? 'pulse 2s infinite' : 'none'
                            }}>
                                <span>⏳ {formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Time Warning Toast */}
                {showTimeWarning && score === null && (
                    <div style={styles.warningToast}>
                        ⚠️ 5 minutes remaining! Please submit your exam soon.
                    </div>
                )}

                {score !== null ? (
                    // Results View
                    <div style={styles.resultsView}>
                        {/* Score Card */}
                        <div style={{
                            ...styles.scoreCard,
                            borderTopColor: isPassing ? '#22c55e' : '#ef4444'
                        }}>
                            <div style={styles.scoreEmoji}>{isPassing ? '🏆' : '📚'}</div>
                            <h1 style={styles.scoreTitle}>
                                {isPassing ? 'Excellent Work!' : 'Keep Going!'}
                            </h1>
                            <div style={styles.scoreBadge}>
                                Score: {score} / {questions.length} ({percentage}%)
                            </div>

                            {/* Performance Message */}
                            <p style={styles.scoreMessage}>
                                {percentage >= 80 ? "Outstanding performance! You've mastered this subject." :
                                    percentage >= 60 ? "Good job! You're on the right track." :
                                        percentage >= 40 ? "You're making progress. Keep practicing!" :
                                            "Every expert was once a beginner. Review and try again!"}
                            </p>
                        </div>

                        <h3 style={styles.reviewTitle}>Detailed Question Review</h3>

                        <div style={styles.questionsList}>
                            {questions.map((q, index) => {
                                const studentAnswer = answers[q.id];
                                const isUnanswered = !studentAnswer;
                                const isCorrect = studentAnswer === q.correctOption;

                                return (
                                    <div
                                        key={q.id}
                                        style={styles.reviewCard}
                                        ref={el => questionRefs.current[index] = el}
                                    >
                                        <div style={styles.reviewHeader}>
                                            <span style={styles.questionNumber}>Question {index + 1}</span>
                                            {isUnanswered ? (
                                                <span style={styles.unansweredBadge}>Not Answered</span>
                                            ) : isCorrect ? (
                                                <span style={styles.correctBadge}>✓ Correct</span>
                                            ) : (
                                                <span style={styles.incorrectBadge}>✗ Incorrect</span>
                                            )}
                                        </div>

                                        <p style={styles.questionText}>{q.content}</p>

                                        <div style={styles.optionsGrid}>
                                            {['A', 'B', 'C', 'D'].map(opt => {
                                                const isCorrectOption = opt === q.correctOption;
                                                const isSelectedOption = opt === studentAnswer;

                                                let optionStyle = { ...styles.option };
                                                if (isCorrectOption) {
                                                    optionStyle = { ...optionStyle, ...styles.correctOption };
                                                } else if (isSelectedOption && !isCorrectOption) {
                                                    optionStyle = { ...optionStyle, ...styles.incorrectOption };
                                                }

                                                return (
                                                    <div key={opt} style={optionStyle}>
                                                        <div style={styles.optionContent}>
                                                            <span style={styles.optionLetter}>{opt}</span>
                                                            <span>{q[`option${opt}`]}</span>
                                                        </div>
                                                        {isCorrectOption && <span style={styles.checkIcon}>✓</span>}
                                                        {isSelectedOption && !isCorrectOption && <span style={styles.xIcon}>✗</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {isUnanswered && (
                                            <div style={styles.unansweredNote}>
                                                ⚠️ You didn't select an answer for this question.
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Return to Dashboard Button */}
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={styles.returnButton}
                        >
                            ← Return to Dashboard
                        </button>
                    </div>
                ) : (
                    // Exam Taking View
                    <div style={styles.examView}>
                        {/* Question Navigation */}
                        <div style={styles.navigationBar}>
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                style={{
                                    ...styles.navButton,
                                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                ← Previous
                            </button>

                            <div style={styles.questionIndicators}>
                                {questions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => jumpToQuestion(idx)}
                                        style={{
                                            ...styles.questionDot,
                                            backgroundColor: answers[q.id] ? '#3b82f6' : '#e2e8f0',
                                            border: currentQuestionIndex === idx ? '3px solid #1e40af' : 'none',
                                            transform: currentQuestionIndex === idx ? 'scale(1.2)' : 'scale(1)'
                                        }}
                                        title={`Question ${idx + 1}${answers[q.id] ? ' (Answered)' : ' (Unanswered)'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentQuestionIndex === questions.length - 1}
                                style={{
                                    ...styles.navButton,
                                    opacity: currentQuestionIndex === questions.length - 1 ? 0.5 : 1,
                                    cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Next →
                            </button>
                        </div>

                        {questions.length === 0 ? (
                            <div style={styles.noQuestions}>No questions available for this exam yet.</div>
                        ) : (
                            <div>
                                {questions.map((q, index) => (
                                    <div
                                        key={q.id}
                                        ref={el => questionRefs.current[index] = el}
                                        style={{
                                            ...styles.questionCard,
                                            display: currentQuestionIndex === index ? 'block' : 'none'
                                        }}
                                    >
                                        <div style={styles.questionHeader}>
                                            <span style={styles.currentQuestionNumber}>
                                                Question {index + 1} of {questions.length}
                                            </span>
                                            {answers[q.id] && (
                                                <span style={styles.answeredBadge}>✓ Answered</span>
                                            )}
                                        </div>

                                        <p style={styles.questionContent}>{q.content}</p>

                                        <div style={styles.optionsContainer}>
                                            {['A', 'B', 'C', 'D'].map(opt => {
                                                const isSelected = answers[q.id] === opt;
                                                return (
                                                    <label
                                                        key={opt}
                                                        style={{
                                                            ...styles.optionLabel,
                                                            borderColor: isSelected ? '#3b82f6' : '#e2e8f0',
                                                            backgroundColor: isSelected ? '#eff6ff' : '#fff',
                                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                                        }}
                                                        onMouseEnter={(e) => !isSelected && (e.currentTarget.style.borderColor = '#94a3b8')}
                                                        onMouseLeave={(e) => !isSelected && (e.currentTarget.style.borderColor = '#e2e8f0')}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${q.id}`}
                                                            value={opt}
                                                            checked={isSelected}
                                                            onChange={() => handleOptionSelect(q.id, opt)}
                                                            style={styles.radioInput}
                                                        />
                                                        <div style={styles.optionText}>
                                                            <span style={styles.optionPrefix}>{opt}.</span>
                                                            {q[`option${opt}`]}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Submit Button with Confirmation */}
                                <div style={styles.submitSection}>
                                    <button
                                        onClick={() => setShowConfirmDialog(true)}
                                        disabled={submitting}
                                        style={{
                                            ...styles.submitButton,
                                            opacity: submitting ? 0.7 : 1,
                                            cursor: submitting ? 'not-allowed' : 'pointer'
                                        }}
                                        onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                                        onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#2563eb')}
                                    >
                                        {submitting ? (
                                            <>
                                                <span style={styles.spinner}></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Exam 🚀'
                                        )}
                                    </button>

                                    <p style={styles.submitHint}>
                                        {Object.values(answers).filter(a => !a).length > 0 ?
                                            `⚠️ ${Object.values(answers).filter(a => !a).length} question(s) unanswered` :
                                            '✅ All questions answered'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Submit Exam?</h3>
                        <p style={styles.modalText}>
                            You have answered {Object.values(answers).filter(a => a !== null).length} out of {questions.length} questions.
                            {Object.values(answers).filter(a => a === null).length > 0 &&
                                ` ${Object.values(answers).filter(a => a === null).length} questions are unanswered.`}
                        </p>
                        <p style={styles.modalWarning}>This action cannot be undone.</p>
                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                style={styles.modalCancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={styles.modalConfirmButton}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Confirm Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    content: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        gap: '20px',
    },
    loadingSpinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: '#475569',
        fontSize: '1.2rem',
        fontWeight: '400',
    },
    header: {
        position: 'sticky',
        top: '20px',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginBottom: '30px',
        transition: 'all 0.3s ease',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
    },
    backButton: {
        padding: '10px 16px',
        backgroundColor: '#e9ecef',
        color: '#1e293b',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s',
    },
    examInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
    },
    examTitle: {
        margin: 0,
        color: '#0f172a',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    subjectBadge: {
        padding: '4px 12px',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '500',
    },
    timerSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    progressBar: {
        width: '150px',
        height: '8px',
        backgroundColor: '#e2e8f0',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        transition: 'width 0.3s ease',
    },
    progressText: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: '500',
    },
    timer: {
        padding: '8px 20px',
        borderRadius: '40px',
        fontWeight: '700',
        fontSize: '1.1rem',
        transition: 'all 0.3s',
    },
    warningToast: {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fef3c7',
        color: '#92400e',
        padding: '12px 24px',
        borderRadius: '50px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 100,
        animation: 'fadeIn 0.3s ease',
        fontWeight: '500',
    },
    // Results View Styles
    resultsView: {
        animation: 'fadeIn 0.5s ease',
    },
    scoreCard: {
        backgroundColor: '#fff',
        padding: '48px',
        borderRadius: '24px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        marginBottom: '40px',
        borderTop: '6px solid',
    },
    scoreEmoji: {
        fontSize: '64px',
        marginBottom: '16px',
    },
    scoreTitle: {
        margin: '0 0 16px 0',
        color: '#0f172a',
        fontSize: '2.5rem',
        fontWeight: '700',
    },
    scoreBadge: {
        display: 'inline-block',
        padding: '12px 40px',
        backgroundColor: '#f8fafc',
        borderRadius: '50px',
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '20px',
    },
    scoreMessage: {
        color: '#475569',
        fontSize: '1.1rem',
        maxWidth: '500px',
        margin: '0 auto',
        lineHeight: '1.6',
    },
    reviewTitle: {
        color: '#0f172a',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '24px',
        paddingLeft: '8px',
    },
    questionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        marginBottom: '40px',
    },
    reviewCard: {
        padding: '32px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    questionNumber: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    unansweredBadge: {
        padding: '4px 12px',
        backgroundColor: '#fffbeb',
        color: '#b45309',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    correctBadge: {
        padding: '4px 12px',
        backgroundColor: '#f0fdf4',
        color: '#15803d',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    incorrectBadge: {
        padding: '4px 12px',
        backgroundColor: '#fef2f2',
        color: '#b91c1c',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    questionText: {
        fontSize: '1.1rem',
        color: '#0f172a',
        marginBottom: '24px',
        lineHeight: '1.6',
        fontWeight: '500',
    },
    optionsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    option: {
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.2s',
    },
    correctOption: {
        backgroundColor: '#f0fdf4',
        borderColor: '#22c55e',
        color: '#15803d',
    },
    incorrectOption: {
        backgroundColor: '#fef2f2',
        borderColor: '#ef4444',
        color: '#b91c1c',
    },
    optionContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    optionLetter: {
        fontWeight: '700',
        width: '24px',
    },
    checkIcon: {
        fontSize: '1.2rem',
        color: '#15803d',
    },
    xIcon: {
        fontSize: '1.2rem',
        color: '#b91c1c',
    },
    unansweredNote: {
        marginTop: '16px',
        padding: '10px 16px',
        backgroundColor: '#fffbeb',
        color: '#b45309',
        borderRadius: '8px',
        fontSize: '0.875rem',
        display: 'inline-block',
    },
    returnButton: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#fff',
        color: '#0f172a',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '20px',
    },
    // Exam Taking View Styles
    examView: {
        animation: 'fadeIn 0.5s ease',
    },
    navigationBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    navButton: {
        padding: '10px 20px',
        backgroundColor: '#fff',
        color: '#0f172a',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    questionIndicators: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    questionDot: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    noQuestions: {
        backgroundColor: '#fff',
        padding: '48px',
        borderRadius: '16px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '1.1rem',
    },
    questionCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    currentQuestionNumber: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: '500',
    },
    answeredBadge: {
        padding: '4px 12px',
        backgroundColor: '#f0fdf4',
        color: '#15803d',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    questionContent: {
        fontSize: '1.25rem',
        color: '#0f172a',
        marginBottom: '32px',
        lineHeight: '1.6',
        fontWeight: '500',
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    optionLabel: {
        padding: '18px 24px',
        border: '2px solid',
        borderRadius: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.2s ease',
    },
    radioInput: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        accentColor: '#2563eb',
    },
    optionText: {
        fontSize: '1rem',
        lineHeight: '1.5',
        flex: 1,
    },
    optionPrefix: {
        fontWeight: '700',
        marginRight: '12px',
        color: 'inherit',
    },
    submitSection: {
        textAlign: 'center',
        marginTop: '32px',
    },
    submitButton: {
        padding: '18px 48px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontSize: '1.2rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
        transition: 'all 0.2s',
        minWidth: '250px',
    },
    submitHint: {
        marginTop: '12px',
        color: '#64748b',
        fontSize: '0.9rem',
    },
    spinner: {
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTopColor: '#fff',
        animation: 'spin 1s linear infinite',
        marginRight: '10px',
        verticalAlign: 'middle',
    },
    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '32px',
        borderRadius: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    modalTitle: {
        margin: '0 0 16px 0',
        color: '#0f172a',
        fontSize: '1.5rem',
        fontWeight: '700',
    },
    modalText: {
        color: '#475569',
        marginBottom: '16px',
        lineHeight: '1.6',
    },
    modalWarning: {
        color: '#b91c1c',
        fontSize: '0.875rem',
        marginBottom: '24px',
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
    },
    modalCancelButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#fff',
        color: '#475569',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    modalConfirmButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
};

export default TakeExam;