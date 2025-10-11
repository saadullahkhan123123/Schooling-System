import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Fade } from '@mui/material';
import { CheckCircle, Pending, Bookmark } from '@mui/icons-material';

const Dashboard = () => {
  const [stats, setStats] = useState({ active: 0, pending: 0, done: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/homework/stats`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = [
    { title: 'Active', value: stats.active, icon: <CheckCircle fontSize="large" />, color: '#00335E' },
    { title: 'Pending', value: stats.pending, icon: <Pending fontSize="large" />, color: '#C99228' },
    { title: 'Done', value: stats.done, icon: <Bookmark fontSize="large" />, color: '#3CB371' }, // optional green for done
  ];

  return (
    <Fade in timeout={500}>
      <Box className="p-6">
        <Typography variant="h4" className="font-bold text-[#00335E] mb-6">
          📊 Dashboard
        </Typography>

        {loading ? (
          <Box className="flex justify-center py-10">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="text-red-600 text-center py-10">{error}</Box>
        ) : (
          <Grid container spacing={4}>
            {statCards.map((card) => (
              <Grid item xs={12} md={4} key={card.title}>
                <Card className="hover:shadow-lg transition-shadow rounded-xl">
                  <CardContent className="flex items-center gap-4 p-6">
                    <Box className="text-white p-4 rounded-full" style={{ backgroundColor: card.color }}>
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" className="font-semibold">{card.title}</Typography>
                      <Typography variant="h4" className="font-bold text-gray-800">{card.value}</Typography>
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
