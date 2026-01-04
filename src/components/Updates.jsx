import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Grid, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Fade, CircularProgress, Alert
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Announcement as AnnouncementIcon, CalendarToday as CalendarTodayIcon,
  Close as CloseIcon, PriorityHigh as PriorityHighIcon
} from '@mui/icons-material';
import { API_BASE_URL as BASE_URL } from '../config/api';

const API_BASE_URL = `${BASE_URL}/api`;

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '', message: '', type: 'general',
    targetAudience: 'all', targetClass: 'all', priority: 'medium', date: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'student');
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      
      const res = await fetch(`${API_BASE_URL}/updates?${params}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch updates');
      const data = await res.json();
      setUpdates(data.updates || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUpdates(); }, [filterType]);

  const handleOpenDialog = (update = null) => {
    if (update) {
      setEditingUpdate(update);
      setFormData({
        title: update.title || '',
        message: update.message || '',
        type: update.type || 'general',
        targetAudience: update.targetAudience || 'all',
        targetClass: update.targetClass || 'all',
        priority: update.priority || 'medium',
        date: update.date ? new Date(update.date).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingUpdate(null);
      setFormData({
        title: '', message: '', type: 'general',
        targetAudience: 'all', targetClass: 'all', priority: 'medium', date: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUpdate(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const url = editingUpdate 
        ? `${API_BASE_URL}/updates/${editingUpdate._id}`
        : `${API_BASE_URL}/updates`;
      
      const method = editingUpdate ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save update');
      }

      setSuccess(editingUpdate ? 'Update updated successfully!' : 'Update created successfully!');
      handleCloseDialog();
      fetchUpdates();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/updates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!res.ok) throw new Error('Failed to delete update');
      
      setSuccess('Update deleted successfully!');
      fetchUpdates();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'test': return '📝';
      case 'class-off': return '🚫';
      case 'announcement': return '📢';
      default: return 'ℹ️';
    }
  };

  const classes = [
    "Pre-K", "Kindergarten", "Class 1", "Class 2", "Class 3",
    "Class 4", "Class 5", "Class 6", "Class 7", "Class 8",
    "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: '#00335E',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}>
            {userRole === 'student' ? 'Updates & Announcements' : 'Manage Updates'}
          </Typography>
          
          {(userRole === 'admin' || userRole === 'teacher') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: '#C99228',
                color: '#00335E',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#e6b043' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1.5, sm: 2 }
              }}
            >
              Add Update
            </Button>
          )}
        </Box>

        {/* Filters (Admin/Teacher only) */}
        {(userRole === 'admin' || userRole === 'teacher') && (
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
                <MenuItem value="test">Test</MenuItem>
                <MenuItem value="class-off">Class Off</MenuItem>
                <MenuItem value="general">General</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Updates List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : updates.length === 0 ? (
          <Card>
            <CardContent>
              <Typography align="center" color="textSecondary">
                No updates available
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {updates.map((update) => (
              <Grid item xs={12} sm={6} md={4} key={update._id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                          {getTypeIcon(update.type)} {update.title}
                        </Typography>
                      </Box>
                      <Chip 
                        label={update.priority} 
                        size="small" 
                        color={getPriorityColor(update.priority)}
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      mb: 1.5,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {update.message}
                    </Typography>

                    {update.date && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                        <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {new Date(update.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {new Date(update.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  {(userRole === 'admin' || userRole === 'teacher') && (
                    <Box sx={{ p: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton size="small" onClick={() => handleOpenDialog(update)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(update._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              width: { xs: '95%', sm: '100%' },
              maxWidth: '500px',
              m: { xs: 1 }
            }
          }}
        >
          <DialogTitle sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            pb: 1
          }}>
            {editingUpdate ? 'Edit Update' : 'Add New Update'}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="announcement">Announcement</MenuItem>
                    <MenuItem value="test">Test</MenuItem>
                    <MenuItem value="class-off">Class Off</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    label="Target Audience"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="student">Students</MenuItem>
                    <MenuItem value="teacher">Teachers</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Target Class</InputLabel>
                  <Select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    label="Target Class"
                  >
                    <MenuItem value="all">All Classes</MenuItem>
                    {classes.map(c => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Date (Optional)"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={handleCloseDialog} size="small">Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ backgroundColor: '#C99228', color: '#00335E' }}
              size="small"
            >
              {editingUpdate ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Updates;

