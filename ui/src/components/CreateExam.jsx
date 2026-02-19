import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateExam() {
    const navigate = useNavigate();

    const [examData, setExamData] = useState({
        title: '',
        description: '',
        maxMarks: '',
        durationMinutes: '',
        difficulty: 'MEDIUM',
        category: '',
        instructions: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(1);

    const categories = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer Science',
        'English',
        'History',
        'Geography',
        'General Knowledge',
        'Other'
    ];

    const difficulties = [
        { value: 'EASY', label: 'Easy', color: '#22c55e' },
        { value: 'MEDIUM', label: 'Medium', color: '#eab308' },
        { value: 'HARD', label: 'Hard', color: '#ef4444' },
        { value: 'EXPERT', label: 'Expert', color: '#9333ea' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamData({ ...examData, [name]: value });

        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!examData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (examData.title.length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!examData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (examData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!examData.maxMarks) {
            newErrors.maxMarks = 'Maximum marks is required';
        } else if (examData.maxMarks < 1) {
            newErrors.maxMarks = 'Maximum marks must be at least 1';
        } else if (examData.maxMarks > 1000) {
            newErrors.maxMarks = 'Maximum marks cannot exceed 1000';
        }

        if (!examData.durationMinutes) {
            newErrors.durationMinutes = 'Duration is required';
        } else if (examData.durationMinutes < 5) {
            newErrors.durationMinutes = 'Duration must be at least 5 minutes';
        } else if (examData.durationMinutes > 480) {
            newErrors.durationMinutes = 'Duration cannot exceed 8 hours';
        }

        if (!examData.category) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage("❌ Please fix the errors before submitting");
            return;
        }

        setMessage('');
        setLoading(true);

        try {
            await api.post('/exams', {
                title: examData.title,
                description: examData.description,
                maxMarks: parseInt(examData.maxMarks),
                durationMinutes: parseInt(examData.durationMinutes),
                difficulty: examData.difficulty,
                category: examData.category,
                instructions: examData.instructions || 'Read each question carefully. No negative marking.'
            });

            setMessage("✅ Exam created successfully! Redirecting...");

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Error creating exam:", error);
            if (error.response && error.response.status === 403) {
                setMessage("❌ Access Denied: You must be an ADMIN to create an exam.");
            } else {
                setMessage("❌ Failed to create exam. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '40px 20px'
        },
        content: {
            maxWidth: '700px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
            backgroundColor: 'white',
            padding: '20px 30px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        backButton: {
            padding: '10px 20px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        title: {
            margin: 0,
            color: '#0f172a',
            fontSize: '24px',
            fontWeight: '700'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '40px',
            animation: 'slideUp 0.5s ease'
        },
        steps: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '40px',
            position: 'relative'
        },
        stepLine: {
            position: 'absolute',
            top: '15px',
            left: '0',
            right: '0',
            height: '2px',
            backgroundColor: '#e2e8f0',
            zIndex: 1
        },
        stepLineFill: {
            position: 'absolute',
            top: '15px',
            left: '0',
            height: '2px',
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease',
            zIndex: 2
        },
        stepItem: {
            position: 'relative',
            zIndex: 3,
            backgroundColor: 'white',
            padding: '0 10px',
            textAlign: 'center'
        },
        stepCircle: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
            fontWeight: '600',
            transition: 'all 0.3s'
        },
        stepLabel: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b'
        },
        formGroup: {
            marginBottom: '24px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#475569'
        },
        required: {
            color: '#ef4444',
            marginLeft: '4px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '15px',
            transition: 'all 0.2s',
            outline: 'none',
            boxSizing: 'border-box'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '15px',
            transition: 'all 0.2s',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit'
        },
        inputError: {
            borderColor: '#ef4444',
            backgroundColor: '#fef2f2'
        },
        errorMessage: {
            marginTop: '6px',
            fontSize: '13px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '15px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s'
        },
        difficultyBadge: {
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
        },
        buttonGroup: {
            display: 'flex',
            gap: '15px',
            marginTop: '30px'
        },
        nextButton: {
            flex: 1,
            padding: '14px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        prevButton: {
            flex: 1,
            padding: '14px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        submitButton: {
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
        },
        message: {
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            marginTop: '20px',
            backgroundColor: message?.includes('✅') ? '#f0fdf4' : '#fef2f2',
            color: message?.includes('✅') ? '#15803d' : '#b91c1c',
            border: `1px solid ${message?.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        loader: {
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            borderTopColor: '#fff',
            animation: 'spin 1s linear infinite',
            marginRight: '10px',
            verticalAlign: 'middle'
        },
        helperText: {
            fontSize: '13px',
            color: '#64748b',
            marginTop: '4px'
        }
    };

    const renderStep1 = () => (
        <>
            <div style={styles.formGroup}>
                <label style={styles.label}>
                    Exam Title <span style={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={examData.title}
                    onChange={handleChange}
                    placeholder="e.g., Mid-Term Mathematics Examination"
                    style={{
                        ...styles.input,
                        ...(errors.title ? styles.inputError : {})
                    }}
                    className="input-hover"
                />
                {errors.title && (
                    <div style={styles.errorMessage}>
                        <span>⚠️</span> {errors.title}
                    </div>
                )}
                <div style={styles.helperText}>
                    Give your exam a clear, descriptive title
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>
                    Description <span style={styles.required}>*</span>
                </label>
                <textarea
                    name="description"
                    value={examData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of what this exam covers..."
                    style={{
                        ...styles.textarea,
                        ...(errors.description ? styles.inputError : {})
                    }}
                    className="input-hover"
                />
                {errors.description && (
                    <div style={styles.errorMessage}>
                        <span>⚠️</span> {errors.description}
                    </div>
                )}
            </div>

            <div style={styles.row}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Category <span style={styles.required}>*</span>
                    </label>
                    <select
                        name="category"
                        value={examData.category}
                        onChange={handleChange}
                        style={{
                            ...styles.select,
                            ...(errors.category ? styles.inputError : {})
                        }}
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && (
                        <div style={styles.errorMessage}>
                            <span>⚠️</span> {errors.category}
                        </div>
                    )}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Difficulty Level</label>
                    <select
                        name="difficulty"
                        value={examData.difficulty}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        {difficulties.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <div style={styles.row}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Maximum Marks <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="number"
                        name="maxMarks"
                        value={examData.maxMarks}
                        onChange={handleChange}
                        placeholder="e.g., 100"
                        min="1"
                        max="1000"
                        style={{
                            ...styles.input,
                            ...(errors.maxMarks ? styles.inputError : {})
                        }}
                        className="input-hover"
                    />
                    {errors.maxMarks && (
                        <div style={styles.errorMessage}>
                            <span>⚠️</span> {errors.maxMarks}
                        </div>
                    )}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Duration (Minutes) <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="number"
                        name="durationMinutes"
                        value={examData.durationMinutes}
                        onChange={handleChange}
                        placeholder="e.g., 60"
                        min="5"
                        max="480"
                        style={{
                            ...styles.input,
                            ...(errors.durationMinutes ? styles.inputError : {})
                        }}
                        className="input-hover"
                    />
                    {errors.durationMinutes && (
                        <div style={styles.errorMessage}>
                            <span>⚠️</span> {errors.durationMinutes}
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Instructions (Optional)</label>
                <textarea
                    name="instructions"
                    value={examData.instructions}
                    onChange={handleChange}
                    placeholder="Add any special instructions for students..."
                    style={styles.textarea}
                    className="input-hover"
                />
                <div style={styles.helperText}>
                    Default instructions will be used if none provided
                </div>
            </div>

            <div style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                marginTop: '20px'
            }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>📋 Summary</h4>
                <div style={{ fontSize: '14px', color: '#475569' }}>
                    <p><strong>Title:</strong> {examData.title || 'Not set'}</p>
                    <p><strong>Category:</strong> {examData.category || 'Not set'}</p>
                    <p><strong>Difficulty:</strong> {examData.difficulty}</p>
                    <p><strong>Max Marks:</strong> {examData.maxMarks || 'Not set'}</p>
                    <p><strong>Duration:</strong> {examData.durationMinutes ? `${examData.durationMinutes} minutes` : 'Not set'}</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>
                {`
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .input-hover:hover {
                        border-color: #94a3b8 !important;
                    }
                    
                    .input-hover:focus {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                    }
                    
                    .back-button:hover {
                        background-color: #e2e8f0 !important;
                    }
                    
                    .next-button:hover {
                        background-color: #2563eb !important;
                    }
                    
                    .prev-button:hover {
                        background-color: #e2e8f0 !important;
                    }
                    
                    .submit-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
                    }
                `}
            </style>

            <div style={styles.container}>
                <div style={styles.content}>
                    {/* Header */}
                    <div style={styles.header}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={styles.backButton}
                            className="back-button"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 style={styles.title}>Create New Exam ✨</h1>
                    </div>

                    {/* Main Form Card */}
                    <div style={styles.card}>
                        {/* Step Indicator */}
                        <div style={styles.steps}>
                            <div style={styles.stepLine}></div>
                            <div style={{
                                ...styles.stepLineFill,
                                width: activeStep === 1 ? '50%' : '100%'
                            }}></div>

                            <div style={styles.stepItem}>
                                <div style={{
                                    ...styles.stepCircle,
                                    backgroundColor: activeStep >= 1 ? '#3b82f6' : '#e2e8f0',
                                    color: activeStep >= 1 ? 'white' : '#64748b'
                                }}>1</div>
                                <div style={styles.stepLabel}>Basic Info</div>
                            </div>

                            <div style={styles.stepItem}>
                                <div style={{
                                    ...styles.stepCircle,
                                    backgroundColor: activeStep >= 2 ? '#3b82f6' : '#e2e8f0',
                                    color: activeStep >= 2 ? 'white' : '#64748b'
                                }}>2</div>
                                <div style={styles.stepLabel}>Settings</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {activeStep === 1 ? renderStep1() : renderStep2()}

                            {/* Navigation Buttons */}
                            <div style={styles.buttonGroup}>
                                {activeStep === 2 && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(1)}
                                        style={styles.prevButton}
                                        className="prev-button"
                                    >
                                        ← Previous
                                    </button>
                                )}

                                {activeStep === 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(2)}
                                        style={styles.nextButton}
                                        className="next-button"
                                    >
                                        Next Step →
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            ...styles.submitButton,
                                            opacity: loading ? 0.8 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                        className="submit-button"
                                    >
                                        {loading ? (
                                            <>
                                                <span style={styles.loader}></span>
                                                Creating Exam...
                                            </>
                                        ) : (
                                            'Create Exam 🚀'
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Message Display */}
                        {message && (
                            <div style={styles.message}>
                                <span>{message.includes('✅') ? '✨' : '⚠️'}</span>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Help Tip */}
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '12px',
                        border: '1px solid #bae6fd',
                        color: '#0369a1',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>💡</span>
                        <span>
                            <strong>Pro Tip:</strong> After creating the exam, you'll be able to add questions to it from the exam management page.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateExam;