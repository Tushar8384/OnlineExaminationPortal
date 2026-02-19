import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ManageExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [examDetails, setExamDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCorrectOption, setFilterCorrectOption] = useState('');

    const [formData, setFormData] = useState({
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A'
    });

    // Fetch exam details and questions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examRes, questionsRes] = await Promise.all([
                    api.get(`/exams/${id}`),
                    api.get(`/questions/exam/${id}`)
                ]);

                setExamDetails(examRes.data);
                setQuestions(questionsRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage("❌ Failed to load exam data.");
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            content: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctOption: 'A'
        });
        setEditingQuestion(null);
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validate that all options are filled
        if (!formData.content || !formData.optionA || !formData.optionB || !formData.optionC || !formData.optionD) {
            setMessage("❌ Please fill in all fields.");
            return;
        }

        try {
            if (editingQuestion) {
                // Update existing question
                await api.put(`/questions/${editingQuestion.id}`, {
                    ...formData,
                    examId: id
                });
                setMessage("✅ Question updated successfully!");
            } else {
                // Add new question
                await api.post('/questions', {
                    examId: id,
                    ...formData
                });
                setMessage("✅ Question added successfully!");
            }

            resetForm();

            // Refresh questions list
            const response = await api.get(`/questions/exam/${id}`);
            setQuestions(response.data);

        } catch (error) {
            console.error("Error saving question:", error);
            setMessage("❌ Failed to save question. (Are you logged in as ADMIN?)");
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setFormData({
            content: question.content,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctOption: question.correctOption
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!questionToDelete) return;

        try {
            await api.delete(`/questions/${questionToDelete.id}`);
            setMessage("✅ Question deleted successfully!");
            setQuestions(questions.filter(q => q.id !== questionToDelete.id));
            setShowDeleteModal(false);
            setQuestionToDelete(null);
        } catch (error) {
            console.error("Error deleting question:", error);
            setMessage("❌ Failed to delete question.");
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.optionA.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.optionB.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterCorrectOption ? q.correctOption === filterCorrectOption : true;

        return matchesSearch && matchesFilter;
    });

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '40px 20px'
        },
        content: {
            maxWidth: '1000px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '20px 30px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
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
        headerTitle: {
            margin: 0,
            color: '#0f172a',
            fontSize: '20px',
            fontWeight: '600'
        },
        examBadge: {
            padding: '6px 12px',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
        },
        formCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            marginBottom: '30px',
            animation: 'slideDown 0.3s ease'
        },
        formTitle: {
            margin: '0 0 20px 0',
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#475569'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            transition: 'all 0.2s',
            outline: 'none',
            boxSizing: 'border-box'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            transition: 'all 0.2s',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none'
        },
        buttonGroup: {
            display: 'flex',
            gap: '15px',
            marginTop: '10px'
        },
        submitButton: {
            flex: 1,
            padding: '14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        cancelButton: {
            padding: '14px 30px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        statsCard: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
        },
        statItem: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '5px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#64748b'
        },
        searchBar: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px',
            flexWrap: 'wrap'
        },
        searchInput: {
            flex: 1,
            padding: '12px 20px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '250px'
        },
        filterSelect: {
            padding: '12px 20px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            minWidth: '150px'
        },
        questionList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        questionCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            transition: 'transform 0.2s'
        },
        questionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '15px'
        },
        questionContent: {
            fontSize: '16px',
            color: '#0f172a',
            fontWeight: '500',
            marginRight: '20px',
            lineHeight: '1.6'
        },
        actionButtons: {
            display: 'flex',
            gap: '8px'
        },
        editButton: {
            padding: '8px 16px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s'
        },
        deleteButton: {
            padding: '8px 16px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s'
        },
        optionsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginTop: '15px'
        },
        optionItem: {
            padding: '12px',
            borderRadius: '10px',
            border: '2px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        correctOption: {
            backgroundColor: '#f0fdf4',
            borderColor: '#22c55e',
            color: '#15803d'
        },
        optionLetter: {
            fontWeight: '700',
            minWidth: '24px'
        },
        message: {
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            marginBottom: '20px',
            backgroundColor: message?.includes('✅') ? '#f0fdf4' : '#fef2f2',
            color: message?.includes('✅') ? '#15803d' : '#b91c1c',
            border: `1px solid ${message?.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
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
            backdropFilter: 'blur(4px)'
        },
        modal: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        },
        modalTitle: {
            margin: '0 0 15px 0',
            color: '#0f172a',
            fontSize: '20px',
            fontWeight: '700'
        },
        modalButtons: {
            display: 'flex',
            gap: '12px',
            marginTop: '25px'
        },
        modalCancelButton: {
            flex: 1,
            padding: '12px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
        },
        modalDeleteButton: {
            flex: 1,
            padding: '12px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
        },
        emptyState: {
            backgroundColor: 'white',
            padding: '60px',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#64748b'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid #e2e8f0',
                            borderTop: '4px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }}></div>
                        <p style={{ color: '#64748b' }}>Loading questions...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .input-hover:hover {
                        border-color: #94a3b8 !important;
                    }
                    .input-hover:focus {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                    }
                    .question-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    }
                    .edit-button:hover {
                        background-color: #e2e8f0 !important;
                    }
                    .delete-button:hover {
                        background-color: #fee2e2 !important;
                    }
                `}
            </style>

            <div style={styles.container}>
                <div style={styles.content}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={styles.backButton}
                                className="back-button"
                            >
                                ← Back to Dashboard
                            </button>
                            <div>
                                <h1 style={styles.headerTitle}>Manage Exam Questions</h1>
                                {examDetails && (
                                    <span style={styles.examBadge}>{examDetails.title}</span>
                                )}
                            </div>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>
                            Exam ID: {id}
                        </span>
                    </div>

                    {/* Stats */}
                    <div style={styles.statsCard}>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{questions.length}</div>
                            <div style={styles.statLabel}>Total Questions</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>
                                {questions.filter(q => q.correctOption === 'A').length}
                            </div>
                            <div style={styles.statLabel}>Correct Answer: A</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>
                                {questions.filter(q => q.correctOption === 'B' || q.correctOption === 'C' || q.correctOption === 'D').length}
                            </div>
                            <div style={styles.statLabel}>Other Options</div>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div style={styles.message}>
                            <span>{message.includes('✅') ? '✨' : '⚠️'}</span>
                            {message}
                        </div>
                    )}

                    {/* Add/Edit Question Form */}
                    <div style={styles.formCard}>
                        <div style={styles.formTitle}>
                            <span>{editingQuestion ? '✏️ Edit Question' : '➕ Add New Question'}</span>
                            {editingQuestion && (
                                <button
                                    onClick={resetForm}
                                    style={{
                                        ...styles.cancelButton,
                                        padding: '6px 12px',
                                        fontSize: '12px'
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleAddQuestion}>
                            {/* Question Content - Full Width */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Question Text</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Enter your question here..."
                                    required
                                    style={styles.textarea}
                                    className="input-hover"
                                />
                            </div>

                            {/* Options Grid */}
                            <div style={styles.formGrid}>
                                {['A', 'B', 'C', 'D'].map(letter => (
                                    <div key={letter} style={styles.formGroup}>
                                        <label style={styles.label}>Option {letter}</label>
                                        <input
                                            type="text"
                                            name={`option${letter}`}
                                            value={formData[`option${letter}`]}
                                            onChange={handleChange}
                                            placeholder={`Enter option ${letter}`}
                                            required
                                            style={styles.input}
                                            className="input-hover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Correct Option Selection */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Correct Answer</label>
                                <select
                                    name="correctOption"
                                    value={formData.correctOption}
                                    onChange={handleChange}
                                    style={styles.select}
                                >
                                    <option value="A">Option A</option>
                                    <option value="B">Option B</option>
                                    <option value="C">Option C</option>
                                    <option value="D">Option D</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div style={styles.buttonGroup}>
                                <button
                                    type="submit"
                                    style={styles.submitButton}
                                    className="submit-button"
                                >
                                    {editingQuestion ? 'Update Question' : 'Add Question'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Search and Filter */}
                    <div style={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="🔍 Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                            className="input-hover"
                        />
                        <select
                            value={filterCorrectOption}
                            onChange={(e) => setFilterCorrectOption(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">All Options</option>
                            <option value="A">Correct: A</option>
                            <option value="B">Correct: B</option>
                            <option value="C">Correct: C</option>
                            <option value="D">Correct: D</option>
                        </select>
                    </div>

                    {/* Questions List */}
                    {filteredQuestions.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>📭</span>
                            <h3 style={{ color: '#0f172a', marginBottom: '10px' }}>No Questions Found</h3>
                            <p style={{ color: '#64748b' }}>
                                {searchTerm || filterCorrectOption ?
                                    'Try adjusting your search filters.' :
                                    'Start by adding your first question above.'}
                            </p>
                        </div>
                    ) : (
                        <div style={styles.questionList}>
                            {filteredQuestions.map((q, index) => (
                                <div
                                    key={q.id}
                                    style={styles.questionCard}
                                    className="question-card"
                                >
                                    <div style={styles.questionHeader}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{
                                                width: '30px',
                                                height: '30px',
                                                backgroundColor: '#f1f5f9',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '600',
                                                color: '#475569'
                                            }}>
                                                {index + 1}
                                            </span>
                                            <span style={styles.questionContent}>
                                                {q.content}
                                            </span>
                                        </div>
                                        <div style={styles.actionButtons}>
                                            <button
                                                onClick={() => handleEdit(q)}
                                                style={styles.editButton}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setQuestionToDelete(q);
                                                    setShowDeleteModal(true);
                                                }}
                                                style={styles.deleteButton}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div style={styles.optionsGrid}>
                                        {['A', 'B', 'C', 'D'].map(letter => (
                                            <div
                                                key={letter}
                                                style={{
                                                    ...styles.optionItem,
                                                    ...(q.correctOption === letter ? styles.correctOption : {})
                                                }}
                                            >
                                                <span style={styles.optionLetter}>{letter}.</span>
                                                <span>{q[`option${letter}`]}</span>
                                                {q.correctOption === letter && (
                                                    <span style={{ marginLeft: 'auto', color: '#15803d' }}>✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                        <div style={styles.modalOverlay}>
                            <div style={styles.modal}>
                                <h3 style={styles.modalTitle}>Delete Question</h3>
                                <p style={{ color: '#475569', marginBottom: '10px' }}>
                                    Are you sure you want to delete this question?
                                </p>
                                <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                                    "{questionToDelete?.content.substring(0, 100)}..."
                                </p>
                                <div style={styles.modalButtons}>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setQuestionToDelete(null);
                                        }}
                                        style={styles.modalCancelButton}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={styles.modalDeleteButton}
                                    >
                                        Delete Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ManageExam;