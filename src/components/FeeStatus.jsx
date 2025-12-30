// components/FeeStatus.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { API_BASE_URL as BASE_URL } from '../config/api';

const API_BASE_URL = `${BASE_URL}/api`;

const FeeStatus = () => {
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  const fetchFeeData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = user.role || 'student';
      const userId = user._id || user.id;

      // Students fetch only their own fees
      const url = userRole === 'student' 
        ? `${API_BASE_URL}/fees/student/${userId}`
        : `${API_BASE_URL}/fees`;

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        if (res.status === 403) {
          throw new Error('You do not have permission to view fee data.');
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch fee data');
      }

      const data = await res.json();
      // If student, wrap single fee in array; if admin, use array directly
      const feesArray = userRole === 'student' 
        ? (Array.isArray(data) ? data : [data])
        : (Array.isArray(data) ? data : []);
      setFeesData(feesArray);
      setError('');
    } catch (err) {
      console.error('Fee data fetch error:', err);
      setError(err.message || 'Failed to fetch fee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Partial':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <PaymentIcon className="text-green-600" />;
      case 'Partial':
        return <ReceiptIcon className="text-yellow-600" />;
      case 'Pending':
        return <PaymentIcon className="text-red-600" />;
      default:
        return null;
    }
  };

  const filteredData = feesData.filter((student) => {
    const statusMatch = filterStatus === 'all' || student.status === filterStatus;
    const classMatch = filterClass === 'all' || student.class === filterClass;
    return statusMatch && classMatch;
  });

  const totalRevenue = feesData.reduce((sum, student) => sum + student.paidFees, 0);
  const totalPending = feesData.reduce((sum, student) => sum + student.pendingFees, 0);

  return (
    <Box className="space-y-6">
      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: 'rgba(201, 146, 40, 0.1)', border: '1px solid rgba(201, 146, 40, 0.2)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#c99228', fontWeight: 600 }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#b07d1a' }}>
                    ₹{totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <PaymentIcon sx={{ color: '#c99228', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 600 }}>
                    Pending Fees
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#b91c1c' }}>
                    ₹{totalPending.toLocaleString()}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ color: '#dc2626', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: 'rgba(0, 51, 94, 0.1)', border: '1px solid rgba(0, 51, 94, 0.2)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#00335E', fontWeight: 600 }}>
                    Total Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#002244' }}>
                    {feesData.length}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ color: '#00335E', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, color: '#00335E', fontWeight: 600 }}>
            Fee Status Management
          </Typography>
          <Box className="flex gap-4 items-center">
            <FormControl className="min-w-40">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="min-w-40">
              <InputLabel>Class</InputLabel>
              <Select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                label="Class"
              >
                <MenuItem value="all">All Classes</MenuItem>
                <MenuItem value="9th">9th</MenuItem>
                <MenuItem value="10th">10th</MenuItem>
                <MenuItem value="11th">11th</MenuItem>
                <MenuItem value="12th">12th</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Student Fee Status
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, color: 'error.main' }}>
              <ErrorOutlineIcon sx={{ mr: 1 }} />
              <Typography>{error}</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell>Student</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Total Fees</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((student) => (
                    <TableRow key={student._id || student.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {student.studentName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {student.rollNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{student.class} - {student.section}</TableCell>
                      <TableCell>₹{student.totalFees.toLocaleString()}</TableCell>
                      <TableCell>₹{student.paidFees.toLocaleString()}</TableCell>
                      <TableCell>₹{student.pendingFees.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(student.status)}
                          label={student.status}
                          color={getStatusColor(student.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{student.dueDate}</TableCell>
                      <TableCell>
                        <Box className="flex gap-1">
                          <Tooltip title="View Details">
                            <IconButton size="small" className="text-blue-600">
                              <ReceiptIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Record Payment">
                            <IconButton size="small" className="text-green-600">
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print Receipt">
                            <IconButton size="small" className="text-gray-600">
                              <PrintIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Report">
                            <IconButton size="small" className="text-purple-600">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeeStatus;
