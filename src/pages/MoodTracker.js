import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveMoodEntry, getRecentMoodEntries } from '../utils/dataStorage';

const MoodTracker = () => {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState({
    mood: 5,
    energy: 5,
    stress: 3,
    description: '',
    notes: ''
  });

  const [recentEntries, setRecentEntries] = useState([]);

  useEffect(() => {
    // Load recent entries from API
    const loadRecentEntries = async () => {
      try {
        const entries = await getRecentMoodEntries(3);
        setRecentEntries(entries || []);
      } catch (error) {
        console.error('Error loading recent entries:', error);
        setRecentEntries([]);
      }
    };
    
    loadRecentEntries();
  }, []);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Bad' },
    { value: 2, emoji: '😔', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' },
    { value: 6, emoji: '😄', label: 'Very Good' },
    { value: 7, emoji: '😍', label: 'Excellent' },
    { value: 8, emoji: '🤩', label: 'Amazing' },
    { value: 9, emoji: '🎉', label: 'Wonderful' },
    { value: 10, emoji: '☀️', label: 'Fantastic' }
  ];

  const energyOptions = [
    { value: 1, label: 'Exhausted' },
    { value: 2, label: 'Very Low' },
    { value: 3, label: 'Low' },
    { value: 4, label: 'Below Average' },
    { value: 5, label: 'Average' },
    { value: 6, label: 'Good' },
    { value: 7, label: 'High' },
    { value: 8, label: 'Very High' },
    { value: 9, label: 'Energetic' },
    { value: 10, label: 'Bursting' }
  ];

  const stressOptions = [
    { value: 1, label: 'None' },
    { value: 2, label: 'Very Low' },
    { value: 3, label: 'Low' },
    { value: 4, label: 'Mild' },
    { value: 5, label: 'Moderate' },
    { value: 6, label: 'High' },
    { value: 7, label: 'Very High' },
    { value: 8, label: 'Severe' },
    { value: 9, label: 'Extreme' },
    { value: 10, label: 'Overwhelming' }
  ];

  const tips = [
    'Track consistently for better insights',
    'Be honest about your feelings',
    'Note what influences your mood',
    'Look for patterns over time',
    'Celebrate positive trends'
  ];

  const handleSave = async () => {
    // Save mood entry to database
    try {
      const savedEntry = await saveMoodEntry(moodData);
      if (savedEntry) {
        console.log('Mood entry saved:', savedEntry);
        alert('Mood entry saved successfully!');
        navigate('/dashboard');
      } else {
        alert('Error saving mood entry. Please try again.');
      }
    } catch (error) {
      console.error('Error saving mood entry:', error);
      alert('Error saving mood entry. Please try again.');
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <div className="page-container">
      <div className="container">
        <Link to="/dashboard" className="back-button">
          ← Back
        </Link>

        <div className="page-header">
          <h1 className="page-title">Mood Tracker</h1>
          <p className="page-subtitle">Log your daily emotional state and energy levels</p>
        </div>

        <div className="card-grid-2">
          {/* Mood Entry Form */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ color: '#667eea', fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <h2 style={{ color: '#1f2937', marginBottom: '8px' }}>How are you feeling today?</h2>
              <p style={{ color: '#6b7280' }}>{getCurrentDate()}</p>
            </div>

            {/* Mood Selection */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                💝 Mood
                <span style={{ color: '#6b7280', fontWeight: '400' }}>Current: {moodData.mood} (Neutral)</span>
              </label>
              <div className="rating-scale">
                {moodOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`rating-option ${moodData.mood === option.value ? 'selected' : ''}`}
                    onClick={() => setMoodData(prev => ({ ...prev, mood: option.value }))}
                  >
                    <span className="emoji">{option.emoji}</span>
                    <span className="rating-value">{option.value}</span>
                    <span className="rating-label">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚡ Energy Level
                <span style={{ color: '#6b7280', fontWeight: '400' }}>Current: {moodData.energy}</span>
              </label>
              <div className="rating-scale">
                {energyOptions.slice(0, 10).map((option) => (
                  <div
                    key={option.value}
                    className={`rating-option ${moodData.energy === option.value ? 'selected' : ''}`}
                    onClick={() => setMoodData(prev => ({ ...prev, energy: option.value }))}
                  >
                    <span className="rating-value">{option.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Stress Level
                <span style={{ color: '#6b7280', fontWeight: '400' }}>Current: {moodData.stress}</span>
              </label>
              <div className="rating-scale">
                {stressOptions.slice(0, 10).map((option) => (
                  <div
                    key={option.value}
                    className={`rating-option ${moodData.stress === option.value ? 'selected' : ''}`}
                    onClick={() => setMoodData(prev => ({ ...prev, stress: option.value }))}
                  >
                    <span className="rating-value">{option.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Describe your mood *</label>
              <textarea
                className="form-textarea"
                placeholder="What's influencing your mood today? Any specific thoughts or feelings you'd like to note..."
                value={moodData.description}
                onChange={(e) => setMoodData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Additional Notes */}
            <div className="form-group">
              <label className="form-label">Additional Notes (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Any other thoughts, activities, or events you'd like to remember about today..."
                value={moodData.notes}
                onChange={(e) => setMoodData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <button 
              className="btn btn-primary btn-large btn-full"
              onClick={handleSave}
              style={{ marginTop: '24px' }}
            >
              📝 Save Mood Entry
            </button>
          </div>

          <div>
            {/* Recent Entries */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                📊 Recent Entries
              </h3>
              
              {recentEntries.map((entry) => (
                <div key={entry.id} className="mood-entry">
                  <div className="mood-info">
                    <span className="emoji" style={{ fontSize: '32px' }}>{entry.emoji}</span>
                    <div>
                      <h4>{entry.mood}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '4px 0' }}>{entry.description}</p>
                      <div className="mood-meta">
                        <span>Energy: {entry.energy}</span>
                        <span>Stress: {entry.stress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mood-date">
                    <div>{entry.date}</div>
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button className="btn btn-secondary">View Full History</button>
              </div>
            </div>

            {/* Mood Tracking Tips */}
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                💡 Mood Tracking Tips
              </h3>
              
              <div className="tips-grid">
                {tips.map((tip, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;