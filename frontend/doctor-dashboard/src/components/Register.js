import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Snackbar,
  MenuItem,
  Divider,
  Grid
} from '@mui/material';
import { register } from '../services/authService';

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Obstetrics',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology',
  'General Practice'
];

const hospitals = [
  'Hospital 1',
  'Hospital 2',
  'Hospital 3',
  'Hospital 4'
];

const Register = ({ onRegisterSuccess }) => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    role: 'doctor',
    specialization: '',
    hospital: '',
    licenseNumber: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (userData.password !== userData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return false;
    }
    
    if (userData.password.length < 6) {
      setNotification({
        open: true,
        message: 'Password must be at least 6 characters long',
        severity: 'error'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Create registration data with blockchain address if available
      const registrationData = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        email: userData.email,
        role: 'doctor',
        // Additional doctor-specific data
        doctorData: {
          specialization: userData.specialization,
          hospital: userData.hospital,
          licenseNumber: userData.licenseNumber
        }
      };
      
      const response = await register(registrationData);
      
      setNotification({
        open: true,
        message: 'Registration successful!',
        severity: 'success'
      });
      
      // Call the onRegisterSuccess callback with the user data
      if (onRegisterSuccess) {
        onRegisterSuccess(response.user);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Register as a Doctor
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="username"
              label="Username"
              value={userData.username}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Full Name"
              value={userData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              fullWidth
              required
              helperText="At least 6 characters"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={userData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Professional Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="specialization"
              select
              label="Specialization"
              value={userData.specialization}
              onChange={handleChange}
              fullWidth
              required
            >
              {specializations.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="hospital"
              select
              label="Hospital"
              value={userData.hospital}
              onChange={handleChange}
              fullWidth
              required
            >
              {hospitals.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="licenseNumber"
              label="Medical License Number"
              value={userData.licenseNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {
                if (onRegisterSuccess) {
                  onRegisterSuccess(null, 'login');
                }
              }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
      >
        <Alert onClose={closeNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Register;
