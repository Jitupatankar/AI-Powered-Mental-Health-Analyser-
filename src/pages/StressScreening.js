import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveAssessment } from '../utils/dataStorage';

const StressScreening = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  
  const questions = [
    {
      id: 1,
      text: "How often have you been upset because of something that happened unexpectedly?",
      timeFrame: "In the last month, how often have you felt or experienced:"
    },
    {
      id: 2,
      text: "How often have you felt that you were unable to control the important things in your life?"
    },
    {
      id: 3,
      text: "How often have you felt nervous and stressed?"
    },
    {
      id: 4,
      text: "How often have you felt confident about your ability to handle your personal problems?"
    },
    {
      id: 5,
      text: "How often have you felt that things were going your way?"
    },
    {
      id: 6,
      text: "How often have you found that you could not cope with all the things that you had to do?"
    },
    {
      id: 7,
      text: "How often have you been able to control irritations in your life?"
    },
    {
      id: 8,
      text: "How often have you felt that you were on top of things?"
    }
  ];

  const responseOptions = [
    { value: 0, label: "Never" },
    { value: 1, label: "Almost Never" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Fairly Often" },
    { value: 4, label: "Very Often" }
  ];

  // Questions 4, 5, 7, and 8 are reverse scored
  const reverseScored = [4, 5, 7, 8];

  const handleResponse = (value) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let total = 0;
    Object.entries(responses).forEach(([questionId, value]) => {
      const qId = parseInt(questionId);
      if (reverseScored.includes(qId)) {
        // Reverse score these questions
        total += (4 - (value || 0));
      } else {
        total += (value || 0);
      }
    });
    return total;
  };

  const getScoreInterpretation = (score) => {
    if (score <= 13) return { 
      level: "Low Stress", 
      color: "#10b981", 
      recommendation: "Your stress levels appear to be low. Continue with your current coping strategies and maintain healthy lifestyle habits." 
    };
    if (score <= 26) return { 
      level: "Moderate Stress", 
      color: "#f59e0b", 
      recommendation: "Your stress levels are moderate. Consider implementing stress management techniques like regular exercise, meditation, or talking to someone you trust." 
    };
    return { 
      level: "High Stress", 
      color: "#ef4444", 
      recommendation: "Your stress levels appear to be high. Consider speaking with a healthcare provider or counselor about stress management strategies. Professional support can be very helpful." 
    };
  };

  const handleComplete = async () => {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);
    
    // Save assessment to database
    try {
      const savedAssessment = await saveAssessment('stress_evaluation', responses, { score, interpretation });
      
      console.log('Stress screening completed:', { responses, score, interpretation, savedAssessment });
      
      const message = `Stress Evaluation Results:\n\nTotal Score: ${score}/32\nStress Level: ${interpretation.level}\n\n${interpretation.recommendation}\n\nRemember: This is a screening tool, not a diagnosis. If you're experiencing significant stress that interferes with your daily life, consider speaking with a healthcare professional.`;
      
      alert(message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment. Please try again.');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentResponse = responses[questions[currentQuestion].id];
  const currentQuestionId = questions[currentQuestion].id;
  const isPositiveQuestion = reverseScored.includes(currentQuestionId);

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/screening" className="back-button">
          ← Back
        </Link>

        <div className="page-header">
          <h1 className="page-title">Stress Evaluation</h1>
          <p className="page-subtitle">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="question-container">
          <div className="question-card">
            {/* Time Frame (shown only for first question) */}
            {currentQuestion === 0 && (
              <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #3b82f6' }}>
                <p style={{ color: '#1e40af', fontSize: '0.9rem', margin: 0, textAlign: 'center', fontWeight: '500' }}>
                  {questions[0].timeFrame}
                </p>
              </div>
            )}

            {/* Indicator for positive/coping questions */}
            {isPositiveQuestion && (
              <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #22c55e' }}>
                <p style={{ color: '#15803d', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
                  💪 This question is about your coping abilities
                </p>
              </div>
            )}
            
            <div className="question-number">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            
            <h2 className="question-title">
              {questions[currentQuestion].text}
            </h2>

            <div className="rating-scale">
              {responseOptions.map((option) => (
                <div
                  key={option.value}
                  className={`rating-option ${currentResponse === option.value ? 'selected' : ''}`}
                  onClick={() => handleResponse(option.value)}
                >
                  <span className="rating-value">{option.value}</span>
                  <span className="rating-label">{option.label}</span>
                </div>
              ))}
            </div>

            <div className="nav-buttons">
              <button 
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
              >
                Previous
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={handleNext}
                disabled={currentResponse === undefined}
                style={{ opacity: currentResponse === undefined ? 0.5 : 1 }}
              >
                {currentQuestion === questions.length - 1 ? 'Complete Evaluation' : 'Next'} →
              </button>
            </div>
          </div>

          {/* Stress Management Tips */}
          <div className="card" style={{ padding: '16px', background: '#fef7ff', border: '1px solid #e9d5ff' }}>
            <h4 style={{ color: '#8b5cf6', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💡 Quick Stress Relief Tips
            </h4>
            <ul style={{ color: '#8b5cf6', fontSize: '0.85rem', margin: 0, paddingLeft: '16px' }}>
              <li>Take 5 deep breaths</li>
              <li>Go for a short walk</li>
              <li>Practice progressive muscle relaxation</li>
              <li>Talk to a trusted friend or family member</li>
              <li>Engage in a hobby you enjoy</li>
            </ul>
          </div>

          {/* About Stress Assessment */}
          <div className="card" style={{ marginTop: '16px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '12px' }}>About This Stress Assessment</h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.5' }}>
              This assessment is based on the Perceived Stress Scale (PSS) and measures how unpredictable, 
              uncontrollable, and overloaded you find your life. Scores range from 0-32, with higher scores 
              indicating higher perceived stress levels. Remember that some stress is normal, but chronic high 
              stress can impact your health and wellbeing.
            </p>
          </div>

          {/* Crisis Support */}
          <div className="card" style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', marginTop: '16px' }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚨 Feeling overwhelmed?
            </h4>
            <p style={{ color: '#dc2626', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              If stress is severely impacting your life, please reach out for support:
            </p>
            <ul style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0, paddingLeft: '16px' }}>
              <li>National Crisis Text Line: Text HOME to 741741</li>
              <li>SAMHSA National Helpline: 1-800-662-4357</li>
              <li>Your healthcare provider or local mental health services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressScreening;