import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Homework from "./components/Homework";
import FeeStatus from "./components/FeeStatus";
import Attendance from "./components/Attendance";
import AddStudentForm from "./components/AddStudentForm";
import SearchStudent from "./components/SearchStudent";
import Profile from "./components/Profile";

// ✅ Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* ✅ Navbar only after login */}
        {isAuthenticated && <Navbar />}

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            {/* 🔐 Public Route */}
            <Route
              path="/login"
              element={<LoginPage onLogin={() => window.location.reload()} />}
            />

            {/* 🏠 Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* 🧑 Add Student */}
            <Route
              path="/add-student"
              element={
                <PrivateRoute>
                  <AddStudentForm />
                </PrivateRoute>
              }
            />

            {/* 📚 Homework */}
            <Route
              path="/homework"
              element={
                <PrivateRoute>
                  <Homework />
                </PrivateRoute>
              }
            />

            {/* 💰 Fee Status */}
            <Route
              path="/fees"
              element={
                <PrivateRoute>
                  <FeeStatus />
                </PrivateRoute>
              }
            />

            {/* 📅 Attendance */}
            <Route
              path="/attendance"
              element={
                <PrivateRoute>
                  <Attendance />
                </PrivateRoute>
              }
            />

            {/* 🔍 Search Student */}
            <Route
              path="/search-student"
              element={
                <PrivateRoute>
                  <SearchStudent />
                </PrivateRoute>
              }
            />

            {/* 👤 Profile */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* 🚪 Redirect unknown routes */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
