import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.error);
        }
      } else {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: 'demo@psychecompass.com',
      password: 'demo123'
    });
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="back-to-home">
            ← Back to Home
          </Link>
          
          <div className="auth-logo">
            <div className="brain-logo-small">🧠</div>
            <h1>Psyche Compass</h1>
          </div>
        </div>

        {/* Auth Form */}
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-form-header">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>
                {isLogin 
                  ? 'Sign in to continue your mental health journey' 
                  : 'Join PsycheCompass to start tracking your wellbeing'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="error-message">
                  <span>⚠️ {error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-full auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="loading-spinner"></span>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {isLogin && (
              <div className="demo-credentials">
                <p>Try the demo:</p>
                <button 
                  type="button" 
                  onClick={fillDemoCredentials}
                  className="btn btn-secondary btn-small"
                >
                  Fill Demo Credentials
                </button>
                <div className="demo-info">
                  <small>Email: demo@psychecompass.com | Password: demo123</small>
                </div>
              </div>
            )}

            <div className="auth-toggle">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="toggle-link"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="auth-features">
            <h3>What you'll get:</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track your daily mood and energy patterns</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👤</span>
                <span>Discover your personality with Big Five assessment</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🧠</span>
                <span>Evidence-based mental health screenings</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Complete privacy - your data stays local</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            <strong>Privacy First:</strong> Your personal data is stored locally on your device 
            and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;