import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Zap, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Target,
  Clock,
  Brain,
  Activity,
  BarChart3,
  Flame,
  Star,
  ChevronRight
} from 'lucide-react';
import Card from './UI/Card';
import Button from './UI/Button';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState({});
  const [showInsightModal, setShowInsightModal] = useState(false);

  // Load dashboard data
  const loadDashboardData = () => {
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
    const goals = JSON.parse(localStorage.getItem('weeklyGoals') || '{}');
    
    setAchievements(userAchievements);
    setWeeklyGoals(goals);
    
    return { moodEntries, assessmentHistory };
  };

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    const { moodEntries } = loadDashboardData();
    
    if (moodEntries.length === 0) {
      return {
        averageMood: 0,
        averageEnergy: 0,
        averageStress: 0,
        totalEntries: 0,
        weeklyChange: 0,
        moodTrend: [],
        energyTrend: [],
        stressTrend: []
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentEntries = moodEntries.filter(entry => new Date(entry.date) >= weekAgo);
    
    const averageMood = Math.round(moodEntries.reduce((acc, entry) => acc + entry.mood, 0) / moodEntries.length * 10) / 10;
    const averageEnergy = Math.round(moodEntries.reduce((acc, entry) => acc + entry.energy, 0) / moodEntries.length * 10) / 10;
    const averageStress = Math.round(moodEntries.reduce((acc, entry) => acc + entry.stress, 0) / moodEntries.length * 10) / 10;
    
    // Calculate weekly change
    const thisWeekAvg = recentEntries.length > 0 
      ? recentEntries.reduce((acc, entry) => acc + entry.mood, 0) / recentEntries.length
      : averageMood;
    
    const weeklyChange = thisWeekAvg - averageMood;
    
    // Generate trend data for the last 7 days
    const moodTrend = [];
    const energyTrend = [];
    const stressTrend = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEntries = moodEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === date.toDateString();
      });
      
      if (dayEntries.length > 0) {
        const dayAvgMood = dayEntries.reduce((acc, entry) => acc + entry.mood, 0) / dayEntries.length;
        const dayAvgEnergy = dayEntries.reduce((acc, entry) => acc + entry.energy, 0) / dayEntries.length;
        const dayAvgStress = dayEntries.reduce((acc, entry) => acc + entry.stress, 0) / dayEntries.length;
        
        moodTrend.push(dayAvgMood);
        energyTrend.push(dayAvgEnergy);
        stressTrend.push(dayAvgStress);
      } else {
        moodTrend.push(null);
        energyTrend.push(null);
        stressTrend.push(null);
      }
    }

    return {
      averageMood,
      averageEnergy,
      averageStress,
      totalEntries: moodEntries.length,
      weeklyChange,
      moodTrend,
      energyTrend,
      stressTrend
    };
  }, []);

  // Calculate current streak
  useEffect(() => {
    const { moodEntries } = loadDashboardData();
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasEntry = moodEntries.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  }, []);

  // Mini Chart Component
  const MiniChart = ({ data, color, height = 40 }) => {
    if (!data || data.length === 0) return <div className="mini-chart-empty">No data</div>;
    
    const validData = data.filter(d => d !== null);
    const min = Math.min(...validData);
    const max = Math.max(...validData);
    const range = max - min || 1;
    
    return (
      <div className="mini-chart" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 40">
          <polyline
            points={data.map((value, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = value !== null ? 40 - ((value - min) / range) * 35 : null;
              return y !== null ? `${x},${y}` : null;
            }).filter(Boolean).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((value, index) => {
            if (value === null) return null;
            const x = (index / (data.length - 1)) * 100;
            const y = 40 - ((value - min) / range) * 35;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // Progress Ring Component
  const ProgressRing = ({ percentage, size = 60, strokeWidth = 4, color = "#667eea" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="progress-ring">
        <svg width={size} height={size}>
          <circle
            stroke="rgba(0,0,0,0.1)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        <div className="progress-ring-text">
          {Math.round(percentage)}%
        </div>
      </div>
    );
  };

  const getTrendIcon = (change) => {
    if (change > 0.2) return <TrendingUp className="trend-icon trend-up" />;
    if (change < -0.2) return <TrendingDown className="trend-icon trend-down" />;
    return <Activity className="trend-icon trend-stable" />;
  };

  const getInsightMessage = () => {
    const { averageMood, averageEnergy, averageStress } = moodStats;
    
    if (averageMood < 2.5) {
      return {
        type: 'concern',
        title: 'Low Mood Detected',
        message: 'Your recent mood levels suggest you might benefit from additional support. Consider reaching out to a mental health professional.',
        action: 'View Resources'
      };
    } else if (averageStress > 3.5) {
      return {
        type: 'warning',
        title: 'High Stress Levels',
        message: 'Your stress levels have been elevated. Try incorporating relaxation techniques into your daily routine.',
        action: 'Stress Management Tips'
      };
    } else if (currentStreak >= 7) {
      return {
        type: 'success',
        title: 'Amazing Consistency!',
        message: `You've tracked your mood for ${currentStreak} days straight! Keep up the great work.`,
        action: 'View Achievements'
      };
    } else {
      return {
        type: 'info',
        title: 'Keep Growing',
        message: 'Regular mood tracking helps build self-awareness. Try to log your mood daily for the best insights.',
        action: 'Set Reminders'
      };
    }
  };

  const insight = getInsightMessage();

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Your Mental Health Journey</h1>
              <p>Track your progress and discover insights about your wellbeing</p>
            </div>
            <div className="header-actions">
              <Button 
                variant="ghost" 
                size="large"
                icon={<Brain />}
                onClick={() => navigate('/personality')}
              >
                Take Assessment
              </Button>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <section className="metrics-section">
          <div className="metrics-grid">
            <Card variant="stat" className="metric-card">
              <Card.Icon variant="mood">
                <Heart />
              </Card.Icon>
              <div className="metric-content">
                <div className="metric-value">{moodStats.averageMood.toFixed(1)}</div>
                <div className="metric-label">Average Mood</div>
                <div className="metric-trend">
                  {getTrendIcon(moodStats.weeklyChange)}
                  <span className="trend-text">
                    {moodStats.weeklyChange > 0 ? '+' : ''}{moodStats.weeklyChange.toFixed(1)} this week
                  </span>
                </div>
                <MiniChart data={moodStats.moodTrend} color="#667eea" />
              </div>
            </Card>

            <Card variant="stat" className="metric-card">
              <Card.Icon variant="energy">
                <Zap />
              </Card.Icon>
              <div className="metric-content">
                <div className="metric-value">{moodStats.averageEnergy.toFixed(1)}</div>
                <div className="metric-label">Energy Level</div>
                <div className="metric-trend">
                  <Activity className="trend-icon trend-stable" />
                  <span className="trend-text">Stable</span>
                </div>
                <MiniChart data={moodStats.energyTrend} color="#f59e0b" />
              </div>
            </Card>

            <Card variant="stat" className="metric-card">
              <Card.Icon variant="stress">
                <AlertTriangle />
              </Card.Icon>
              <div className="metric-content">
                <div className="metric-value">{moodStats.averageStress.toFixed(1)}</div>
                <div className="metric-label">Stress Level</div>
                <div className="metric-trend">
                  <Activity className="trend-icon trend-stable" />
                  <span className="trend-text">Monitor</span>
                </div>
                <MiniChart data={moodStats.stressTrend} color="#ef4444" />
              </div>
            </Card>

            <Card variant="stat" className="metric-card">
              <Card.Icon variant="entries">
                <Calendar />
              </Card.Icon>
              <div className="metric-content">
                <div className="metric-value">{moodStats.totalEntries}</div>
                <div className="metric-label">Total Entries</div>
                <div className="metric-trend">
                  <Flame className="trend-icon" style={{ color: '#f97316' }} />
                  <span className="trend-text">{currentStreak} day streak</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Progress & Goals */}
        <section className="progress-section">
          <div className="progress-grid">
            <Card className="progress-card">
              <Card.Header>
                <Card.Title level={3}>Weekly Progress</Card.Title>
                <Card.Subtitle>Your consistency this week</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <div className="progress-stats">
                  <div className="progress-item">
                    <div className="progress-item-header">
                      <span>Mood Tracking</span>
                      <span>5/7 days</span>
                    </div>
                    <ProgressRing percentage={71} color="#667eea" />
                  </div>
                  <div className="progress-item">
                    <div className="progress-item-header">
                      <span>Self-Reflection</span>
                      <span>3/5 sessions</span>
                    </div>
                    <ProgressRing percentage={60} color="#10b981" />
                  </div>
                  <div className="progress-item">
                    <div className="progress-item-header">
                      <span>Stress Management</span>
                      <span>2/3 activities</span>
                    </div>
                    <ProgressRing percentage={67} color="#f59e0b" />
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="achievements-card">
              <Card.Header>
                <Card.Title level={3}>Achievements</Card.Title>
                <Card.Subtitle>Milestones you've unlocked</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <div className="achievements-list">
                  <div className="achievement-item unlocked">
                    <Award className="achievement-icon" />
                    <div className="achievement-content">
                      <h4>First Steps</h4>
                      <p>Completed your first mood entry</p>
                    </div>
                    <Star className="achievement-star" />
                  </div>
                  <div className="achievement-item unlocked">
                    <Flame className="achievement-icon" />
                    <div className="achievement-content">
                      <h4>Week Warrior</h4>
                      <p>Tracked mood for 7 consecutive days</p>
                    </div>
                    <Star className="achievement-star" />
                  </div>
                  <div className="achievement-item locked">
                    <Target className="achievement-icon" />
                    <div className="achievement-content">
                      <h4>Self-Aware</h4>
                      <p>Complete 3 different assessments</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </section>

        {/* Personalized Insight */}
        <section className="insight-section">
          <Card className={`insight-card insight-card--${insight.type}`}>
            <div className="insight-content">
              <div className="insight-header">
                <div className="insight-icon">
                  {insight.type === 'success' && <Award />}
                  {insight.type === 'warning' && <AlertTriangle />}
                  {insight.type === 'concern' && <Heart />}
                  {insight.type === 'info' && <Brain />}
                </div>
                <div className="insight-text">
                  <h3>{insight.title}</h3>
                  <p>{insight.message}</p>
                </div>
              </div>
              <Button variant="secondary" size="medium" iconPosition="right" icon={<ChevronRight />}>
                {insight.action}
              </Button>
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <div className="actions-grid">
            <Card className="action-card" onClick={() => navigate('/mood')}>
              <Card.Icon variant="mood">
                <Heart />
              </Card.Icon>
              <Card.Title level={4}>Track Mood</Card.Title>
              <Card.Subtitle>Log your current emotional state</Card.Subtitle>
              <ChevronRight className="action-arrow" />
            </Card>

            <Card className="action-card" onClick={() => navigate('/personality')}>
              <Card.Icon variant="primary">
                <Brain />
              </Card.Icon>
              <Card.Title level={4}>Personality Test</Card.Title>
              <Card.Subtitle>Discover your Big Five traits</Card.Subtitle>
              <ChevronRight className="action-arrow" />
            </Card>

            <Card className="action-card" onClick={() => navigate('/screening')}>
              <Card.Icon variant="info">
                <BarChart3 />
              </Card.Icon>
              <Card.Title level={4}>Mental Health Screening</Card.Title>
              <Card.Subtitle>Assess depression, anxiety & stress</Card.Subtitle>
              <ChevronRight className="action-arrow" />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnhancedDashboard;