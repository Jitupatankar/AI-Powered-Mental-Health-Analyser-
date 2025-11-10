import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DepressionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, interpretation, suicidalThoughts, responses } = location.state || {};

  // If no data, redirect back
  if (!score && score !== 0) {
    navigate('/screening/depression');
    return null;
  }

  const getProgressBarColor = () => {
    if (score <= 4) return '#10b981';
    if (score <= 9) return '#f59e0b';
    if (score <= 14) return '#ef4444';
    if (score <= 19) return '#dc2626';
    return '#991b1b';
  };

  const progressPercentage = (score / 27) * 100;

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title">Depression Screening Results</h1>
          <p className="page-subtitle">PHQ-9 Style Assessment</p>
        </div>

        {/* Main Results Card */}
        <div className="card" style={{ padding: '40px', marginBottom: '24px', textAlign: 'center' }}>
          {/* Score Display */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              border: `8px solid ${getProgressBarColor()}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              background: '#f9fafb'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: getProgressBarColor() }}>
                {score}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>out of 27</div>
            </div>

            {/* Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: '#e5e7eb', 
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: getProgressBarColor(),
                transition: 'width 0.5s ease'
              }}></div>
            </div>

            {/* Severity Level */}
            <h2 style={{ 
              color: getProgressBarColor(), 
              fontSize: '32px', 
              margin: '16px 0 8px',
              fontWeight: 'bold'
            }}>
              {interpretation.level}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Severity Level</p>
          </div>

          {/* Interpretation */}
          <div style={{ 
            background: '#f9fafb', 
            padding: '24px', 
            borderRadius: '12px',
            border: `2px solid ${getProgressBarColor()}20`,
            marginBottom: '24px'
          }}>
            <h3 style={{ color: '#1f2937', marginBottom: '12px', fontSize: '20px' }}>
              What This Means
            </h3>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '16px', 
              lineHeight: '1.6',
              margin: 0 
            }}>
              {interpretation.recommendation}
            </p>
          </div>

          {/* Score Ranges Reference */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: score <= 4 ? '#10b98120' : '#f9fafb',
              border: `2px solid ${score <= 4 ? '#10b981' : '#e5e7eb'}`
            }}>
              <div style={{ fontWeight: 'bold', color: '#10b981' }}>0-4</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Minimal</div>
            </div>
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: score >= 5 && score <= 9 ? '#f59e0b20' : '#f9fafb',
              border: `2px solid ${score >= 5 && score <= 9 ? '#f59e0b' : '#e5e7eb'}`
            }}>
              <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>5-9</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Mild</div>
            </div>
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: score >= 10 && score <= 14 ? '#ef444420' : '#f9fafb',
              border: `2px solid ${score >= 10 && score <= 14 ? '#ef4444' : '#e5e7eb'}`
            }}>
              <div style={{ fontWeight: 'bold', color: '#ef4444' }}>10-14</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Moderate</div>
            </div>
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: score >= 15 && score <= 19 ? '#dc262620' : '#f9fafb',
              border: `2px solid ${score >= 15 && score <= 19 ? '#dc2626' : '#e5e7eb'}`
            }}>
              <div style={{ fontWeight: 'bold', color: '#dc2626' }}>15-19</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Mod. Severe</div>
            </div>
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: score >= 20 ? '#991b1b20' : '#f9fafb',
              border: `2px solid ${score >= 20 ? '#991b1b' : '#e5e7eb'}`
            }}>
              <div style={{ fontWeight: 'bold', color: '#991b1b' }}>20-27</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Severe</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
            <Link to="/screening/depression" className="btn btn-secondary">
              Retake Screening
            </Link>
          </div>
        </div>

        {/* Crisis Alert if suicidal thoughts detected */}
        {suicidalThoughts && (
          <div className="card" style={{ 
            padding: '24px', 
            background: '#fef2f2', 
            border: '2px solid #dc2626',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '32px' }}>🚨</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '20px' }}>
                  Immediate Support Available
                </h3>
                <p style={{ color: '#991b1b', marginBottom: '16px', lineHeight: '1.6' }}>
                  You indicated thoughts of self-harm. Please know that help is available 24/7, 
                  and you don't have to face this alone. Reach out for immediate support:
                </p>
                <div style={{ 
                  background: 'white', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#dc2626' }}>📱 National Crisis Text Line</strong>
                    <div style={{ color: '#991b1b' }}>Text <strong>HOME</strong> to <strong>741741</strong></div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#dc2626' }}>☎️ National Suicide Prevention Lifeline</strong>
                    <div style={{ color: '#991b1b' }}>Call or Text: <strong>988</strong></div>
                  </div>
                  <div>
                    <strong style={{ color: '#dc2626' }}>🚑 Emergency Services</strong>
                    <div style={{ color: '#991b1b' }}>Call: <strong>911</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Disclaimer */}
        <div className="card" style={{ padding: '20px', background: '#fffbeb', border: '1px solid #fbbf24' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Important Disclaimer</h4>
              <p style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                This screening tool is not a substitute for professional diagnosis. The PHQ-9 is designed 
                to help identify symptoms that may warrant further evaluation. If you're experiencing 
                significant distress or symptoms that interfere with your daily life, please consult 
                with a qualified mental health professional for proper evaluation and treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '16px' }}>Recommended Next Steps</h3>
          <ul style={{ color: '#4b5563', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Continue monitoring your mood regularly using the mood tracker</li>
            <li>Consider completing other mental health screenings (anxiety, stress)</li>
            <li>Share these results with your healthcare provider</li>
            <li>Maintain healthy lifestyle habits (sleep, exercise, nutrition)</li>
            <li>Reach out to friends, family, or support groups</li>
            {score >= 10 && (
              <li style={{ fontWeight: 'bold', color: '#dc2626' }}>
                Schedule an appointment with a mental health professional
              </li>
            )}
          </ul>
        </div>

        {/* Support Resources */}
        <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '16px' }}>Professional Support Resources</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <strong style={{ color: '#1f2937' }}>SAMHSA National Helpline</strong>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>1-800-662-4357 (24/7 Treatment Referral)</div>
            </div>
            <div>
              <strong style={{ color: '#1f2937' }}>Psychology Today Find a Therapist</strong>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>www.psychologytoday.com/us/therapists</div>
            </div>
            <div>
              <strong style={{ color: '#1f2937' }}>National Alliance on Mental Illness (NAMI)</strong>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>1-800-950-6264 or text NAMI to 741741</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionResults;
