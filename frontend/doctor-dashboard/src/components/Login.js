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
  Divider,
  Grid
} from '@mui/material';
import { login } from '../services/authService';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(credentials);
      
      // Verify that the user is a doctor
      if (response.user.role !== 'doctor') {
        throw new Error('Access denied. This portal is for doctors only.');
      }
      
      setNotification({
        open: true,
        message: 'Login successful!',
        severity: 'success'
      });
      
      // Call the onLoginSuccess callback with the user data
      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      setNotification({
        open: true,
        message: error.message || error.response?.data?.message || 'Login failed. Please check your credentials.',
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
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Doctor Portal Login
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          name="username"
          label="Username"
          value={credentials.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          autoFocus
        />
        
        <TextField
          name="password"
          label="Password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {
                if (onLoginSuccess) {
                  onLoginSuccess(null, 'register');
                }
              }}
            >
              Register as a Doctor
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

export default Login;
