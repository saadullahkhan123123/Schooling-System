// components/SearchStudent.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { API_BASE_URL as BASE_URL } from '../config/api';
const API_BASE_URL = `${BASE_URL}/api`;

const SearchStudent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSearchResults([]);

    try {
      const res = await fetch(
        `${API_BASE_URL}/students/search?query=${encodeURIComponent(searchTerm)}`,
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Search failed');

      setSearchResults(data.students || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleView = (student) => {
    console.log('📄 View student:', student);
    // TODO: navigate to view page or open modal
  };

  const handleEdit = (student) => {
    console.log('✏️ Edit student:', student);
    // TODO: navigate to edit form or open modal
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/students/${student._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      setSearchResults((prev) => prev.filter((s) => s._id !== student._id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#00335E' }}>
              Search Students
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Find and manage student records quickly and efficiently
          </Typography>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end' }}>
            <TextField
              fullWidth
              label="Search by Name, Roll Number, Class, or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #00335E 0%, #1a4a73 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002244 0%, #00335E 100%)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              {isSearching ? <CircularProgress size={22} color="inherit" /> : 'Search'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Search Results
              </Typography>
              <Chip
                label={`${searchResults.length} found`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Roll Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Section</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((student) => (
                    <TableRow
                      key={student._id}
                      hover
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{student.rollNumber}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                            {student.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {student.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={getStatusColor(student.status)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleView(student)}
                            disabled={isSearching}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(student)}
                            disabled={isSearching}
                            sx={{
                              color: 'success.main',
                              '&:hover': { backgroundColor: 'success.light', color: 'white' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(student)}
                            disabled={isSearching}
                            sx={{
                              color: 'error.main',
                              '&:hover': { backgroundColor: 'error.light', color: 'white' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {searchTerm && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No students found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No students found matching "{searchTerm}". Try different search terms.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SearchStudent;
