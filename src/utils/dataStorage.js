// Data storage utility using API calls to backend
import api from "../api/axios";

// Helper function to get auth token headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("psyche_compass_auth_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =============== Mood Entry Functions ===============

export const saveMoodEntry = async (moodData) => {
  try {
    const response = await api.post("/api/mood", moodData, getAuthHeaders());
    if (response.data.success) {
      return response.data.moodEntry;
    }
    return null;
  } catch (error) {
    console.error("Error saving mood entry:", error);
    return null;
  }
};

export const getMoodEntries = async () => {
  try {
    const response = await api.get("/api/mood", getAuthHeaders());
    if (response.data.success) {
      return response.data.moodEntries;
    }
    return [];
  } catch (error) {
    console.error("Error getting mood entries:", error);
    return [];
  }
};

export const getRecentMoodEntries = async (limit = 5) => {
  try {
    const response = await api.get(`/api/mood/recent/${limit}`, getAuthHeaders());
    if (response.data.success) {
      return response.data.moodEntries;
    }
    return [];
  } catch (error) {
    console.error("Error getting recent mood entries:", error);
    return [];
  }
};

// =============== Assessment Functions ===============

export const saveAssessment = async (assessmentType, responses, scores = null) => {
  try {
    const response = await api.post(
      "/api/assessment",
      { type: assessmentType, responses, scores },
      getAuthHeaders()
    );
    if (response.data.success) {
      return response.data.assessment;
    }
    return null;
  } catch (error) {
    console.error("Error saving assessment:", error);
    return null;
  }
};

export const getAssessments = async () => {
  try {
    const response = await api.get("/api/assessment", getAuthHeaders());
    if (response.data.success) {
      return response.data.assessments;
    }
    return [];
  } catch (error) {
    console.error("Error getting assessments:", error);
    return [];
  }
};

export const getAssessmentsByType = async (type) => {
  try {
    const response = await api.get(`/api/assessment/type/${type}`, getAuthHeaders());
    if (response.data.success) {
      return response.data.assessments;
    }
    return [];
  } catch (error) {
    console.error("Error getting assessments by type:", error);
    return [];
  }
};

// =============== Dashboard Stats ===============

export const calculateDashboardStats = async () => {
  try {
    const [statsResponse, moodsResponse, assessmentsResponse] = await Promise.all([
      api.get("/api/user/stats", getAuthHeaders()),
      api.get("/api/mood/recent/3", getAuthHeaders()),
      api.get("/api/assessment", getAuthHeaders()),
    ]);

    const stats = statsResponse.data.success
      ? statsResponse.data.stats
      : {
          moodAverage: 0,
          energyLevel: 0,
          stressLevel: 0,
          totalEntries: 0,
          totalAssessments: 0,
        };

    const recentMoods = moodsResponse.data.success
      ? formatRecentMoods(moodsResponse.data.moodEntries)
      : [];

    const assessments = assessmentsResponse.data.success
      ? assessmentsResponse.data.assessments.slice(0, 5)
      : [];

    return {
      ...stats,
      recentMoods,
      assessmentHistory: formatAssessmentHistory(assessments),
    };
  } catch (error) {
    console.error("Error calculating dashboard stats:", error);
    return {
      moodAverage: 0,
      energyLevel: 0,
      stressLevel: 0,
      totalEntries: 0,
      totalAssessments: 0,
      recentMoods: [],
      assessmentHistory: [],
    };
  }
};

// Helper to format mood entries for display
const formatRecentMoods = (entries) => {
  const moodEmojis = {
    1: "😢",
    2: "😔",
    3: "😐",
    4: "🙂",
    5: "😊",
    6: "😄",
    7: "😍",
    8: "🤩",
    9: "🎉",
    10: "☀️",
  };

  return entries.map((entry) => ({
    id: entry.id,
    mood: `${entry.mood}/10`,
    emoji: moodEmojis[entry.mood] || "😐",
    energy: `${entry.energy}/10`,
    stress: `${entry.stress}/10`,
    date: entry.date,
    time: entry.time,
    description: entry.description || "No description",
  }));
};

// Helper to format assessment history
const formatAssessmentHistory = (assessments) => {
  return assessments.map((assessment) => ({
    type: getAssessmentDisplayName(assessment.type),
    date: assessment.date,
    status: assessment.status,
  }));
};

// Map assessment type → display name
const getAssessmentDisplayName = (type) => {
  const displayNames = {
    big_five_personality: "Big Five Assessment",
    depression_screening: "Depression Screening",
    anxiety_screening: "Anxiety Assessment",
    stress_evaluation: "Stress Evaluation",
  };
  return displayNames[type] || type;
};

// =============== User Data Functions ===============

export const getUserHistory = async () => {
  try {
    const response = await api.get("/api/user/history", getAuthHeaders());
    if (response.data.success) {
      return response.data.history;
    }
    return null;
  } catch (error) {
    console.error("Error getting user history:", error);
    return null;
  }
};

export const clearAllData = async () => {
  try {
    const response = await api.delete("/api/user/data", getAuthHeaders());
    return response.data.success || false;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
};

export const exportData = async () => {
  try {
    const history = await getUserHistory();
    if (history) {
      const data = {
        moodEntries: history.moodEntries,
        assessments: history.assessments,
        userInfo: history.userInfo,
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    }
    return null;
  } catch (error) {
    console.error("Error exporting data:", error);
    return null;
  }
};
