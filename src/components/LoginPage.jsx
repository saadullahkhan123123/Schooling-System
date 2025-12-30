import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 👈 ADD THIS
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  Fade,
  InputAdornment,
  IconButton,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import myLogo from '../assets/my_logo.jpeg';

const BASE_URL = 'http://localhost:3000';

const LoginPage = () => {
  const navigate = useNavigate();   // 👈 INIT NAVIGATE

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    class: '',
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const endpoint = isLoginMode ? 'login' : 'register';
      const url = `${BASE_URL}/auth/${endpoint}`;
      console.log('🌐 Making request to:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          ...(isLoginMode ? {} : { 
            email: formData.email, 
            role: formData.role,
            ...(formData.role === 'student' && formData.class ? { class: formData.class } : {})
          }),
        }),
      });

      // Check if response exists and is ok
      if (!response) {
        throw new Error('Network error: Could not connect to server. Please make sure the backend is running.');
      }

      // Try to parse JSON, but handle errors if response is not JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Server error: Invalid response from server. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Server error: ${response.status} ${response.statusText}`);
      }

      if (isLoginMode) {
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('user', JSON.stringify(data.user || {}));

        // 👇 Redirect based on role
        const userRole = data.user?.role || 'student';
        if (userRole === 'student') {
          navigate('/attendance');
        } else {
          navigate('/dashboard');
        }
      } else {
        setAlert({ type: 'success', message: 'Registration successful! Please login.' });
        setIsLoginMode(true);
        setFormData({ username: '', email: '', password: '', role: 'student', class: '' });
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = err.message;
      
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Network error: Could not connect to server. Please make sure the backend is running on http://localhost:3000';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: Server is blocking the request. Please check backend CORS configuration.';
      } else if (!errorMessage || errorMessage === '') {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      console.error('Error:', err);
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center" sx={{ background: 'linear-gradient(135deg, #00335E 0%, #1a4a73 100%)' }}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card elevation={24} sx={{ borderRadius: 3, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <CardContent sx={{ p: 6 }}>
              {/* Logo Section */}
              <Box className="text-center mb-8">
                <Box sx={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00335E 0%, #C99228 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(0, 51, 94, 0.3)',
                  overflow: 'hidden', border: '3px solid #C99228'
                }}>
                  <img src={myLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#00335E', mb: 1 }}>
                  Baseline Academy
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {isLoginMode ? 'Admin Dashboard' : 'Create Account'}
                </Typography>
              </Box>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={handleChange('username')}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {!isLoginMode && (
                  <>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      select
                      label="Role"
                      value={formData.role}
                      onChange={handleChange('role')}
                      required
                      sx={{ mb: 3 }}
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="teacher">Teacher</MenuItem>
                    </TextField>
                    {formData.role === 'student' && (
                      <TextField
                        fullWidth
                        select
                        label="Class"
                        value={formData.class}
                        onChange={handleChange('class')}
                        required
                        sx={{ mb: 3 }}
                      >
                        <MenuItem value="Pre-K">Pre-K</MenuItem>
                        <MenuItem value="Kindergarten">Kindergarten</MenuItem>
                        <MenuItem value="Class 1">Class 1</MenuItem>
                        <MenuItem value="Class 2">Class 2</MenuItem>
                        <MenuItem value="Class 3">Class 3</MenuItem>
                        <MenuItem value="Class 4">Class 4</MenuItem>
                        <MenuItem value="Class 5">Class 5</MenuItem>
                        <MenuItem value="Class 6">Class 6</MenuItem>
                        <MenuItem value="Class 7">Class 7</MenuItem>
                        <MenuItem value="Class 8">Class 8</MenuItem>
                        <MenuItem value="Class 9">Class 9</MenuItem>
                        <MenuItem value="Class 10">Class 10</MenuItem>
                        <MenuItem value="Class 11">Class 11</MenuItem>
                        <MenuItem value="Class 12">Class 12</MenuItem>
                      </TextField>
                    )}
                  </>
                )}

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  sx={{ mb: 4 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 2,
                    fontWeight: 600,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #00335E 0%, #C99228 100%)',
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : isLoginMode ? 'Sign In' : 'Create Account'}
                </Button>

                {alert.message && (
                  <Fade in>
                    <Alert severity={alert.type} sx={{ mt: 3, borderRadius: 2 }}>
                      {alert.message}
                    </Alert>
                  </Fade>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
                  </Typography>
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => {
                      setIsLoginMode((prev) => !prev);
                      setAlert({ type: '', message: '' });
                      setFormData({ username: '', email: '', password: '', role: 'student', class: '' });
                    }}
                    disabled={isLoading}
                    sx={{ color: '#00335E', fontWeight: 600 }}
                  >
                    {isLoginMode ? 'Create Account' : 'Sign In'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
