import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateDashboardStats } from '../utils/dataStorage';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    moodAverage: 8.0,
    energyLevel: 8.0,
    stressLevel: 3.7,
    totalEntries: 3,
    recentMoods: [],
    assessmentHistory: []
  });

  useEffect(() => {
    // Load real data from localStorage
    const stats = calculateDashboardStats();
    if (stats.totalEntries > 0 || stats.assessmentHistory.length > 0) {
      setDashboardData(stats);
    }
  }, []);

  const quickActions = [
    {
      title: 'Track Mood',
      description: 'Log your current mood and energy',
      icon: '💝',
      link: '/mood',
      color: 'icon-mood'
    },
    {
      title: 'Personality Test',
      description: 'Discover your personality profile',
      icon: '⚙️',
      link: '/personality',
      color: 'icon-energy'
    },
    {
      title: 'Mental Health Screening',
      description: 'Assess depression, anxiety, or stress',
      icon: '📊',
      link: '/screening',
      color: 'icon-depression'
    }
  ];

  const insights = [
    {
      type: 'Consistency Matters',
      title: 'Consistency Matters',
      content: 'Regular mood tracking helps identify patterns and triggers.',
      color: 'tip-primary'
    },
    {
      type: 'Self-Awareness',
      title: 'Self-Awareness',
      content: 'Understanding your personality can improve relationships and decision-making.',
      color: 'tip-success'
    },
    {
      type: 'Professional Support',
      title: 'Professional Support',
      content: 'Consider speaking with a mental health professional for personalized guidance.',
      color: 'tip-warning'
    }
  ];

  const supportResources = [
    {
      name: 'Crisis Support',
      contact: 'National Crisis Text Line: Text HOME to 741741'
    },
    {
      name: 'Suicide Prevention',
      contact: 'National Lifeline: 988'
    },
    {
      name: 'Mental Health',
      contact: 'SAMHSA Helpline: 1-800-662-4357'
    }
  ];

  const moodTrend = dashboardData.moodAverage >= 7 ? 'stable' : 
                   dashboardData.moodAverage >= 5 ? 'up' : 'down';
  
  const stressTrend = dashboardData.stressLevel <= 4 ? 'stable' :
                     dashboardData.stressLevel <= 6 ? 'up' : 'down';

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '0' }}>
            <UserMenu />
          </div>
          <h1 className="page-title">Mental Health Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! Here's your mental health journey overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="card-grid">
          <div className="card stat-card">
            <div className="card-icon icon-mood">💝</div>
            <div className="stat-label">Mood Average (7d)</div>
            <div className="stat-value">{dashboardData.moodAverage.toFixed(1)}/10</div>
            <div className={`stat-trend trend-${moodTrend}`}>
              📈 Stable
            </div>
          </div>

          <div className="card stat-card">
            <div className="card-icon icon-energy">⚡</div>
            <div className="stat-label">Energy Level (7d)</div>
            <div className="stat-value">{dashboardData.energyLevel.toFixed(1)}/10</div>
            <div className="stat-trend trend-stable">
              📈 Stable
            </div>
          </div>

          <div className="card stat-card">
            <div className="card-icon icon-stress">⚠️</div>
            <div className="stat-label">Stress Level (7d)</div>
            <div className="stat-value">{dashboardData.stressLevel.toFixed(1)}/10</div>
            <div className={`stat-trend trend-${stressTrend}`}>
              ⚠️
            </div>
          </div>

          <div className="card stat-card">
            <div className="card-icon icon-entries">📝</div>
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{dashboardData.totalEntries}</div>
            <div className="stat-trend trend-stable">
              📝
            </div>
          </div>
        </div>

        <div className="card-grid-2">
          {/* Recent Mood Entries */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>Recent Mood Entries</h3>
              <Link to="/mood" className="btn btn-primary">+ Add Entry</Link>
            </div>
            
            <div>
              {dashboardData.recentMoods.map((entry) => (
                <div key={entry.id} className="mood-entry">
                  <div className="mood-info">
                    <span className="emoji" style={{ fontSize: '32px' }}>{entry.emoji}</span>
                    <div className="mood-details">
                      <h4>Mood: {entry.mood}</h4>
                      <div className="mood-meta">
                        <span>Energy: {entry.energy}</span>
                        <span>Stress: {entry.stress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mood-date">
                    <div>{entry.date}</div>
                    <div className="mood-time">{entry.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
            
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="btn btn-secondary btn-full" style={{ marginBottom: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}>
                <div className={`card-icon ${action.color}`} style={{ width: '40px', height: '40px', margin: '0', fontSize: '20px' }}>
                  {action.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>{action.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{action.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Assessment History */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Assessment History</h3>
          
          <div>
            <h4 style={{ color: '#667eea', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              👤 Personality Assessments
            </h4>
            {dashboardData.assessmentHistory
              .filter(item => item.type.includes('Big Five'))
              .map((assessment, index) => (
                <div key={index} className="mood-entry">
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>{assessment.type}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{assessment.date}</div>
                  </div>
                  <div style={{ color: '#8b5cf6', fontWeight: '500' }}>{assessment.status}</div>
                </div>
              ))}

            <h4 style={{ color: '#667eea', marginBottom: '16px', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Mental Health Screenings
            </h4>
            {dashboardData.assessmentHistory
              .filter(item => !item.type.includes('Big Five'))
              .map((assessment, index) => (
                <div key={index} className="mood-entry">
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>{assessment.type}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{assessment.date}</div>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: '500' }}>{assessment.status}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="card-grid-2">
          {/* Insights & Tips */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💡 Insights & Tips
            </h3>
            
            <div className="tips-grid">
              {insights.map((insight, index) => (
                <div key={index} className="tip-item">
                  <div className="tip-title">{insight.title}</div>
                  <div className="tip-content">{insight.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Resources */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
              📞 Support Resources
            </h3>
            
            <div>
              {supportResources.map((resource, index) => (
                <div key={index} className="support-resource">
                  <div>
                    <div className="resource-name">{resource.name}</div>
                  </div>
                  <div className="resource-contact">{resource.contact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;