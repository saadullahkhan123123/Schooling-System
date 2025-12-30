import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Typography,
  Checkbox,
  TextField,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:3000/api";

  // ✅ Fetch attendance data based on role
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role || 'student';
        const id = user._id || user.id;
        
        setUserRole(role);
        setUserId(id);

        if (role === 'student') {
          // Students see only their own attendance
          const res = await axios.get(`${API_BASE_URL}/attendance/student/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudentAttendance(res.data.attendance || []);
        } else {
          // Admin/Teacher see all students for marking
          // Note: You'll need to create an endpoint to get all students
          // For now, we'll use a placeholder
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setMessage("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [token]);

  // ✅ Mark or unmark single student (Admin/Teacher only)
  const handleAttendanceToggle = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Mark all present or clear all (Admin/Teacher only)
  const markAll = (status) => {
    const updated = {};
    filteredStudents.forEach((student) => {
      updated[student._id] = status;
    });
    setAttendance(updated);
  };

  // ✅ Filter students by search (Admin/Teacher only)
  const filteredStudents = students.filter((student) =>
    student.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Save attendance to API (Admin/Teacher only)
  const handleSaveAttendance = async () => {
    try {
      const attendanceData = filteredStudents.map((student) => ({
        studentId: student._id,
        status: attendance[student._id] ? "present" : "absent",
      }));

      await axios.post(
        `${API_BASE_URL}/attendance/mark`,
        { attendance: attendanceData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Attendance saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving attendance:", error);
      setMessage("❌ Failed to save attendance.");
    }
  };

  // Get status color for chips
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <Typography
        variant="h4"
        sx={{ color: "#00335E", fontWeight: "bold", mb: 4 }}
      >
        {userRole === 'student' ? 'My Attendance' : 'Attendance Management'}
      </Typography>

      {/* Tabs - Only show for Admin/Teacher */}
      {userRole !== 'student' && (
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            marginBottom: 3,
            "& .MuiTab-root": { color: "#00335E" },
            "& .Mui-selected": { color: "#C99228" },
            "& .MuiTabs-indicator": { backgroundColor: "#C99228" },
          }}
        >
          <Tab label="Mark Attendance" />
          <Tab label="Attendance Report" />
        </Tabs>
      )}

      {/* Alert Message */}
      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "error"}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      {/* Student View - Show their own attendance */}
      {userRole === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <CircularProgress sx={{ color: "#00335E" }} />
                </div>
              ) : studentAttendance.length === 0 ? (
                <Typography className="text-center py-6 text-gray-500">
                  No attendance records found.
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow className="bg-gray-50">
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Subject</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Remarks</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentAttendance.map((record, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{record.subject || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.status || 'N/A'}
                              color={getStatusColor(record.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{record.remarks || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Admin/Teacher View - Mark Attendance */}
      {userRole !== 'student' && activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TextField
              label="Search Student"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3"
            />
            <div className="flex gap-3">
              <Button
                variant="contained"
                onClick={() => markAll(true)}
                sx={{ backgroundColor: "#C99228" }}
              >
                Mark All Present
              </Button>
              <Button
                variant="outlined"
                onClick={() => markAll(false)}
                sx={{ color: "#C99228", borderColor: "#C99228" }}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Student List */}
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <CircularProgress sx={{ color: "#00335E" }} />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudents.length === 0 ? (
                    <Typography>No students found.</Typography>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Typography className="font-medium text-gray-800">
                          {student.fullName}
                        </Typography>
                        <Checkbox
                          checked={attendance[student._id] || false}
                          onChange={() => handleAttendanceToggle(student._id)}
                          sx={{
                            color: "#C99228",
                            "&.Mui-checked": { color: "#C99228" },
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            variant="contained"
            onClick={handleSaveAttendance}
            sx={{
              backgroundColor: "#00335E",
              px: 4,
              "&:hover": { backgroundColor: "#002244" },
            }}
          >
            Save Attendance
          </Button>
        </motion.div>
      )}

      {/* Tab 2: Attendance Report (Future) */}
      {userRole !== 'student' && activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-700"
        >
          <Typography variant="h6">
            Attendance Report Coming Soon...
          </Typography>
        </motion.div>
      )}
    </div>
  );
}
