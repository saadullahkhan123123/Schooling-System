import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Typography,
  Checkbox,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";

const studentsMock = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Johnson" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "Daniel Lee" },
];

export default function Attendance() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState({});

  const handleAttendanceToggle = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll = (status) => {
    const updated = {};
    filteredStudents.forEach((student) => {
      updated[student.id] = status;
    });
    setAttendance(updated);
  };

  const filteredStudents = studentsMock.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveAttendance = () => {
    console.log("Attendance Data:", attendance);
    alert("Attendance saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <Typography variant="h4" className="text-[#0F406A] font-bold mb-6">
        Attendance Management
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Mark Attendance" sx={{ color: "#0F406A" }} />
        <Tab label="Attendance Report" sx={{ color: "#0F406A" }} />
      </Tabs>

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
                sx={{ backgroundColor: "#C89127" }}
              >
                Mark All Present
              </Button>
              <Button
                variant="outlined"
                onClick={() => markAll(false)}
                sx={{ color: "#C89127", borderColor: "#C89127" }}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Student List */}
          <Card className="shadow-xl rounded-2xl">
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <Typography>No students found.</Typography>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Typography className="font-medium text-gray-800">
                        {student.name}
                      </Typography>
                      <Checkbox
                        checked={attendance[student.id] || false}
                        onChange={() => handleAttendanceToggle(student.id)}
                        sx={{
                          color: "#C89127",
                          "&.Mui-checked": { color: "#C89127" },
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            variant="contained"
            onClick={handleSaveAttendance}
            sx={{ backgroundColor: "#0F406A", paddingX: 4 }}
          >
            Save Attendance
          </Button>
        </motion.div>
      )}

      {/* Tab 2: Attendance Report */}
      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-700"
        >
          <Typography variant="h6">Attendance Report Coming Soon...</Typography>
        </motion.div>
      )}
    </div>
  );
}
