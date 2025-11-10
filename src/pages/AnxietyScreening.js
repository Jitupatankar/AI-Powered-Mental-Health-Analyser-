import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveAssessment } from '../utils/dataStorage';

const AnxietyScreening = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  
  const questions = [
    {
      id: 1,
      text: "Feeling nervous, anxious, or on edge",
      timeFrame: "Over the last 2 weeks, how often have you been bothered by:"
    },
    {
      id: 2,
      text: "Not being able to stop or control worrying"
    },
    {
      id: 3,
      text: "Worrying too much about different things"
    },
    {
      id: 4,
      text: "Trouble relaxing"
    },
    {
      id: 5,
      text: "Being so restless that it's hard to sit still"
    },
    {
      id: 6,
      text: "Becoming easily annoyed or irritable"
    },
    {
      id: 7,
      text: "Feeling afraid as if something awful might happen"
    }
  ];

  const responseOptions = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
  ];

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
    Object.values(responses).forEach(value => {
      total += value || 0;
    });
    return total;
  };

  const getScoreInterpretation = (score) => {
    if (score <= 4) return { level: "Minimal", color: "#10b981", recommendation: "Your responses suggest minimal anxiety symptoms." };
    if (score <= 9) return { level: "Mild", color: "#f59e0b", recommendation: "Your responses suggest mild anxiety symptoms. Consider monitoring your symptoms." };
    if (score <= 14) return { level: "Moderate", color: "#ef4444", recommendation: "Your responses suggest moderate anxiety symptoms. Consider speaking with a healthcare provider." };
    return { level: "Severe", color: "#dc2626", recommendation: "Your responses suggest severe anxiety symptoms. We recommend consulting with a mental health professional." };
  };

  const handleComplete = async () => {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);
    
    // Save assessment to database
    try {
      const savedAssessment = await saveAssessment('anxiety_screening', responses, { score, interpretation });
      
      console.log('Anxiety screening completed:', { responses, score, interpretation, savedAssessment });
      
      const message = `Anxiety Screening Results:\n\nTotal Score: ${score}/21\nSeverity Level: ${interpretation.level}\n\n${interpretation.recommendation}\n\nRemember: This is a screening tool, not a diagnosis. Please consult with a qualified mental health professional for proper evaluation.`;
      
      alert(message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment. Please try again.');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentResponse = responses[questions[currentQuestion].id];

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/screening" className="back-button">
          ← Back
        </Link>

        <div className="page-header">
          <h1 className="page-title">Anxiety Screening (GAD-7 Style)</h1>
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
                {currentQuestion === questions.length - 1 ? 'Complete Screening' : 'Next'} →
              </button>
            </div>
          </div>

          {/* Crisis Support */}
          <div className="card" style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca' }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚨 Need immediate support?
            </h4>
            <p style={{ color: '#dc2626', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              If you're experiencing thoughts of self-harm or crisis, please contact:
            </p>
            <ul style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0, paddingLeft: '16px' }}>
              <li>National Crisis Text Line: Text HOME to 741741</li>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Emergency Services: 911</li>
            </ul>
          </div>

          {/* About GAD-7 */}
          <div className="card" style={{ marginTop: '16px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '12px' }}>About the GAD-7 Screening</h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.5' }}>
              The GAD-7 (Generalized Anxiety Disorder 7-item) is a widely used screening tool for anxiety symptoms. 
              Scores range from 0-21, with higher scores indicating more severe anxiety symptoms. This screening can help 
              identify whether you might benefit from speaking with a healthcare provider about anxiety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnxietyScreening;