import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveAssessment } from '../utils/dataStorage';

const PersonalityAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  
  const questions = [
    {
      id: 1,
      text: "I am outgoing and sociable",
      trait: "extraversion",
      reverse: false
    },
    {
      id: 2,
      text: "I find fault with others",
      trait: "agreeableness", 
      reverse: true
    },
    {
      id: 3,
      text: "I do a thorough job",
      trait: "conscientiousness",
      reverse: false
    },
    {
      id: 4,
      text: "I am depressed, blue",
      trait: "neuroticism",
      reverse: false
    },
    {
      id: 5,
      text: "I am original, come up with new ideas",
      trait: "openness",
      reverse: false
    },
    {
      id: 6,
      text: "I am reserved",
      trait: "extraversion",
      reverse: true
    },
    {
      id: 7,
      text: "I am helpful and unselfish with others",
      trait: "agreeableness",
      reverse: false
    },
    {
      id: 8,
      text: "I can be somewhat careless",
      trait: "conscientiousness",
      reverse: true
    },
    {
      id: 9,
      text: "I am relaxed, handle stress well",
      trait: "neuroticism",
      reverse: true
    },
    {
      id: 10,
      text: "I am curious about many different things",
      trait: "openness",
      reverse: false
    },
    {
      id: 11,
      text: "I am full of energy",
      trait: "extraversion",
      reverse: false
    },
    {
      id: 12,
      text: "I start quarrels with others",
      trait: "agreeableness",
      reverse: true
    },
    {
      id: 13,
      text: "I am a reliable worker",
      trait: "conscientiousness",
      reverse: false
    },
    {
      id: 14,
      text: "I can be tense",
      trait: "neuroticism",
      reverse: false
    },
    {
      id: 15,
      text: "I am ingenious, a deep thinker",
      trait: "openness",
      reverse: false
    }
  ];

  const responseOptions = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
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
      // Complete assessment
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    // Calculate Big Five scores
    const scores = calculateBigFiveScores();
    
    // Save assessment to database
    try {
      const savedAssessment = await saveAssessment('big_five_personality', responses, scores);
      
      console.log('Assessment completed:', { responses, scores, savedAssessment });
      alert(`Assessment completed! Your personality profile has been calculated:\n\nExtraversion: ${scores.extraversion}\nAgreeableness: ${scores.agreeableness}\nConscientiousness: ${scores.conscientiousness}\nNeuroticism: ${scores.neuroticism}\nOpenness: ${scores.openness}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment. Please try again.');
    }
  };

  const calculateBigFiveScores = () => {
    const traits = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];
    const scores = {};

    traits.forEach(trait => {
      const traitQuestions = questions.filter(q => q.trait === trait);
      let total = 0;
      
      traitQuestions.forEach(q => {
        const response = responses[q.id] || 3;
        const score = q.reverse ? (6 - response) : response;
        total += score;
      });
      
      scores[trait] = Math.round((total / traitQuestions.length) * 20); // Scale to 0-100
    });

    return scores;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentResponse = responses[questions[currentQuestion].id];

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/dashboard" className="back-button">
          ← Back
        </Link>

        <div className="page-header">
          <h1 className="page-title">Big Five Personality Assessment</h1>
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
                disabled={!currentResponse}
                style={{ opacity: !currentResponse ? 0.5 : 1 }}
              >
                {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'} →
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="card" style={{ padding: '16px', background: '#fef3c7', border: '1px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#f59e0b', fontSize: '18px' }}>💡</span>
              <div>
                <p style={{ color: '#92400e', fontSize: '0.9rem', margin: 0 }}>
                  <strong>Take your time and answer based on how you typically think, feel, and behave, not how you think you should respond.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Crisis Support Notice */}
          <div className="card" style={{ padding: '16px', background: '#dbeafe', border: '1px solid #3b82f6', marginTop: '16px' }}>
            <h4 style={{ color: '#1e40af', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚕️ Need immediate support?
            </h4>
            <p style={{ color: '#1e40af', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              If you're experiencing thoughts of self-harm or crisis, please contact:
            </p>
            <ul style={{ color: '#1e40af', fontSize: '0.85rem', margin: 0, paddingLeft: '16px' }}>
              <li>National Crisis Text Line: Text HOME to 741741</li>
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Emergency Services: 911</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityAssessment;