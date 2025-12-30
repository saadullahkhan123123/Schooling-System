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
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Close as CloseIcon,
  PhotoCamera,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { API_BASE_URL } from '../config/api';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', fullName: '', profileImage: '' });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const getAuthHeadersFormData = () => {
    const token = localStorage.getItem('token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
          username: storedUser.username || '',
          email: storedUser.email || '',
          fullName: storedUser.fullName || storedUser.username || '',
          profileImage: storedUser.profileImage || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const res = await fetch(`${API_BASE_URL}/auth/profile/image`, {
        method: 'POST',
        headers: getAuthHeadersFormData(),
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setUser({ ...user, profileImage: data.profileImage });
      const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), profileImage: data.profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('✅ Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser({ ...user, username: data.user.username, email: data.user.email, fullName: data.user.fullName });
      setSuccess('✅ Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setOtpSent(true);
      
      // Student doesn't receive OTP - admin receives it
      setSuccess('✅ Password reset request sent to admin. Please contact admin to get your OTP.');
      setTimeout(() => setSuccess(''), 10000);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send password reset request.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setUpdating(true);
    setError('');

    // Debug: Log what we're sending
    console.log('🔐 Sending OTP reset request...');
    console.log('📝 OTP being sent:', otp);
    console.log('📝 OTP length:', otp?.length);
    console.log('📝 OTP type:', typeof otp);

    try {
      const requestBody = { otp: String(otp).trim(), newPassword };
      console.log('📦 Request body:', requestBody);
      
      const res = await fetch(`${API_BASE_URL}/auth/reset-password-otp`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setSuccess('✅ Password reset successfully!');
      setOtpDialogOpen(false);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpSent(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password.');
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
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user.profileImage || undefined}
                className="w-24 h-24 mb-3 text-white text-4xl"
                sx={{ bgcolor: '#00335E', width: 96, height: 96 }}
              >
                {user.profileImage ? null : (user.fullName || user.username)?.charAt(0)?.toUpperCase()}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#C99228',
                  color: 'white',
                  '&:hover': { bgcolor: '#b07d1a' },
                }}
                component="label"
                size="small"
              >
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </IconButton>
            </Box>
            <Typography variant="h5" className="font-bold text-[#00335E]">
              {user.fullName || user.username}
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
              label="Full Name"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              required
            />

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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
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

          {/* Password Reset Section */}
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#00335E', fontWeight: 600 }}>
              <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Reset Password
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setOtpDialogOpen(true);
                if (!otpSent) {
                  handleSendOTP();
                }
              }}
              sx={{
                borderColor: '#00335E',
                color: '#00335E',
                '&:hover': { borderColor: '#002244', backgroundColor: '#00335E10' },
                fontWeight: 'bold',
              }}
            >
              Request Password Reset (Admin will provide OTP)
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {otpSent && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Password reset request sent to admin. Admin will provide you with the OTP. Please enter the OTP below once you receive it from admin.
              </Typography>
            </Alert>
          )}
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            margin="normal"
            placeholder="Enter 6-digit OTP from admin"
            inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
            helperText={otpSent ? "Enter the 6-digit OTP provided by admin" : "Click 'Reset Password' button first to send request to admin"}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" disabled={updating}>
            {updating ? 'Resetting...' : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
