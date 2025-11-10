import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveAssessment } from '../utils/dataStorage';

const DepressionScreening = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  
  const questions = [
    {
      id: 1,
      text: "Little interest or pleasure in doing things",
      timeFrame: "Over the last 2 weeks, how often have you been bothered by:"
    },
    {
      id: 2,
      text: "Feeling down, depressed, or hopeless"
    },
    {
      id: 3,
      text: "Trouble falling or staying asleep, or sleeping too much"
    },
    {
      id: 4,
      text: "Feeling tired or having little energy"
    },
    {
      id: 5,
      text: "Poor appetite or overeating"
    },
    {
      id: 6,
      text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down"
    },
    {
      id: 7,
      text: "Trouble concentrating on things, such as reading the newspaper or watching television"
    },
    {
      id: 8,
      text: "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual"
    },
    {
      id: 9,
      text: "Thoughts that you would be better off dead, or of hurting yourself in some way"
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
    if (score <= 4) return { level: "Minimal", color: "#10b981", recommendation: "Your responses suggest minimal depression symptoms." };
    if (score <= 9) return { level: "Mild", color: "#f59e0b", recommendation: "Your responses suggest mild depression symptoms. Consider monitoring your mood and seeking support if symptoms persist." };
    if (score <= 14) return { level: "Moderate", color: "#ef4444", recommendation: "Your responses suggest moderate depression symptoms. Consider speaking with a healthcare provider or counselor." };
    if (score <= 19) return { level: "Moderately Severe", color: "#dc2626", recommendation: "Your responses suggest moderately severe depression symptoms. We strongly recommend consulting with a mental health professional." };
    return { level: "Severe", color: "#991b1b", recommendation: "Your responses suggest severe depression symptoms. Please seek immediate help from a mental health professional or healthcare provider." };
  };

  const handleComplete = async () => {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);
    
    // Check for suicidal ideation (question 9)
    const suicidalThoughts = responses[9] > 0;
    
    // Save assessment to database
    try {
      const savedAssessment = await saveAssessment('depression_screening', responses, { score, interpretation, suicidalThoughts });
    
      console.log('Depression screening completed:', { responses, score, interpretation, suicidalThoughts, savedAssessment });
      
      // Navigate to results page with state
      navigate('/screening/depression/results', {
        state: { score, interpretation, suicidalThoughts, responses }
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment. Please try again.');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentResponse = responses[questions[currentQuestion].id];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/screening" className="back-button">
          ← Back
        </Link>

        <div className="page-header">
          <h1 className="page-title">Depression Screening (PHQ-9 Style)</h1>
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

            {/* Special warning for question 9 */}
            {isLastQuestion && (
              <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca' }}>
                <p style={{ color: '#dc2626', fontSize: '0.9rem', margin: 0, textAlign: 'center', fontWeight: '500' }}>
                  ⚠️ This question addresses thoughts of self-harm. Please answer honestly - help is available.
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

          {/* Crisis Support - always show, but highlight for question 9 */}
          <div className="card" style={{ 
            padding: '16px', 
            background: isLastQuestion ? '#fef2f2' : '#fef7ff', 
            border: `1px solid ${isLastQuestion ? '#fecaca' : '#e9d5ff'}` 
          }}>
            <h4 style={{ 
              color: isLastQuestion ? '#dc2626' : '#8b5cf6', 
              margin: '0 0 12px 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              🚨 Need immediate support?
            </h4>
            <p style={{ 
              color: isLastQuestion ? '#dc2626' : '#8b5cf6', 
              fontSize: '0.9rem', 
              margin: '0 0 8px 0' 
            }}>
              If you're experiencing thoughts of self-harm or crisis, please contact:
            </p>
            <ul style={{ 
              color: isLastQuestion ? '#dc2626' : '#8b5cf6', 
              fontSize: '0.85rem', 
              margin: 0, 
              paddingLeft: '16px' 
            }}>
              <li>National Crisis Text Line: Text HOME to 741741</li>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Emergency Services: 911</li>
            </ul>
          </div>

          {/* About PHQ-9 */}
          <div className="card" style={{ marginTop: '16px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '12px' }}>About the PHQ-9 Screening</h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.5' }}>
              The PHQ-9 (Patient Health Questionnaire-9) is a widely used depression screening tool. 
              Scores range from 0-27, with higher scores indicating more severe depression symptoms. This screening 
              can help identify whether you might benefit from speaking with a healthcare provider about depression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionScreening;