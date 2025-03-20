import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Box, TextField, Button, CircularProgress,
  Alert, Snackbar, Card, CardContent, Divider, Chip
} from '@mui/material';
import { registerDoctor, isRegisteredDoctor, getDoctorInfo } from '../services/doctorService';
import { getAccount } from '../services/web3Service';

const DoctorRegistration = () => {
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    specialty: '',
    licenseId: '',
    hospital: ''
  });
  const [formValues, setFormValues] = useState({
    name: '',
    specialty: '',
    licenseId: '',
    hospital: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [account, setAccount] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const currentAccount = await getAccount();
        setAccount(currentAccount);
        
        // Check if doctor is registered
        const registered = await isRegisteredDoctor();
        setIsRegistered(registered);
        
        if (registered) {
          // Get doctor info
          const info = await getDoctorInfo();
          setDoctorInfo(info);
        }
      } catch (error) {
        console.error('Error checking registration:', error);
        setNotification({
          open: true,
          message: 'Error checking registration: ' + error.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formValues.name || !formValues.specialty || !formValues.licenseId || !formValues.hospital) {
      setNotification({
        open: true,
        message: 'Please fill in all fields',
        severity: 'warning'
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await registerDoctor(
        formValues.name,
        formValues.specialty,
        formValues.licenseId,
        formValues.hospital
      );
      
      setNotification({
        open: true,
        message: 'Registration successful!',
        severity: 'success'
      });
      
      // Update state to show doctor info
      setIsRegistered(true);
      setDoctorInfo({
        name: formValues.name,
        specialty: formValues.specialty,
        licenseId: formValues.licenseId,
        hospital: formValues.hospital
      });
    } catch (error) {
      console.error('Error registering doctor:', error);
      setNotification({
        open: true,
        message: 'Error registering: ' + error.message,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFillTestData = () => {
    setFormValues({
      name: 'Dr. Smith',
      specialty: 'Cardiology',
      licenseId: 'MD12345',
      hospital: 'General Hospital'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Doctor Registration
      </Typography>

      {isRegistered ? (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            You are registered as a doctor!
          </Alert>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {doctorInfo.name}
              </Typography>
              
              <Chip 
                label={doctorInfo.specialty} 
                color="primary" 
                variant="outlined" 
                sx={{ mb: 2 }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  License ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {doctorInfo.licenseId}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Hospital
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {doctorInfo.hospital}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Wallet Address
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {account}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
            You can now view patient records if they have granted you access.
            Go to the "Patient Records" tab to search for patients.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Register as a doctor to access patient records.
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="Specialty"
              name="specialty"
              value={formValues.specialty}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="License ID"
              name="licenseId"
              value={formValues.licenseId}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="Hospital"
              name="hospital"
              value={formValues.hospital}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="text" 
                size="small" 
                onClick={handleFillTestData}
                sx={{ textTransform: 'none' }}
              >
                Use test data
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Box>
          </form>
          
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3 }}>
            Note: Using localStorage for development. Blockchain operations may fail but UI will still work.
          </Typography>
        </Box>
      )}
      
      {/* Notifications */}
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

export default DoctorRegistration;
