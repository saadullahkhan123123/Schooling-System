// components/DashboardContent.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Fade,
  Zoom,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:3001/api';

const DashboardContent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, activityRes, eventsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/dashboard/activities`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/dashboard/events`, { headers: getAuthHeaders() }),
      ]);

      if (!statsRes.ok || !activityRes.ok || !eventsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      const eventsData = await eventsRes.json();

      setStats(statsData);
      setRecentActivities(activityData);
      setEvents(eventsData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = stats
    ? [
        {
          title: 'Total Students',
          value: stats.totalStudents,
          change: '+12%',
          changeType: 'positive',
          icon: <PeopleIcon />,
          bgColor: 'linear-gradient(135deg, #00335E 0%, #1a4a73 100%)',
          trendIcon: <TrendingUpIcon2 sx={{ fontSize: 16 }} />,
        },
        {
          title: 'Pending Fees',
          value: stats.pendingFees,
          change: '-8%',
          changeType: 'negative',
          icon: <PaymentIcon />,
          bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          trendIcon: <TrendingDownIcon sx={{ fontSize: 16 }} />,
        },
        {
          title: "Today's Reports",
          value: stats.reportsToday,
          change: '+25%',
          changeType: 'positive',
          icon: <AssignmentIcon />,
          bgColor: 'linear-gradient(135deg, #4ECDC4 0%, #7EDDD3 100%)',
          trendIcon: <TrendingUpIcon2 sx={{ fontSize: 16 }} />,
        },
        {
          title: 'Active Staff',
          value: stats.activeStaff,
          change: '+2',
          changeType: 'neutral',
          icon: <TrendingUpIcon />,
          bgColor: 'linear-gradient(135deg, #c99228 0%, #d4a847 100%)',
          trendIcon: <TrendingUpIcon2 sx={{ fontSize: 16 }} />,
        },
      ]
    : [];

  return (
    <Fade in={isLoaded} timeout={800}>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00335E 0%, #1a4a73 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
          }}
        >
          Welcome back, Admin!
        </Typography>

        {loading ? (
          <Box className="flex justify-center py-10">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ my: 4 }}>
            {error}
          </Typography>
        ) : (
          <>
            {/* Stat Cards */}
            <Box
              sx={{
                width: '90%',
                mx: 'auto',
                mb: 4,
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {statCards.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: '1 1 calc(25% - 18px)',
                    minWidth: '250px',
                    '@media (max-width: 1200px)': {
                      flex: '1 1 calc(50% - 18px)',
                    },
                    '@media (max-width: 600px)': {
                      flex: '1 1 100%',
                    },
                  }}
                >
                  <Zoom in={isLoaded} timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      sx={{
                        background: stat.bgColor,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.4s',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Avatar
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                              width: 56,
                              height: 56,
                            }}
                          >
                            {stat.icon}
                          </Avatar>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {stat.trendIcon}
                            <Chip
                              label={stat.change}
                              size="small"
                              sx={{
                                backgroundColor:
                                  stat.changeType === 'positive'
                                    ? 'rgba(76, 175, 80, 0.3)'
                                    : stat.changeType === 'negative'
                                    ? 'rgba(244, 67, 54, 0.3)'
                                    : 'rgba(255, 255, 255, 0.3)',
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                          {stat.value}
                        </Typography>
                        <Typography>{stat.title}</Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Box>
              ))}
            </Box>

            <Grid container spacing={3}>
              {/* Recent Activity */}
              <Grid item xs={12} lg={8}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ backgroundColor: '#00335E', mr: 2 }}>
                          <SchoolIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Recent Activity
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <List>
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity, index) => (
                          <React.Fragment key={activity._id || index}>
                            <ListItem sx={{ px: 0, py: 2 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: '#C99228' }}>
                                  {activity.type === 'student_added' && <PersonAddIcon />}
                                  {activity.type === 'fee_paid' && <PaymentIcon />}
                                  {activity.type === 'homework_assigned' && <AssignmentIcon />}
                                  {activity.type === 'student_updated' && <CheckCircleIcon />}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={activity.message}
                                secondary={activity.time}
                                primaryTypographyProps={{ fontWeight: 600 }}
                              />
                            </ListItem>
                            {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                          </React.Fragment>
                        ))
                      ) : (
                        <Typography color="text.secondary">No recent activity</Typography>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Upcoming Events */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ borderRadius: 3, mb: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ backgroundColor: '#00335E', mr: 2 }}>
                        <ScheduleIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Upcoming Events
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      {events.length > 0 ? (
                        events.map((event, index) => (
                          <Box key={index} sx={{ p: 2, background: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {event.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {event.date}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography color="text.secondary">No upcoming events</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Fade>
  );
};

export default DashboardContent;
