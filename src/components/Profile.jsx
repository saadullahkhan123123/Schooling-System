import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
  Alert,
  Collapse
} from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'http://localhost:3001/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    const fetchUser = () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
          username: storedUser.username || '',
          email: storedUser.email || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...user, ...(password && { password }) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile.');

      localStorage.setItem('user', JSON.stringify(data));
      setUser({ username: data.username, email: data.email });
      setPassword('');
      setSuccess('✅ Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-20">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="w-full max-w-2xl mx-auto mt-8 p-4">
      <Card className="rounded-xl shadow-xl">
        <CardContent className="p-8 space-y-6">
          {/* Avatar + Basic Info */}
          <Box className="flex flex-col items-center mb-4">
            <Avatar
              className="w-24 h-24 mb-3 text-white text-4xl"
              sx={{ bgcolor: '#00335E' }}
            >
              {user.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h5" className="font-bold text-[#00335E]">
              {user.username}
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              {user.email}
            </Typography>
          </Box>

          {/* Alerts */}
          <Collapse in={Boolean(error)}>
            <Alert
              severity="error"
              action={
                <IconButton
                  size="small"
                  onClick={() => setError('')}
                  color="inherit"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          </Collapse>

          <Collapse in={Boolean(success)}>
            <Alert
              severity="success"
              action={
                <IconButton
                  size="small"
                  onClick={() => setSuccess('')}
                  color="inherit"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {success}
            </Alert>
          </Collapse>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <TextField
              fullWidth
              label="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#00335E',
                '&:hover': { backgroundColor: '#002244' },
                fontWeight: 'bold',
                py: 1.5,
                mt: 2,
              }}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
