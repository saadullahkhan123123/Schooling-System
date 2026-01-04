import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
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

// ✅ Role-based Route Component
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "student";
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect students to attendance, others to dashboard
    return <Navigate to={userRole === "student" ? "/attendance" : "/dashboard"} replace />;
  }
  
  return children;
};

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* ✅ Navbar only after login */}
        {isAuthenticated && <Navbar />}

        <Box component="main" sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Routes>
            {/* 🔐 Public Route */}
            <Route
              path="/login"
              element={<LoginPage onLogin={() => window.location.reload()} />}
            />

            {/* 🏠 Dashboard - Admin/Teacher only */}
            <Route
              path="/dashboard"
              element={
                <RoleBasedRoute allowedRoles={["admin", "teacher"]}>
                  <Dashboard />
                </RoleBasedRoute>
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

            {/* 📚 Homework - All roles (students see only their homework) */}
            <Route
              path="/homework"
              element={
                <PrivateRoute>
                  <Homework />
                </PrivateRoute>
              }
            />

            {/* 💰 Fee Status - All roles (students see only their fees) */}
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
                  to={isAuthenticated ? (() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    return user.role === "student" ? "/attendance" : "/dashboard";
                  })() : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </Box>
      </div>
    </Router>
  );
};

export default App;
