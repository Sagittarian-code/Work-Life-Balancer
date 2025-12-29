import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Layout } from './components/Layout';
import useStore from './store/useStore';

// Pages
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import RemindersPage from './pages/RemindersPage';
import JournalPage from './pages/JournalPage';
import WellnessPage from './pages/WellnessPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { isAuthenticated } = useStore();

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/onboarding"
            element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/" replace />}
          />

          {/* Protected Routes with Layout */}
          <Route
            path="/*"
            element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="wellness" element={<WellnessPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>

        <Toaster position="top-right" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;