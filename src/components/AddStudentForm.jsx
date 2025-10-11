import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  ContactPhone as ContactPhoneIcon,
  Home as HomeIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const AddStudentForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    studentClass: "",
    rollNumber: "",
    dob: "",
    studentWhatsapp: "",
    studentCell: "",
    bForm: "",
    gender: "",
    nationality: "PAKISTANI",
    fatherCnic: "",
    parentsWhatsapp: "",
    parentsCell: "",
    fatherName: "",
    motherName: "",
    parentEmail: "",
    address: "",
    emergencyContact: "",
    admissionDate: "",
    batchNo: "25",
    schoolName: "",
    referralSource: "",
    note: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const steps = [
    "Personal Information",
    "Contact Details",
    "Parent Information",
    "Additional Details",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateRollNumber = () => {
    if (formData.studentClass) {
      const randomNum = Math.floor(Math.random() * 100);
      setFormData({
        ...formData,
        rollNumber: `${formData.studentClass}-${randomNum}`,
      });
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.studentClass) newErrors.studentClass = "Class is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.bForm) newErrors.bForm = "B-Form is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
    if (!formData.motherName) newErrors.motherName = "Mother's name is required";
    if (!formData.fatherCnic) newErrors.fatherCnic = "Father CNIC is required";
    if (!formData.parentsWhatsapp)
      newErrors.parentsWhatsapp = "Parent WhatsApp is required";
    if (!formData.parentsCell)
      newErrors.parentsCell = "Parent Cell is required";
    if (!formData.emergencyContact)
      newErrors.emergencyContact = "Emergency Contact is required";
    if (!formData.admissionDate)
      newErrors.admissionDate = "Admission Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }
      if (imageFile) payload.append("image", imageFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/students/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(response.data.message || "Student added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to add student. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      studentClass: "",
      rollNumber: "",
      dob: "",
      studentWhatsapp: "",
      studentCell: "",
      bForm: "",
      gender: "",
      nationality: "PAKISTANI",
      fatherCnic: "",
      parentsWhatsapp: "",
      parentsCell: "",
      fatherName: "",
      motherName: "",
      parentEmail: "",
      address: "",
      emergencyContact: "",
      admissionDate: "",
      batchNo: "25",
      schoolName: "",
      referralSource: "",
      note: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setErrors({});
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ textAlign: "center", mb: 3 }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    border: "4px solid #00335E",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="student-image"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="student-image">
                  <IconButton
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "#C99228",
                      color: "white",
                      "&:hover": { backgroundColor: "#b3821f" },
                    }}
                  >
                    <CloudUploadIcon />
                  </IconButton>
                </label>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.studentClass}>
                <InputLabel>Class</InputLabel>
                <Select
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={(e) => {
                    handleInputChange(e);
                    generateRollNumber();
                  }}
                  label="Class"
                >
                  {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                    <MenuItem key={c} value={c}>
                      Class {c}
                    </MenuItem>
                  ))}
                </Select>
                {errors.studentClass && (
                  <FormHelperText>{errors.studentClass}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                InputProps={{ readOnly: true }}
                helperText="Auto-generated"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                required
                error={!!errors.dob}
                helperText={errors.dob}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <ContactPhoneIcon sx={{ mr: 1, color: "#C99228" }} />
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                required
                error={!!errors.emergencyContact}
                helperText={errors.emergencyContact}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admission Date"
                name="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={handleInputChange}
                required
                error={!!errors.admissionDate}
                helperText={errors.admissionDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <PersonIcon sx={{ mr: 1, color: "#C99228" }} />
                Parent Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                required
                error={!!errors.fatherName}
                helperText={errors.fatherName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                required
                error={!!errors.motherName}
                helperText={errors.motherName}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <SchoolIcon sx={{ mr: 1, color: "#C99228" }} />
                Additional Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Previous School"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Referral Source"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#00335E" }}
            >
              Add New Student
            </Typography>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Step ${activeStep + 1} of ${steps.length}`}
              sx={{ backgroundColor: "#00335E", color: "#fff" }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ClearIcon />}
                variant="outlined"
              >
                Back
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={resetForm}
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                >
                  Reset
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                    }
                    sx={{
                      background: "#00335E",
                      "&:hover": { background: "#002244" },
                    }}
                  >
                    Save Student
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      background: "#00335E",
                      "&:hover": { background: "#002244" },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {successMessage && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default AddStudentForm;
