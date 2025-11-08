import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Star, Trophy, Sparkles } from 'lucide-react';
import Button from './UI/Button';
import Card from './UI/Card';
import './EnhancedAssessment.css';

const EnhancedAssessment = ({ 
  questions = [],
  title = "Assessment",
  subtitle = "",
  onComplete = () => {},
  onBack = () => {},
  showProgress = true,
  animationType = 'slide' // 'slide', 'fade', 'scale'
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');
  const [showResults, setShowResults] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const hasAnswer = answers[currentQuestion] !== undefined;

  // Enhanced Progress Bar Component
  const ProgressBar = () => (
    <div className="enhanced-progress-container">
      <div className="progress-info">
        <span className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span className="progress-percentage">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="enhanced-progress-bar">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progress}%`,
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <div className="progress-glow" style={{ left: `${Math.max(0, progress - 5)}%` }} />
        </div>
        <div className="progress-milestones">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`milestone ${index <= currentQuestion ? 'completed' : ''} ${
                index === currentQuestion ? 'active' : ''
              }`}
              style={{ left: `${(index / (questions.length - 1)) * 100}%` }}
            >
              {index < currentQuestion ? (
                <Check size={12} />
              ) : index === currentQuestion ? (
                <div className="milestone-pulse" />
              ) : (
                <div className="milestone-dot" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Question transition handler
  const handleQuestionTransition = (newIndex, transitionDirection = 'next') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection(transitionDirection);
    
    // Apply exit animation
    setAnimationClass(`question-exit-${animationType}-${transitionDirection}`);
    
    setTimeout(() => {
      setCurrentQuestion(newIndex);
      setAnimationClass(`question-enter-${animationType}-${transitionDirection}`);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationClass('');
      }, 300);
    }, 300);
  };

  const handleNext = () => {
    if (!hasAnswer) return;
    
    if (isLastQuestion) {
      handleComplete();
    } else {
      handleQuestionTransition(currentQuestion + 1, 'next');
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) return;
    handleQuestionTransition(currentQuestion - 1, 'prev');
  };

  const handleComplete = () => {
    setShowResults(true);
    setTimeout(() => {
      onComplete(answers);
    }, 2000); // Show celebration animation before completing
  };

  const handleAnswerSelect = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    // Add a subtle celebration effect for the first answer
    if (answers[currentQuestion] === undefined) {
      const answerElement = document.querySelector(`[data-value="${value}"]`);
      if (answerElement) {
        answerElement.classList.add('answer-selected-celebration');
        setTimeout(() => {
          answerElement.classList.remove('answer-selected-celebration');
        }, 600);
      }
    }
  };

  // Render rating options with enhanced styling
  const renderRatingOptions = (question) => {
    const options = question.options || [
      { value: 1, label: 'Strongly Disagree', emoji: '😟' },
      { value: 2, label: 'Disagree', emoji: '🙁' },
      { value: 3, label: 'Neutral', emoji: '😐' },
      { value: 4, label: 'Agree', emoji: '🙂' },
      { value: 5, label: 'Strongly Agree', emoji: '😊' }
    ];

    return (
      <div className="rating-options-enhanced">
        {options.map((option, index) => (
          <div
            key={option.value}
            data-value={option.value}
            className={`rating-option-enhanced ${
              answers[currentQuestion] === option.value ? 'selected' : ''
            }`}
            onClick={() => handleAnswerSelect(option.value)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="option-emoji">{option.emoji}</div>
            <div className="option-value">{option.value}</div>
            <div className="option-label">{option.label}</div>
            <div className="option-ripple"></div>
          </div>
        ))}
      </div>
    );
  };

  // Results celebration component
  const ResultsCelebration = () => (
    <div className="results-celebration">
      <div className="celebration-backdrop" />
      <div className="celebration-content">
        <div className="celebration-icon">
          <Trophy size={64} />
          <div className="celebration-sparkles">
            <Sparkles className="sparkle sparkle-1" size={20} />
            <Sparkles className="sparkle sparkle-2" size={24} />
            <Sparkles className="sparkle sparkle-3" size={18} />
            <Star className="sparkle sparkle-4" size={16} />
          </div>
        </div>
        <h2>Assessment Complete!</h2>
        <p>Thank you for taking the time to reflect on yourself.</p>
        <div className="celebration-progress">
          <div className="celebration-progress-bar">
            <div className="celebration-progress-fill" />
          </div>
        </div>
      </div>
    </div>
  );

  if (showResults) {
    return <ResultsCelebration />;
  }

  if (questions.length === 0) {
    return (
      <Card>
        <div className="no-questions">
          <p>No questions available for this assessment.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="enhanced-assessment">
      <div className="assessment-container">
        <header className="assessment-header">
          <Button 
            variant="ghost" 
            icon={<ChevronLeft />}
            onClick={onBack}
            className="back-button-enhanced"
          >
            Back
          </Button>
          
          <div className="assessment-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </header>

        {showProgress && <ProgressBar />}

        <main className="assessment-main">
          <Card className={`question-card-enhanced ${animationClass}`}>
            <div className="question-header">
              <div className="question-number">
                Question {currentQuestion + 1}
              </div>
              {question.category && (
                <div className="question-category">{question.category}</div>
              )}
            </div>

            <div className="question-content">
              <h2 className="question-text">{question.text || question.question}</h2>
              {question.description && (
                <p className="question-description">{question.description}</p>
              )}
            </div>

            <div className="question-answers">
              {renderRatingOptions(question)}
            </div>

            {question.tip && hasAnswer && (
              <div className="question-tip">
                <div className="tip-icon">💡</div>
                <p>{question.tip}</p>
              </div>
            )}
          </Card>
        </main>

        <footer className="assessment-footer">
          <div className="navigation-buttons">
            <Button
              variant="secondary"
              icon={<ChevronLeft />}
              onClick={handlePrevious}
              disabled={isFirstQuestion || isTransitioning}
              className={isFirstQuestion ? 'invisible' : ''}
            >
              Previous
            </Button>

            <div className="quick-nav">
              {questions.slice(Math.max(0, currentQuestion - 2), currentQuestion + 3).map((_, index) => {
                const questionIndex = Math.max(0, currentQuestion - 2) + index;
                return (
                  <button
                    key={questionIndex}
                    className={`quick-nav-dot ${questionIndex === currentQuestion ? 'active' : ''} ${
                      answers[questionIndex] !== undefined ? 'answered' : ''
                    }`}
                    onClick={() => handleQuestionTransition(questionIndex, 
                      questionIndex > currentQuestion ? 'next' : 'prev'
                    )}
                    disabled={isTransitioning}
                  >
                    {answers[questionIndex] !== undefined && <Check size={8} />}
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              iconPosition="right"
              icon={isLastQuestion ? <Check /> : <ChevronRight />}
              onClick={handleNext}
              disabled={!hasAnswer || isTransitioning}
              loading={isTransitioning}
            >
              {isLastQuestion ? 'Complete' : 'Next'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EnhancedAssessment;