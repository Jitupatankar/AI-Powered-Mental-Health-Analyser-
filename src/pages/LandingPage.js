import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Top Navigation */}
        {isAuthenticated ? (
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
            <UserMenu />
          </div>
        ) : (
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
            <Link to="/login" className="btn btn-secondary" style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: 'white', 
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              Sign In
            </Link>
          </div>
        )}
        {/* Main Hero Section */}
        <div className="hero-section">
          <div className="brain-logo">
            🧠
          </div>
          
          <h1 className="main-title">Psyche Compass</h1>
          
          <p className="hero-description">
            Your AI-powered companion for mental health analysis and personality mapping. Discover 
            insights about yourself with evidence-based psychological assessments and personalized 
            recommendations for wellbeing.
          </p>
          
          <div className="cta-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/personality" className="btn btn-primary btn-large cta-primary">
                  Start Assessment →
                </Link>
                <Link to="/dashboard" className="btn btn-secondary btn-large cta-secondary">
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-large cta-primary">
                  Get Started →
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large cta-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="features-section">
          <h2 className="features-title">Comprehensive Mental Health Tools</h2>
          <p className="features-description">
            Explore different aspects of your psychological wellbeing with our suite of scientifically-validated assessments and tracking tools.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Mood Tracking</h3>
              <p>Monitor your daily emotional patterns and energy levels with interactive mood logging and insights.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Personality Assessment</h3>
              <p>Discover your Big Five personality traits through scientifically-validated psychological testing.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Mental Health Screening</h3>
              <p>Evidence-based screening tools for depression, anxiety, and stress with professional recommendations.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Personalized Insights</h3>
              <p>AI-powered analysis provides tailored recommendations and coping strategies for your wellbeing.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your data stays completely private on your device - no external sharing or cloud storage.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Intuitive interface designed for accessibility and ease of use across all devices.</p>
            </div>
          </div>
        </div>
        
        {/* Call to Action Footer */}
        <div className="cta-footer">
          <h3>Ready to begin your mental health journey?</h3>
          <p>Take the first step towards better self-awareness and wellbeing.</p>
          <Link to="/personality" className="btn btn-primary btn-large">
            Start Your Assessment →
          </Link>
        </div>
        
        {/* Disclaimer */}
        <div className="disclaimer">
          <p>
            <strong>Important:</strong> This tool is for educational and self-awareness purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            If you're experiencing mental health concerns, please consult with a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;