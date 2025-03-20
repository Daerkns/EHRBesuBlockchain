import React, { useState, useEffect } from 'react';
import { 
  Paper, Typography, Box, TextField, Button, CircularProgress,
  Card, CardContent, Grid, Chip, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, Snackbar,
  Alert, CardActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicationIcon from '@mui/icons-material/Medication';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { hasAccessToPatient, getPatientRecords, addMedicalRecord } from '../services/doctorService';

// Record type options
const recordTypes = [
  { value: '0', label: 'General Checkup', icon: <LocalHospitalIcon /> },
  { value: '1', label: 'Lab Test', icon: <ReceiptIcon /> },
  { value: '2', label: 'Prescription', icon: <MedicationIcon /> },
  { value: '3', label: 'Surgery', icon: <LocalHospitalIcon /> },
  { value: '4', label: 'Imaging', icon: <FileIcon /> },
  { value: '5', label: 'Vaccination', icon: <VaccinesIcon /> },
];

// Helper function to get record type label and icon
const getRecordTypeInfo = (typeValue) => {
  const recordType = recordTypes.find(type => type.value === typeValue);
  return recordType || { label: 'Unknown', icon: <FileIcon /> };
};

const PatientRecords = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    recordType: '0',
    fileHash: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Check for test patient in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const patientParam = params.get('patient');
    if (patientParam) {
      setPatientAddress(patientParam);
      handleSearch(patientParam);
    }
  }, []);

  const handleSearch = async (addressToSearch = null) => {
    const addressToUse = addressToSearch || patientAddress;
    
    if (!addressToUse) {
      setNotification({
        open: true,
        message: 'Please enter a patient address',
        severity: 'warning'
      });
      return;
    }
    
    setSearching(true);
    setRecords([]);
    setHasAccess(false);
    
    try {
      // Check if doctor has access to patient
      console.log('Checking if doctor has access to patient:', addressToUse);
      const access = await hasAccessToPatient(addressToUse);
      console.log('Access granted:', access);
      setHasAccess(access);
      
      if (access) {
        await loadPatientRecords(addressToUse);
      } else {
        setNotification({
          open: true,
          message: 'You do not have access to this patient\'s records',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error searching for patient:', error);
      setNotification({
        open: true,
        message: 'Error searching for patient: ' + error.message,
        severity: 'error'
      });
    } finally {
      setSearching(false);
    }
  };

  const loadPatientRecords = async (address) => {
    setLoading(true);
    try {
      console.log('Loading records for patient:', address);
      const patientRecords = await getPatientRecords(address);
      console.log('Patient records retrieved:', patientRecords);
      setRecords(patientRecords);
      
      if (patientRecords.length === 0) {
        setNotification({
          open: true,
          message: 'No records found for this patient',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error loading patient records:', error);
      setNotification({
        open: true,
        message: 'Error loading patient records: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({
      title: '',
      description: '',
      recordType: '0',
      fileHash: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formValues.title || !formValues.description) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'warning'
      });
      return;
    }
    
    try {
      await addMedicalRecord(
        patientAddress,
        formValues.title,
        formValues.description,
        formValues.recordType,
        formValues.fileHash
      );
      
      setNotification({
        open: true,
        message: 'Medical record added successfully!',
        severity: 'success'
      });
      
      handleCloseDialog();
      await loadPatientRecords(patientAddress);
    } catch (error) {
      console.error('Error adding medical record:', error);
      setNotification({
        open: true,
        message: 'Error adding medical record: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Add test patient for easy testing
  const useTestPatient = () => {
    const testAddress = '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73';
    setPatientAddress(testAddress);
    handleSearch(testAddress);
  };

  // Show debug info if no records are shown despite having access
  useEffect(() => {
    if (hasAccess && records.length === 0) {
      console.log('DEBUG: Has access but no records shown. localStorage content:');
      const savedRecords = localStorage.getItem('patientRecords');
      console.log(savedRecords ? JSON.parse(savedRecords) : 'No records in localStorage');
    }
  }, [hasAccess, records]);

  return (
    <>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Patient Records
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Enter a patient's address to view their medical records (if you have access).
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <TextField
              label="Patient Address"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ mr: 2 }}
              placeholder="e.g. 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSearch()}
              disabled={searching}
              startIcon={<SearchIcon />}
              sx={{ mt: 2 }}
            >
              {searching ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
          
          {/* Make this button more prominent */}
          <Button 
            variant="outlined" 
            size="large" 
            onClick={useTestPatient}
            sx={{ mt: 2, mb: 1 }}
            color="secondary"
            fullWidth
          >
            Use Test Patient Address
          </Button>
          
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, mb: 2 }}>
            Note: Using localStorage for development. The test patient should have some sample records.
          </Typography>
        </Box>
        
        {hasAccess && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Patient's Medical Records
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Add Record
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : records.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No Medical Records
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  This patient doesn't have any medical records yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Add First Record
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {records.map((record) => {
                  const typeInfo = getRecordTypeInfo(record.recordType);
                  
                  return (
                    <Grid item xs={12} md={6} key={record.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {typeInfo.icon}
                            <Typography variant="h6" sx={{ ml: 1 }}>
                              {record.title}
                            </Typography>
                          </Box>
                          
                          <Chip 
                            label={typeInfo.label} 
                            size="small" 
                            sx={{ mb: 2 }} 
                            color="primary" 
                            variant="outlined"
                          />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {record.description.length > 100 
                              ? `${record.description.substring(0, 100)}...` 
                              : record.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              {record.date}
                            </Typography>
                          </Box>
                        </CardContent>
                        <Divider />
                        <CardActions>
                          <Button 
                            size="small" 
                            onClick={() => handleViewDetails(record)}
                            endIcon={<InfoOutlinedIcon />}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </Paper>
      
      {/* Add Record Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Medical Record</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Title"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
          
          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          
          <TextField
            margin="normal"
            select
            label="Record Type"
            name="recordType"
            value={formValues.recordType}
            onChange={handleInputChange}
            fullWidth
          >
            {recordTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {React.cloneElement(option.icon, { fontSize: 'small', sx: { mr: 1 } })}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            margin="normal"
            label="File Hash (optional)"
            name="fileHash"
            value={formValues.fileHash}
            onChange={handleInputChange}
            fullWidth
            helperText="IPFS hash of any attached file"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Record
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Record Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        {selectedRecord && (
          <>
            <DialogTitle>
              {selectedRecord.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  icon={getRecordTypeInfo(selectedRecord.recordType).icon} 
                  label={getRecordTypeInfo(selectedRecord.recordType).label}
                  color="primary"
                  sx={{ mb: 2 }}
                />
              </Box>
              
              <Typography variant="subtitle1">Description</Typography>
              <Typography variant="body2" paragraph>
                {selectedRecord.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body2">{selectedRecord.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Added By</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {selectedRecord.addedBy.substring(0, 10) + '...'}
                  </Typography>
                </Grid>
              </Grid>
              
              {selectedRecord.fileHash && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">File Hash</Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {selectedRecord.fileHash}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
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
    </>
  );
};

export default PatientRecords;
