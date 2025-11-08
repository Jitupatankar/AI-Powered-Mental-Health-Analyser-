import React from 'react';
import { Link } from 'react-router-dom';

const MentalHealthScreening = () => {
  const screenings = [
    {
      title: "Depression Screening",
      description: "Assess symptoms that may indicate depression using a PHQ-9 style questionnaire",
      icon: "💝",
      iconClass: "icon-depression",
      questions: "9 questions",
      duration: "5-7 minutes",
      link: "/screening/depression"
    },
    {
      title: "Anxiety Assessment", 
      description: "Evaluate anxiety symptoms using a GAD-7 style screening tool",
      icon: "⚠️",
      iconClass: "icon-anxiety",
      questions: "7 questions",
      duration: "5-7 minutes",
      link: "/screening/anxiety"
    },
    {
      title: "Stress Evaluation",
      description: "Measure your current stress levels and coping mechanisms",
      icon: "⚡",
      iconClass: "icon-stress-eval", 
      questions: "8 questions",
      duration: "7-10 minutes",
      link: "/screening/stress"
    }
  ];

  const guidelines = [
    "Answer based on how you've felt recently",
    "Results provide general insights only",
    "Not a substitute for professional diagnosis",
    "Consider professional help for concerning results"
  ];

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/dashboard" className="back-button">
          ← Back
        </Link>

        <div className="page-header">
          <h1 className="page-title">Mental Health Screening</h1>
          <p className="page-subtitle">Evidence-based tools for assessing mental health symptoms</p>
        </div>

        {/* Important Disclaimer */}
        <div className="alert alert-warning">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
            <div>
              <strong>Important:</strong> These screening tools are for educational purposes only and are not a substitute for professional medical diagnosis. If you're experiencing distress, please consult with a qualified mental health professional.
            </div>
          </div>
        </div>

        {/* Screening Options */}
        <div className="card-grid">
          {screenings.map((screening, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div className={`card-icon ${screening.iconClass}`}>
                {screening.icon}
              </div>
              
              <h3 style={{ margin: '16px 0', color: '#1f2937' }}>
                {screening.title}
              </h3>
              
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
                {screening.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', fontSize: '0.85rem', color: '#6b7280' }}>
                <span>• {screening.questions}</span>
                <span>• {screening.duration}</span>
              </div>
              
              <Link to={screening.link} className="btn btn-primary btn-full">
                Start Screening →
              </Link>
            </div>
          ))}
        </div>

        <div className="card-grid-2">
          {/* Screening Guidelines */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Screening Guidelines
            </h3>
            
            <div className="tips-grid">
              {guidelines.map((guideline, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{guideline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crisis Support */}
          <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
              🚨 Need immediate support?
            </h3>
            
            <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '16px' }}>
              If you're experiencing thoughts of self-harm or crisis, please contact:
            </p>
            
            <div className="support-resource">
              <div className="resource-name" style={{ color: '#dc2626' }}>Crisis Support</div>
              <div className="resource-contact">National Crisis Text Line: Text HOME to 741741</div>
            </div>
            
            <div className="support-resource">
              <div className="resource-name" style={{ color: '#dc2626' }}>Suicide Prevention</div>
              <div className="resource-contact">National Lifeline: 988</div>
            </div>
            
            <div className="support-resource">
              <div className="resource-name" style={{ color: '#dc2626' }}>Mental Health</div>
              <div className="resource-contact">SAMHSA Helpline: 1-800-662-4357</div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>About Mental Health Screenings</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '8px' }}>What are these screenings?</h4>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                These are evidence-based screening tools commonly used by mental health professionals to assess symptoms of depression, anxiety, and stress. They help identify potential areas of concern that may benefit from professional evaluation.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '8px' }}>How should I use the results?</h4>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Use the results as a starting point for understanding your mental health. If you score high on any screening, consider discussing the results with a healthcare provider or mental health professional for proper evaluation and support.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '8px' }}>Privacy and confidentiality</h4>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Your responses are stored locally and are not shared with any third parties. However, these tools are not a substitute for professional medical care or crisis intervention services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthScreening;