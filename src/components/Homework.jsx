import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Grid, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Fade, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Assignment as AssignmentIcon, CalendarToday as CalendarTodayIcon,
  School as SchoolIcon, CheckCircle as CheckCircleIcon,
  Pending as PendingIcon, Bookmark as BookmarkIcon, Close as CloseIcon
} from '@mui/icons-material';
import { API_BASE_URL as BASE_URL } from '../config/api';

const API_BASE_URL = `${BASE_URL}/api`;

const Homework = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', class: '',
    dueDate: '', status: 'active',
    assignedDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('student');

  // Get user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'student');
  }, []);

  const classes = [
    "Pre-K", "Kindergarten", "Class 1", "Class 2", "Class 3",
    "Class 4", "Class 5", "Class 6", "Class 7", "Class 8",
    "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const subjects = [
    "Mathematics", "English", "Science", "Physics", "Chemistry",
    "Biology", "History", "Geography", "Computer Science", "Art",
    "Music", "Physical Education", "Social Studies", "Economics"
  ];

  const homeworkStatus = ["active", "pending", "done"];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Fetch homework
  const fetchHomework = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = user.role || 'student';
      
      // Students don't need filters - they only see their class homework
      const params = new URLSearchParams({
        ...(userRole !== 'student' && {
          class: filterClass !== 'all' ? filterClass : '',
          subject: filterSubject !== 'all' ? filterSubject : '',
          status: filterStatus !== 'all' ? filterStatus : '',
        })
      });
      
      const res = await fetch(`${API_BASE_URL}/homework?${params}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch homework');
      const data = await res.json();
      setHomeworkData(data.homeworks || data.homework || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHomework(); }, []);
  useEffect(() => {
    // Only apply filters for admin/teacher
    if (userRole !== 'student') {
      const debounce = setTimeout(fetchHomework, 300);
      return () => clearTimeout(debounce);
    }
  }, [filterClass, filterSubject, filterStatus, searchQuery, userRole]);

  const handleOpenDialog = (homework = null) => {
    if (homework) {
      setEditingHomework(homework);
      setFormData(homework);
    } else {
      setEditingHomework(null);
      setFormData({
        title: '', description: '', subject: '', class: '',
        dueDate: '', status: 'active',
        assignedDate: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingHomework ? `${API_BASE_URL}/homework/${editingHomework._id}` : `${API_BASE_URL}/homework`;
      const method = editingHomework ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save homework');
      setSuccess(editingHomework ? 'Homework updated!' : 'Homework added!');
      fetchHomework();
      handleCloseDialog();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/homework/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete homework');
      fetchHomework();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'done': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon />;
      case 'pending': return <PendingIcon />;
      case 'done': return <BookmarkIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <Fade in timeout={500}>
      <Box className="p-6">
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-[#00335E]">
            {userRole === 'student' ? '📚 My Homework' : '📚 Homework Management'}
          </Typography>
          {userRole !== 'student' && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="bg-[#C99228] text-white hover:bg-[#00335E] transition-colors rounded-lg px-4 py-2"
            >
              Add Homework
            </Button>
          )}
        </Box>

        {/* Filters - Only for Admin/Teacher */}
        {userRole !== 'student' && (
        <Grid container spacing={4} className="mb-6">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                label="Class"
              >
                <MenuItem value="all">All Classes</MenuItem>
                {classes.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                label="Subject"
              >
                <MenuItem value="all">All Subjects</MenuItem>
                {subjects.map(sub => <MenuItem key={sub} value={sub}>{sub}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                {homeworkStatus.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        )}

        {/* Homework List */}
        {loading ? (
          <Box className="flex justify-center py-10"><CircularProgress /></Box>
        ) : homeworkData.length === 0 ? (
          <Box className="text-center py-10 text-gray-400">No homework found</Box>
        ) : (
          <Grid container spacing={4}>
            {homeworkData.map(hw => (
              <Grid item xs={12} md={6} lg={4} key={hw._id}>
                <Card className="border border-gray-200 hover:shadow-lg transition-shadow rounded-lg">
                  <CardContent>
                    <Box className="flex justify-between items-start mb-2">
                      <Typography variant="h6" className="font-semibold">{hw.title}</Typography>
                      {userRole !== 'student' && (
                        <Box>
                          <IconButton onClick={() => handleOpenDialog(hw)}><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(hw._id)}><DeleteIcon /></IconButton>
                        </Box>
                      )}
                    </Box>
                    <Typography className="text-gray-600 mb-3">{hw.description}</Typography>
                    <Stack spacing={1}>
                      <Box className="flex items-center gap-2 text-gray-600">
                        <SchoolIcon fontSize="small" /> {hw.subject} • {hw.class}
                      </Box>
                      <Box className="flex items-center gap-2 text-gray-600">
                        <CalendarTodayIcon fontSize="small" /> Due: {new Date(hw.dueDate).toLocaleDateString()}
                      </Box>
                      <Chip icon={getStatusIcon(hw.status)} label={hw.status} color={getStatusColor(hw.status)} size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle className="bg-[#00335E] text-white">
            {editingHomework ? 'Edit Homework' : 'Add Homework'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4">
              {error && (
                <Box className="bg-red-100 p-2 rounded text-red-600 flex justify-between items-center">
                  <span>{error}</span>
                  <IconButton onClick={() => setError(null)}><CloseIcon /></IconButton>
                </Box>
              )}
              {success && (
                <Box className="bg-green-100 p-2 rounded text-green-700 flex justify-between items-center">
                  <span>{success}</span>
                  <IconButton onClick={() => setSuccess(null)}><CloseIcon /></IconButton>
                </Box>
              )}
              <TextField
                label="Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                      required
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      label="Class"
                    >
                      {classes.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      label="Subject"
                    >
                      {subjects.map(sub => <MenuItem key={sub} value={sub}>{sub}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Assigned Date"
                    fullWidth
                    required
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Due Date"
                    fullWidth
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  {homeworkStatus.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" className="bg-[#C99228] text-white hover:bg-[#00335E]">
                {editingHomework ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Homework;
