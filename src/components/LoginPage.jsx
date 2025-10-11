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

const BASE_URL = 'http://localhost:3001';

const LoginPage = () => {
  const navigate = useNavigate();   // 👈 INIT NAVIGATE

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
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
      const response = await fetch(`${BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          ...(isLoginMode ? {} : { email: formData.email, role: formData.role }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      if (isLoginMode) {
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('user', JSON.stringify(data.user || {}));

        // 👇 Redirect to Dashboard
        navigate('/dashboard');
      } else {
        setAlert({ type: 'success', message: 'Registration successful! Please login.' });
        setIsLoginMode(true);
        setFormData({ username: '', email: '', password: '', role: 'admin' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
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
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="teacher">Teacher</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                    </TextField>
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
                      setFormData({ username: '', email: '', password: '', role: 'admin' });
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
