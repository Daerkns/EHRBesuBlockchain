import React, { useState } from 'react';
import { 
  Paper, Typography, Box, TextField, Button, CircularProgress,
  Card, CardContent, List, Divider, Snackbar, Alert
} from '@mui/material';
import { getPatientRecords } from '../services/doctorService';

const PatientRecordsViewer = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!patientAddress) {
      setNotification({
        open: true,
        message: 'Please enter a patient address',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const patientRecords = await getPatientRecords(patientAddress);
      setRecords(patientRecords);
      
      if (patientRecords.length === 0) {
        setNotification({
          open: true,
          message: 'No records found for this patient',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching patient records:', error);
      setNotification({
        open: true,
        message: error.message || 'Error fetching patient records',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Add test patient for easy testing
  const useTestPatient = () => {
    const testAddress = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';
    setPatientAddress(testAddress);
    handleSearch();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Patient Records Viewer
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Enter a patient's address to view their medical records.
        You must have been granted access by the patient to view their records.
      </Typography>
      
      <Box component="form" onSubmit={handleSearch}>
        <TextField
          fullWidth
          label="Patient Address"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
          placeholder="0x..."
          margin="normal"
          required
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, mt: 1 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'View Records'}
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={useTestPatient}
            sx={{ mt: 1 }}
          >
            Use Test Patient Address
          </Button>
          
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
            Note: Test patient address: 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
          </Typography>
        </Box>
      </Box>
      
      {records.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Medical Records
          </Typography>
          <List>
            {records.map((record, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{record.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Type: {record.recordType === '0' ? 'General Checkup' : 
                          record.recordType === '1' ? 'Lab Test' :
                          record.recordType === '2' ? 'Prescription' :
                          record.recordType === '3' ? 'Surgery' :
                          record.recordType === '4' ? 'Imaging' :
                          record.recordType === '5' ? 'Vaccination' : 'Other'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1">{record.description}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="textSecondary">
                      Date: {record.date}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Added by: {record.addedBy}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
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

export default PatientRecordsViewer;
