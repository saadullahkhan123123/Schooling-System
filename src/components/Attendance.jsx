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
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setMessage("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  // ✅ Mark or unmark single student
  const handleAttendanceToggle = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Mark all present or clear all
  const markAll = (status) => {
    const updated = {};
    filteredStudents.forEach((student) => {
      updated[student._id] = status;
    });
    setAttendance(updated);
  };

  // ✅ Filter students by search
  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Save attendance to API
  const handleSaveAttendance = async () => {
    try {
      const attendanceData = filteredStudents.map((student) => ({
        studentId: student._id,
        status: attendance[student._id] ? "Present" : "Absent",
      }));

      await axios.post(
        "http://localhost:5000/api/attendance/mark",
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <Typography
        variant="h4"
        sx={{ color: "#00335E", fontWeight: "bold", mb: 4 }}
      >
        Attendance Management
      </Typography>

      {/* Tabs */}
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

      {/* Alert Message */}
      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "error"}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      {/* Tab 1: Mark Attendance */}
      {activeTab === 0 && (
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
      {activeTab === 1 && (
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
