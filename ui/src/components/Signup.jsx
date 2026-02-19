import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Check password strength when password field changes
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthText = () => {
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return texts[passwordStrength - 1] || 'Very Weak';
    };

    const getPasswordStrengthColor = () => {
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#15803d'];
        return colors[passwordStrength - 1] || '#ef4444';
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Passwords don't match!");
            return false;
        }
        if (formData.password.length < 6) {
            setMessage("❌ Password must be at least 6 characters long!");
            return false;
        }
        if (!formData.email.includes('@')) {
            setMessage("❌ Please enter a valid email address!");
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Remove confirmPassword before sending to backend
            const { confirmPassword, ...signupData } = formData;

            await api.post('/auth/register', signupData);
            setMessage("✅ Registration successful! Redirecting to login...");

            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error("Signup error:", error);
            setMessage("❌ Registration failed. Email might already exist.");
        } finally {
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
        signupCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '500px',
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
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
        },
        subtitle: {
            color: '#666',
            fontSize: '14px'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#555',
            marginLeft: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        inputWrapper: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        },
        input: {
            width: '100%',
            padding: '14px 16px',
            paddingRight: '45px',
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
        inputIcon: {
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
        nameRow: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
        },
        passwordStrength: {
            marginTop: '4px',
            height: '4px',
            backgroundColor: '#e1e1e1',
            borderRadius: '2px',
            overflow: 'hidden'
        },
        passwordStrengthBar: {
            height: '100%',
            transition: 'width 0.3s ease'
        },
        passwordStrengthText: {
            fontSize: '12px',
            marginTop: '4px',
            textAlign: 'right'
        },
        select: {
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e1e1e1',
            borderRadius: '12px',
            fontSize: '15px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.3s'
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
        message: {
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '10px',
            backgroundColor: message?.includes('✅') ? '#e0f2e1' : '#fee2e2',
            color: message?.includes('✅') ? '#2e7d32' : '#dc2626',
            border: `1px solid ${message?.includes('✅') ? '#b9f6ca' : '#fecaca'}`,
            animation: 'fadeIn 0.3s ease'
        },
        loginLink: {
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
                    
                    .input-hover:hover {
                        border-color: #999 !important;
                    }
                    
                    .button-hover:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                    }
                `}
            </style>

            <div style={styles.container}>
                <div style={styles.signupCard}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>
                            <span>Create Account</span>
                            <span>✨</span>
                        </h1>
                        <p style={styles.subtitle}>Join our learning community today</p>
                    </div>

                    {message && (
                        <div style={styles.message}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSignup} style={styles.form}>
                        {/* Name Row - First & Last Name */}
                        <div style={styles.nameRow}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name</label>
                                <div style={styles.inputWrapper}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('firstName')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        style={{
                                            ...styles.input,
                                            ...styles.inputWithIcon,
                                            ...(focusedField === 'firstName' ? styles.inputFocused : {})
                                        }}
                                        className="input-hover"
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name</label>
                                <div style={styles.inputWrapper}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('lastName')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        style={{
                                            ...styles.input,
                                            ...styles.inputWithIcon,
                                            ...(focusedField === 'lastName' ? styles.inputFocused : {})
                                        }}
                                        className="input-hover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>📧</span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={{
                                        ...styles.input,
                                        ...styles.inputWithIcon,
                                        ...(focusedField === 'email' ? styles.inputFocused : {})
                                    }}
                                    className="input-hover"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={{
                                        ...styles.input,
                                        ...styles.inputWithIcon,
                                        ...(focusedField === 'password' ? styles.inputFocused : {})
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

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <>
                                    <div style={styles.passwordStrength}>
                                        <div style={{
                                            ...styles.passwordStrengthBar,
                                            width: `${(passwordStrength / 5) * 100}%`,
                                            backgroundColor: getPasswordStrengthColor()
                                        }} />
                                    </div>
                                    <div style={{
                                        ...styles.passwordStrengthText,
                                        color: getPasswordStrengthColor()
                                    }}>
                                        Strength: {getPasswordStrengthText()}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>🔒</span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={{
                                        ...styles.input,
                                        ...styles.inputWithIcon,
                                        ...(focusedField === 'confirmPassword' ? styles.inputFocused : {}),
                                        borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : '#e1e1e1'
                                    }}
                                    className="input-hover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.passwordToggle}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>I am a</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('role')}
                                onBlur={() => setFocusedField(null)}
                                style={{
                                    ...styles.select,
                                    ...(focusedField === 'role' ? styles.inputFocused : {})
                                }}
                            >
                                <option value="STUDENT">🎓 Student</option>
                                <option value="ADMIN">👨‍🏫 Teacher/Admin</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            className="button-hover"
                        >
                            {loading ? (
                                <>
                                    <span style={styles.loader}></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account 🚀'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div style={styles.loginLink}>
                        <span>Already have an account?</span>
                        <Link
                            to="/"
                            style={styles.link}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                            Sign in here
                        </Link>
                    </div>

                    {/* Terms Notice */}
                    <p style={{
                        fontSize: '11px',
                        color: '#999',
                        textAlign: 'center',
                        marginTop: '15px'
                    }}>
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signup;