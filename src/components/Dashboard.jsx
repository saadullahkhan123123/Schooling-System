import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle as ActiveIcon,
  Pending as PendingIcon,
  Bookmark as DoneIcon,
  People as StudentIcon,
  CurrencyExchange as FeeIcon,
  MenuBook as HomeworkIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL as BASE_URL } from '../config/api';

const API_BASE_URL = `${BASE_URL}/api`;

// Animation variants for perfect speed
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const COLORS = ['#00335E', '#C99228', '#3CB371', '#FF6B6B', '#4ECDC4', '#95E1D3'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    done: 0,
    totalStudents: 0,
    totalFees: 0,
    totalHomework: 0,
    pendingFees: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [homeworkDistribution, setHomeworkDistribution] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // 🧮 Fetch homework stats
      const hwRes = await fetch(`${API_BASE_URL}/homework/stats`, {
        headers: getAuthHeaders(),
      });
      
      if (!hwRes.ok && hwRes.status !== 401) {
        console.warn("Failed to fetch homework stats");
      }
      
      const hwData = hwRes.ok ? await hwRes.json() : { stats: {} };
      const hwStats = hwData.stats || {};

      // 👨‍🎓 Fetch total students
      const studentsRes = await fetch(`${API_BASE_URL}/students/count`, {
        headers: getAuthHeaders(),
      });
      
      const studentsData = studentsRes.ok ? await studentsRes.json() : { count: 0 };

      // 💰 Fetch fee stats
      const feeRes = await fetch(`${API_BASE_URL}/fees/total`, {
        headers: getAuthHeaders(),
      });
      
      const feeData = feeRes.ok ? await feeRes.json() : { total: 0, pending: 0 };

      setStats({
        active: hwStats.activeHomeworks || 0,
        pending: hwStats.pendingHomeworks || 0,
        done: hwStats.doneHomeworks || 0,
        totalStudents: studentsData.count || 0,
        totalFees: feeData.total || 0,
        totalHomework: hwStats.totalHomeworks || 0,
        pendingFees: feeData.pending || 0,
      });

      // Prepare chart data
      setChartData([
        { name: 'Active', value: hwStats.activeHomeworks || 0 },
        { name: 'Pending', value: hwStats.pendingHomeworks || 0 },
        { name: 'Done', value: hwStats.doneHomeworks || 0 },
      ]);

      // Mock attendance data (replace with actual API call)
      setAttendanceData([
        { month: 'Jan', present: 85, absent: 10 },
        { month: 'Feb', present: 90, absent: 8 },
        { month: 'Mar', present: 88, absent: 12 },
        { month: 'Apr', present: 92, absent: 6 },
        { month: 'May', present: 87, absent: 9 },
        { month: 'Jun', present: 91, absent: 7 },
      ]);

      // Homework distribution
      setHomeworkDistribution([
        { name: 'Math', value: 15 },
        { name: 'Science', value: 12 },
        { name: 'English', value: 10 },
        { name: 'History', value: 8 },
      ]);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Active Homework",
      value: stats.active,
      icon: <ActiveIcon />,
      color: "#00335E",
      bgGradient: "linear-gradient(135deg, #00335E 0%, #004d7a 100%)",
    },
    {
      title: "Pending Homework",
      value: stats.pending,
      icon: <PendingIcon />,
      color: "#C99228",
      bgGradient: "linear-gradient(135deg, #C99228 0%, #e6b043 100%)",
    },
    {
      title: "Completed Homework",
      value: stats.done,
      icon: <DoneIcon />,
      color: "#3CB371",
      bgGradient: "linear-gradient(135deg, #3CB371 0%, #4ade80 100%)",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <StudentIcon />,
      color: "#00335E",
      bgGradient: "linear-gradient(135deg, #00335E 0%, #004d7a 100%)",
    },
    {
      title: "Fees Collected",
      value: `PKR ${stats.totalFees?.toLocaleString() || 0}`,
      icon: <FeeIcon />,
      color: "#C99228",
      bgGradient: "linear-gradient(135deg, #C99228 0%, #e6b043 100%)",
    },
    {
      title: "Pending Fees",
      value: `PKR ${stats.pendingFees?.toLocaleString() || 0}`,
      icon: <TrendingUpIcon />,
      color: "#FF6B6B",
      bgGradient: "linear-gradient(135deg, #FF6B6B 0%, #ff8787 100%)",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: { xs: 2, md: 3 },
              color: "#00335E",
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AssessmentIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }} />
            Dashboard Overview
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: "#00335E" }} size={48} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'error.main' }}>
            {error}
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
              {statCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={card.title}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        background: card.bgGradient,
                        color: 'white',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                        boxShadow: 3,
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                opacity: 0.9,
                                mb: 1,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                fontWeight: 500
                              }}
                            >
                              {card.title}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                lineHeight: 1.2
                              }}
                            >
                              {card.value}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 2,
                              p: { xs: 1, sm: 1.25 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {React.cloneElement(card.icon, {
                              sx: { fontSize: { xs: 28, sm: 32, md: 36 } }
                            })}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {/* Homework Status Chart */}
              <Grid item xs={12} md={6}>
                <motion.div variants={chartVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      height: '100%',
                      minHeight: { xs: 300, sm: 350, md: 400 }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "#00335E",
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Homework Status
                      </Typography>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : isTablet ? 300 : 320}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={isMobile ? 80 : isTablet ? 100 : 120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Attendance Trend Chart */}
              <Grid item xs={12} md={6}>
                <motion.div variants={chartVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      height: '100%',
                      minHeight: { xs: 300, sm: 350, md: 400 }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "#00335E",
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Attendance Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : isTablet ? 300 : 320}>
                        <LineChart data={attendanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="month" stroke="#666" fontSize={isMobile ? 11 : 12} />
                          <YAxis stroke="#666" fontSize={isMobile ? 11 : 12} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 8,
                              border: '1px solid #e0e0e0',
                              fontSize: isMobile ? 12 : 14
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 12 }} />
                          <Line
                            type="monotone"
                            dataKey="present"
                            stroke="#3CB371"
                            strokeWidth={2}
                            name="Present"
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="absent"
                            stroke="#FF6B6B"
                            strokeWidth={2}
                            name="Absent"
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Homework Distribution */}
              <Grid item xs={12}>
                <motion.div variants={chartVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      height: '100%',
                      minHeight: { xs: 300, sm: 350 }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "#00335E",
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Homework by Subject
                      </Typography>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <BarChart data={homeworkDistribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="name" stroke="#666" fontSize={isMobile ? 11 : 12} />
                          <YAxis stroke="#666" fontSize={isMobile ? 11 : 12} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 8,
                              border: '1px solid #e0e0e0',
                              fontSize: isMobile ? 12 : 14
                            }}
                          />
                          <Bar dataKey="value" fill="#C99228" radius={[8, 8, 0, 0]}>
                            {homeworkDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </>
        )}
      </motion.div>
    </Box>
  );
};

export default Dashboard;
