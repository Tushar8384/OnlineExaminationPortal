import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });

            console.log("Backend Login Response:", response.data);

            const actualToken = response.data.token || response.data.jwt || response.data.accessToken || (typeof response.data === 'string' ? response.data : null);

            if (!actualToken) {
                setMessage("Login failed: No valid token received from server.");
                setLoading(false);
                return;
            }

            localStorage.setItem('token', actualToken);
            setMessage("Login Successful! Redirecting...");

            if (response.data.role) {
                localStorage.setItem('role', response.data.role);
            }

            // Small delay to show success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            setMessage("Login failed. Check your credentials.");
            console.error("Login Error:", error);
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '20px'
        },
        loginCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '450px',
            padding: '40px',
            animation: 'slideUp 0.5s ease'
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
        },
        subtitle: {
            color: '#666',
            fontSize: '14px'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#555',
            marginLeft: '4px'
        },
        inputWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        input: {
            width: '100%',
            padding: '14px 16px',
            paddingRight: '50px',
            border: '2px solid #e1e1e1',
            borderRadius: '12px',
            fontSize: '15px',
            transition: 'all 0.3s',
            outline: 'none',
            boxSizing: 'border-box'
        },
        inputFocused: {
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
        },
        passwordToggle: {
            position: 'absolute',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#666',
            padding: '5px'
        },
        button: {
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            marginTop: '10px',
            position: 'relative',
            opacity: loading ? 0.8 : 1
        },
        buttonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
        },
        buttonDisabled: {
            opacity: 0.7,
            cursor: 'not-allowed'
        },
        message: {
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '10px',
            backgroundColor: message?.includes('failed') ? '#fee2e2' : '#e0f2e1',
            color: message?.includes('failed') ? '#dc2626' : '#2e7d32',
            border: `1px solid ${message?.includes('failed') ? '#fecaca' : '#b9f6ca'}`,
            animation: 'fadeIn 0.3s ease'
        },
        signupLink: {
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #e1e1e1',
            color: '#666',
            fontSize: '14px'
        },
        link: {
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600',
            marginLeft: '5px',
            cursor: 'pointer'
        },
        icon: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            fontSize: '16px'
        },
        inputWithIcon: {
            paddingLeft: '45px'
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
        }
    };

    // State for input focus
    const [focusedInput, setFocusedInput] = useState(null);

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
                    
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    }
                    
                    .shake {
                        animation: shake 0.5s ease;
                    }
                    
                    .input-hover:hover {
                        border-color: #999;
                    }
                    
                    .button-hover:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                    }
                `}
            </style>

            <div style={styles.container}>
                <div style={styles.loginCard}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Welcome Back! 👋</h1>
                        <p style={styles.subtitle}>Sign in to continue to Exam Portal</p>
                    </div>

                    <form onSubmit={handleLogin} style={styles.form}>
                        {/* Email Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.icon}>📧</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    placeholder="Enter your email"
                                    style={{
                                        ...styles.input,
                                        ...styles.inputWithIcon,
                                        ...(focusedInput === 'email' ? styles.inputFocused : {}),
                                        borderColor: message?.includes('failed') && !email ? '#ef4444' : '#e1e1e1'
                                    }}
                                    className="input-hover"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.icon}>🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    required
                                    placeholder="Enter your password"
                                    style={{
                                        ...styles.input,
                                        ...styles.inputWithIcon,
                                        ...(focusedInput === 'password' ? styles.inputFocused : {}),
                                        borderColor: message?.includes('failed') && !password ? '#ef4444' : '#e1e1e1'
                                    }}
                                    className="input-hover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.passwordToggle}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                            <a
                                href="#"
                                style={{ ...styles.link, fontSize: '13px' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Please contact your administrator to reset your password.');
                                }}
                            >
                                Forgot Password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {}),
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            className="button-hover"
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.loader}></span>
                                    Logging in...
                                </>
                            ) : (
                                'Sign In 🚀'
                            )}
                        </button>

                        {/* Message Display */}
                        {message && (
                            <div
                                style={styles.message}
                                className={message.includes('failed') ? 'shake' : ''}
                            >
                                {message}
                            </div>
                        )}

                        {/* Sign Up Link */}
                        <div style={styles.signupLink}>
                            <span>Don't have an account?</span>
                            <a
                                href="/signup"
                                style={styles.link}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                                Sign up here
                            </a>
                        </div>
                    </form>

                    {/* Demo Credentials (Optional - remove in production) */}
                    <div style={{
                        marginTop: '20px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>Demo Credentials:</p>
                        <p style={{ margin: '2px 0' }}>Email: student@example.com</p>
                        <p style={{ margin: '2px 0' }}>Password: password123</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;