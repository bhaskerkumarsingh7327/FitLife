import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Onboarding from './components/Onboarding.jsx';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.js';
import DayWorkout from './components/DayWorkout.jsx';
import ExpertGuidance from './components/ExpertGuidance.jsx';
import ArticleDetail from './components/ArticleDetail.jsx';
import LiveSession from './components/LiveSession.jsx';
import ProgressReport from './components/ProgressReport.jsx';
import AICoach from './components/AICoach.jsx';
import Nutrition from './components/Nutrition.jsx';
import ForgotPassword from './components/ForgotPassword.js';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workout/:day" element={<DayWorkout />} />
          <Route path="/guidance" element={<ExpertGuidance />} />
          <Route path="/guidance/:id" element={<ArticleDetail />} />
          <Route path="/live-session" element={<LiveSession />} />
          <Route path="/progress" element={<ProgressReport />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/nutrition" element={<Nutrition />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
