import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homework from './components/Homework';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard'; // we will create a simple Dashboard
import Profile from './components/Profile'; // optional profile page

// Protected route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar visible only on private routes */}
        {localStorage.getItem('token') && <Navbar />}

        <div className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={() => window.location.reload()} />} />
            
            {/* Private routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/homework"
              element={
                <PrivateRoute>
                  <Homework />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
