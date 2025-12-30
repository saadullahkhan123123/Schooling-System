import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Fade,
} from "@mui/material";
import {
  CheckCircle as ActiveIcon,
  Pending as PendingIcon,
  Bookmark as DoneIcon,
  People as StudentIcon,
  CurrencyExchange as FeeIcon,
  MenuBook as HomeworkIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    done: 0,
    totalStudents: 0,
    totalFees: 0,
    totalHomework: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api";

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
      
      if (!hwRes.ok) {
        if (hwRes.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error("Failed to fetch homework stats");
      }
      
      const hwData = await hwRes.json();
      const hwStats = hwData.stats || {};

      // 👨‍🎓 Fetch total students
      const studentsRes = await fetch(`${API_BASE_URL}/students/count`, {
        headers: getAuthHeaders(),
      });
      
      if (!studentsRes.ok) {
        if (studentsRes.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error("Failed to fetch student stats");
      }
      
      const studentsData = await studentsRes.json();

      // 💰 Fetch fee stats
      const feeRes = await fetch(`${API_BASE_URL}/fees/total`, {
        headers: getAuthHeaders(),
      });
      
      if (!feeRes.ok) {
        if (feeRes.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        // Fee stats might not be critical, so we'll use 0 if it fails
        console.warn("Failed to fetch fee stats, using default value");
      }
      
      const feeData = feeRes.ok ? await feeRes.json() : { total: 0 };

      setStats({
        active: hwStats.activeHomeworks || 0,
        pending: hwStats.pendingHomeworks || 0,
        done: hwStats.doneHomeworks || 0,
        totalStudents: studentsData.count || 0,
        totalFees: feeData.total || 0,
        totalHomework: hwStats.totalHomeworks || 0,
      });
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
      icon: <ActiveIcon fontSize="large" />,
      color: "#00335E",
    },
    {
      title: "Pending Homework",
      value: stats.pending,
      icon: <PendingIcon fontSize="large" />,
      color: "#C99228",
    },
    {
      title: "Completed Homework",
      value: stats.done,
      icon: <DoneIcon fontSize="large" />,
      color: "#3CB371",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <StudentIcon fontSize="large" />,
      color: "#00335E",
    },
    {
      title: "Total Fees Collected",
      value: `PKR ${stats.totalFees}`,
      icon: <FeeIcon fontSize="large" />,
      color: "#C99228",
    },
    {
      title: "Total Homework",
      value: stats.totalHomework,
      icon: <HomeworkIcon fontSize="large" />,
      color: "#00335E",
    },
  ];

  return (
    <Fade in timeout={500}>
      <Box className="p-6">
        <Typography
          variant="h4"
          className="font-bold mb-6"
          sx={{ color: "#00335E" }}
        >
          📊 Dashboard
        </Typography>

        {loading ? (
          <Box className="flex justify-center py-10">
            <CircularProgress sx={{ color: "#00335E" }} />
          </Box>
        ) : error ? (
          <Box className="text-red-600 text-center py-10">{error}</Box>
        ) : (
          <Grid container spacing={4}>
            {statCards.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Card className="hover:shadow-lg transition-all duration-300 rounded-xl">
                  <CardContent className="flex items-center gap-4 p-6">
                    <Box
                      className="text-white p-4 rounded-full shadow-md"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" className="font-semibold">
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        className="font-bold text-gray-800"
                      >
                        {card.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default Dashboard;
