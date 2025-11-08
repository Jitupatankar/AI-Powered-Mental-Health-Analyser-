// Simple data storage utility using localStorage for now
// In a real application, this would connect to a backend API

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'psyche_compass_mood_entries',
  ASSESSMENTS: 'psyche_compass_assessments',
  USER_PROFILE: 'psyche_compass_user_profile'
};

// Mood Entry Functions
export const saveMoodEntry = (moodData) => {
  try {
    const existingEntries = getMoodEntries();
    const newEntry = {
      id: Date.now(),
      ...moodData,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
    
    const updatedEntries = [newEntry, ...existingEntries];
    localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updatedEntries));
    return newEntry;
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return null;
  }
};

export const getMoodEntries = () => {
  try {
    const entries = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

export const getRecentMoodEntries = (limit = 5) => {
  const entries = getMoodEntries();
  return entries.slice(0, limit);
};

// Assessment Functions
export const saveAssessment = (assessmentType, responses, scores = null) => {
  try {
    const existingAssessments = getAssessments();
    const newAssessment = {
      id: Date.now(),
      type: assessmentType,
      responses,
      scores,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      status: 'Completed'
    };
    
    const updatedAssessments = [newAssessment, ...existingAssessments];
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updatedAssessments));
    return newAssessment;
  } catch (error) {
    console.error('Error saving assessment:', error);
    return null;
  }
};

export const getAssessments = () => {
  try {
    const assessments = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return assessments ? JSON.parse(assessments) : [];
  } catch (error) {
    console.error('Error getting assessments:', error);
    return [];
  }
};

export const getAssessmentsByType = (type) => {
  const assessments = getAssessments();
  return assessments.filter(assessment => assessment.type === type);
};

// Dashboard Statistics Functions
export const calculateDashboardStats = () => {
  const moodEntries = getMoodEntries();
  const assessments = getAssessments();
  
  // Calculate 7-day averages
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentEntries = moodEntries.filter(entry => 
    new Date(entry.timestamp) >= sevenDaysAgo
  );
  
  const stats = {
    moodAverage: 0,
    energyLevel: 0,
    stressLevel: 0,
    totalEntries: moodEntries.length
  };
  
  if (recentEntries.length > 0) {
    const totals = recentEntries.reduce((acc, entry) => ({
      mood: acc.mood + entry.mood,
      energy: acc.energy + entry.energy,
      stress: acc.stress + entry.stress
    }), { mood: 0, energy: 0, stress: 0 });
    
    stats.moodAverage = +(totals.mood / recentEntries.length).toFixed(1);
    stats.energyLevel = +(totals.energy / recentEntries.length).toFixed(1);
    stats.stressLevel = +(totals.stress / recentEntries.length).toFixed(1);
  }
  
  return {
    ...stats,
    recentMoods: formatRecentMoods(recentEntries.slice(0, 3)),
    assessmentHistory: formatAssessmentHistory(assessments.slice(0, 5))
  };
};

// Helper function to format mood entries for display
const formatRecentMoods = (entries) => {
  const moodEmojis = {
    1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊',
    6: '😄', 7: '😍', 8: '🤩', 9: '🎉', 10: '☀️'
  };
  
  return entries.map(entry => ({
    id: entry.id,
    mood: `${entry.mood}/10`,
    emoji: moodEmojis[entry.mood] || '😐',
    energy: `${entry.energy}/10`,
    stress: `${entry.stress}/10`,
    date: entry.date,
    time: entry.time,
    description: entry.description || 'No description'
  }));
};

// Helper function to format assessment history
const formatAssessmentHistory = (assessments) => {
  return assessments.map(assessment => ({
    type: getAssessmentDisplayName(assessment.type),
    date: assessment.date,
    status: assessment.status
  }));
};

// Helper function to get display names for assessments
const getAssessmentDisplayName = (type) => {
  const displayNames = {
    'big_five_personality': 'Big Five Assessment',
    'depression_screening': 'Depression Screening',
    'anxiety_screening': 'Anxiety Assessment',
    'stress_evaluation': 'Stress Evaluation'
  };
  return displayNames[type] || type;
};

// User Profile Functions (for future use)
export const saveUserProfile = (profileData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profileData));
    return profileData;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return null;
  }
};

export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Utility Functions
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const exportData = () => {
  try {
    const data = {
      moodEntries: getMoodEntries(),
      assessments: getAssessments(),
      userProfile: getUserProfile(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};