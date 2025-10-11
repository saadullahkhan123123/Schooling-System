import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Avatar, CircularProgress, IconButton } from '@mui/material';
import { Edit as EditIcon, Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

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
        setUser({ username: storedUser.username || '', email: storedUser.email || '' });
      } catch (err) {
        console.error('Error fetching user:', err);
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
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...user, password: password || undefined }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile.');
      }

      const updatedData = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedData));
      setUser({ username: updatedData.username, email: updatedData.email });
      setPassword('');
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
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
    <Box className="w-full max-w-2xl mx-auto mt-8">
      <Card className="rounded-xl shadow-lg">
        <CardContent className="p-8">
          <Box className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4 bg-[#00335E] text-white text-4xl">
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography className="text-2xl font-bold text-[#00335E]">{user.username}</Typography>
            <Typography className="text-gray-600">{user.email}</Typography>
          </Box>

          {error && (
            <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
              <Typography>{error}</Typography>
              <IconButton size="small" onClick={() => setError('')}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          {success && (
            <Box className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
              <Typography>{success}</Typography>
              <IconButton size="small" onClick={() => setSuccess('')}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <TextField
              fullWidth
              label="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton type="button" onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="bg-[#00335E] hover:bg-[#002244] text-white py-2 rounded-xl"
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
