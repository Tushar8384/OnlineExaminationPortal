import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminResults() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`/results/exam/${id}`);
                setResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch exam results:", err);
                setError("Could not load the results. Are you logged in as an Admin?");
                setLoading(false);
            }
        };
        fetchResults();
    }, [id]);

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* 🏷️ TOP HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#e9ecef', color: '#495057', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ← Back to Dashboard
                        </button>
                        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '20px' }}>📊 Master Results Portal</h2>
                    </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>

                    {loading && <p style={{ textAlign: 'center', color: '#64748b' }}>Loading student scores... ⏳</p>}
                    {error && <p style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '15px', borderRadius: '8px' }}>{error}</p>}

                    {!loading && !error && results.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                            <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No students have taken this exam yet.</p>
                            <p style={{ fontSize: '14px' }}>Once a student submits their test, their score will appear here instantly.</p>
                        </div>
                    )}

                    {!loading && !error && results.length > 0 && (
                        <div>
                            <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f1f5f9' }}>
                                <h3 style={{ margin: 0, color: '#1e293b' }}>Exam: <span style={{ color: '#2563eb' }}>{results[0].examTitle}</span></h3>
                                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Total Submissions: {results.length}</p>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e2e8f0', borderTopLeftRadius: '8px' }}>Student Name</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e2e8f0' }}>Email Address</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e2e8f0' }}>Raw Score</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e2e8f0', borderTopRightRadius: '8px' }}>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {results.map((result, index) => {
                                        const isPassing = result.scorePercentage >= 50;

                                        return (
                                            <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '15px', color: '#1e293b', fontWeight: 'bold' }}>{result.studentName}</td>
                                                <td style={{ padding: '15px', color: '#64748b' }}>{result.studentEmail}</td>
                                                <td style={{ padding: '15px', color: '#334155', fontWeight: '500' }}>
                                                    {result.correctAnswers} <span style={{ color: '#94a3b8', fontSize: '12px' }}>/ {result.totalQuestions}</span>
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                        <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: isPassing ? '#dcfce7' : '#fee2e2', color: isPassing ? '#166534' : '#991b1b' }}>
                                                            {Math.round(result.scorePercentage)}% - {isPassing ? 'PASS' : 'FAIL'}
                                                        </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminResults;