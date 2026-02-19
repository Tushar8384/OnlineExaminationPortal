import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Role-based security check
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams');
                setExams(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch exams", err);
                setError("Could not load exams. Are you sure your token is valid?");
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Inline styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            padding: '30px 20px'
        },
        content: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '16px 28px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        navLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        logo: {
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
        },
        badge: {
            padding: '4px 12px',
            backgroundColor: isAdmin ? '#fef3c7' : '#e0f2fe',
            color: isAdmin ? '#92400e' : '#0369a1',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            marginLeft: '8px'
        },
        navButtons: {
            display: 'flex',
            gap: '12px'
        },
        historyButton: {
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)'
        },
        logoutButton: {
            padding: '10px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
        },
        welcomeCard: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '24px 30px',
            marginBottom: '30px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        greeting: {
            fontSize: '18px',
            color: '#4b5563'
        },
        userName: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginTop: '4px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        statCard: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            border: '1px solid #f1f5f9',
            position: 'relative',
            overflow: 'hidden'
        },
        statIcon: {
            fontSize: '24px',
            marginBottom: '12px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        statValue: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#0f172a',
            margin: '8px 0 0 0',
            lineHeight: '1.2'
        },
        actionButton: {
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            width: '100%',
            marginTop: '8px',
            boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)'
        },
        examSection: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '16px'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        examCount: {
            backgroundColor: '#f1f5f9',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#475569'
        },
        examGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        examCard: {
            padding: '20px',
            border: '2px solid #f1f5f9',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
        },
        examInfo: {
            flex: 1,
            minWidth: '200px'
        },
        examTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 8px 0'
        },
        examId: {
            fontSize: '12px',
            color: '#64748b',
            backgroundColor: '#f1f5f9',
            padding: '4px 10px',
            borderRadius: '20px',
            display: 'inline-block'
        },
        examActions: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
        },
        takeButton: {
            padding: '10px 20px',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)'
        },
        manageButton: {
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
        },
        resultsButton: {
            padding: '10px 20px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.2)'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px'
        },
        spinner: {
            width: '48px',
            height: '48px',
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        errorCard: {
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            padding: '30px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '2px solid #fecaca'
        },
        emptyState: {
            textAlign: 'center',
            padding: '48px 20px',
            color: '#64748b',
            backgroundColor: '#fafafa',
            borderRadius: '12px'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p style={{ color: 'white', fontSize: '16px' }}>Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.errorCard}>
                        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⚠️</span>
                        <h3 style={{ margin: '0 0 8px 0' }}>Unable to Load Exams</h3>
                        <p style={{ margin: '0 0 20px 0' }}>{error}</p>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '12px 30px',
                                backgroundColor: '#b91c1c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Return to Login
                        </button>
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
                    .nav-button:hover {
                        transform: translateY(-2px);
                        filter: brightness(110%);
                    }
                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    }
                    .exam-card:hover {
                        border-color: #cbd5e1;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        transform: translateY(-2px);
                    }
                    .action-button:hover {
                        transform: translateY(-2px);
                        filter: brightness(110%);
                    }
                `}
            </style>

            <div style={styles.container}>
                <div style={styles.content}>
                    {/* Navigation Bar */}
                    <nav style={styles.nav}>
                        <div style={styles.navLeft}>
                            <h1 style={styles.logo}>ExamPortal</h1>
                            <span style={styles.badge}>
                                {isAdmin ? 'Administrator' : 'Student'}
                            </span>
                        </div>
                        <div style={styles.navButtons}>
                            {!isAdmin && (
                                <button
                                    onClick={() => navigate('/history')}
                                    style={styles.historyButton}
                                    className="nav-button"
                                >
                                    📜 My History
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                style={styles.logoutButton}
                                className="nav-button"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </nav>

                    {/* Welcome Card */}
                    <div style={styles.welcomeCard}>
                        <div>
                            <div style={styles.greeting}>{getGreeting()}</div>
                            <div style={styles.userName}>
                                {isAdmin ? 'Administrator' : 'Student'} Dashboard
                            </div>
                        </div>
                        <div style={{ fontSize: '32px' }}>
                            {isAdmin ? '👨‍🏫' : '🎓'}
                        </div>
                    </div>

                    {/* Statistics Widgets */}
                    <div style={styles.statsGrid}>
                        {/* Total Exams Widget */}
                        <div style={styles.statCard} className="stat-card">
                            <div style={styles.statIcon}>📚</div>
                            <div style={styles.statLabel}>Available Exams</div>
                            <h2 style={styles.statValue}>{exams.length}</h2>
                            <div style={{
                                height: '4px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '2px',
                                marginTop: '16px'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#3b82f6',
                                    borderRadius: '2px'
                                }}></div>
                            </div>
                        </div>

                        {/* Role-Specific Widget */}
                        {isAdmin ? (
                            <div style={styles.statCard} className="stat-card">
                                <div style={styles.statIcon}>⚡</div>
                                <div style={styles.statLabel}>Quick Actions</div>
                                <button
                                    onClick={() => navigate('/create-exam')}
                                    style={styles.actionButton}
                                    className="action-button"
                                >
                                    + Create New Exam
                                </button>
                            </div>
                        ) : (
                            <div style={styles.statCard} className="stat-card">
                                <div style={styles.statIcon}>📊</div>
                                <div style={styles.statLabel}>Your Status</div>
                                <h2 style={styles.statValue}>Active</h2>
                                <div style={{
                                    marginTop: '12px',
                                    padding: '6px 12px',
                                    backgroundColor: '#e0f2fe',
                                    color: '#0369a1',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'inline-block'
                                }}>
                                    Learner
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Exam Directory */}
                    <div style={styles.examSection}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>
                                <span>📋 Exam Directory</span>
                                <span style={styles.examCount}>
                                    {exams.length} {exams.length === 1 ? 'exam' : 'exams'}
                                </span>
                            </h3>
                        </div>

                        {exams.length === 0 ? (
                            <div style={styles.emptyState}>
                                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📭</span>
                                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>No Exams Available</h4>
                                <p style={{ margin: 0, color: '#6c757d' }}>
                                    {isAdmin
                                        ? 'Create your first exam to get started!'
                                        : 'Check back later for new exams.'}
                                </p>
                            </div>
                        ) : (
                            <div style={styles.examGrid}>
                                {exams.map((exam, index) => (
                                    <div
                                        key={index}
                                        style={styles.examCard}
                                        className="exam-card"
                                    >
                                        <div style={styles.examInfo}>
                                            <h4 style={styles.examTitle}>
                                                {exam.title || 'Untitled Exam'}
                                            </h4>
                                            <span style={styles.examId}>
                                                ID: {exam.id}
                                            </span>
                                        </div>

                                        {exam.id && (
                                            <div style={styles.examActions}>
                                                {!isAdmin && (
                                                    <button
                                                        onClick={() => navigate(`/take-exam/${exam.id}`)}
                                                        style={styles.takeButton}
                                                        className="action-button"
                                                    >
                                                        ✏️ Take Exam
                                                    </button>
                                                )}

                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/manage-exam/${exam.id}`)}
                                                            style={styles.manageButton}
                                                            className="action-button"
                                                        >
                                                            ⚙️ Manage
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/admin-results/${exam.id}`)}
                                                            style={styles.resultsButton}
                                                            className="action-button"
                                                        >
                                                            📊 Results
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    {exams.length > 0 && (
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            color: 'white',
                            fontSize: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            Showing {exams.length} available {exams.length === 1 ? 'exam' : 'exams'}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;