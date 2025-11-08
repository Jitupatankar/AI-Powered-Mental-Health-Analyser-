import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PersonalityAssessment from './pages/PersonalityAssessment';
import MoodTracker from './pages/MoodTracker';
import MentalHealthScreening from './pages/MentalHealthScreening';
import DepressionScreening from './pages/DepressionScreening';
import AnxietyScreening from './pages/AnxietyScreening';
import StressScreening from './pages/StressScreening';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/personality" element={
              <ProtectedRoute>
                <PersonalityAssessment />
              </ProtectedRoute>
            } />
            <Route path="/mood" element={
              <ProtectedRoute>
                <MoodTracker />
              </ProtectedRoute>
            } />
            <Route path="/screening" element={
              <ProtectedRoute>
                <MentalHealthScreening />
              </ProtectedRoute>
            } />
            <Route path="/screening/depression" element={
              <ProtectedRoute>
                <DepressionScreening />
              </ProtectedRoute>
            } />
            <Route path="/screening/anxiety" element={
              <ProtectedRoute>
                <AnxietyScreening />
              </ProtectedRoute>
            } />
            <Route path="/screening/stress" element={
              <ProtectedRoute>
                <StressScreening />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;