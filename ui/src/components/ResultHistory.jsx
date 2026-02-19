import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResultHistory() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/results/history');
                setResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Could not load your history. Please try logging in again.");
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* 🏷️ TOP HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#e9ecef', color: '#495057', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
                            ← Back to Dashboard
                        </button>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '20px' }}>🎓 My Exam History</h2>
                    </div>
                </div>

                {loading && <div style={{ textAlign: 'center', color: '#64748b', fontSize: '18px', marginTop: '50px' }}>Loading your scores... ⏳</div>}
                {error && <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

                {!loading && !error && results.length === 0 && (
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748b', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
                        <h3>No exams taken yet!</h3>
                        <p>Head back to the dashboard to take your first exam.</p>
                    </div>
                )}

                {/* 🏆 PREMIUM SCORE CARDS */}
                {!loading && !error && results.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {results.map((result, index) => {
                            const isPassing = result.scorePercentage >= 50;

                            return (
                                <div key={index} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', borderTop: `6px solid ${isPassing ? '#22c55e' : '#ef4444'}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', lineHeight: '1.3' }}>{result.examTitle}</h3>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: isPassing ? '#dcfce7' : '#fee2e2', color: isPassing ? '#166534' : '#991b1b' }}>
                                            {isPassing ? 'PASSED' : 'FAILED'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Score</p>
                                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#334155' }}>{result.correctAnswers} <span style={{ fontSize: '14px', color: '#94a3b8' }}>/ {result.totalQuestions}</span></p>
                                        </div>
                                        <div style={{ height: '30px', width: '1px', backgroundColor: '#cbd5e1' }}></div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Percentage</p>
                                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: isPassing ? '#15803d' : '#b91c1c' }}>{Math.round(result.scorePercentage)}%</p>
                                        </div>
                                    </div>

                                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
                                        {result.message}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultHistory;