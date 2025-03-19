# Setting Up Your EHR Blockchain Frontend Components

I can confirm that your setup was successful! The logs show that both projects (patient-portal and doctor-dashboard) were created successfully and the MUI v5 dependencies were installed without errors.

Now let's set up the core components for both applications:

## 1. Create Web3 Service

First, let's create the Web3 service to connect to your blockchain:

```bash
# For patient portal
mkdir -p /home/vanir/ehr-blockchain/frontend/patient-portal/src/services
cat << EOF > /home/vanir/ehr-blockchain/frontend/patient-portal/src/services/web3Service.js
import Web3 from 'web3';

// Contract addresses from your deployed contracts
const contractAddresses = {
  EHRRegistry: '0x42699A7612A82f1d9C36148af9C77354759b210b',
  AccessControl: '0xa50a51c09a5c451C52BB714527E1974b686D8e77',
  PatientRecords: '0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e'
};

// Initialize Web3
const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(() => {
            resolve(web3);
          })
          .catch(() => {
            reject('User denied account access');
          });
      } catch (error) {
        reject('User denied account access');
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      resolve(new Web3(window.web3.currentProvider));
    }
    // Fallback to localhost
    else {
      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      const web3 = new Web3(provider);
      resolve(web3);
    }
  });
};

export { getWeb3, contractAddresses };
EOF

# Create the same file for doctor dashboard
mkdir -p /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/services
cp /home/vanir/ehr-blockchain/frontend/patient-portal/src/services/web3Service.js /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/services/
```

## 2. Copy Contract ABIs to Frontend

```bash
# Create directories for contract ABIs
mkdir -p /home/vanir/ehr-blockchain/frontend/patient-portal/src/contracts
mkdir -p /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/contracts

# Copy contract ABIs from blockchain build directory
cp /home/vanir/ehr-blockchain/blockchain/build/contracts/EHRRegistry.json /home/vanir/ehr-blockchain/frontend/patient-portal/src/contracts/
cp /home/vanir/ehr-blockchain/blockchain/build/contracts/AccessControl.json /home/vanir/ehr-blockchain/frontend/patient-portal/src/contracts/
cp /home/vanir/ehr-blockchain/blockchain/build/contracts/PatientRecords.json /home/vanir/ehr-blockchain/frontend/patient-portal/src/contracts/

# Copy to doctor dashboard as well
cp /home/vanir/ehr-blockchain/frontend/patient-portal/src/contracts/* /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/contracts/
```

## 3. Create Contract Service

```bash
# For patient portal
cat << EOF > /home/vanir/ehr-blockchain/frontend/patient-portal/src/services/contractService.js
import { getWeb3, contractAddresses } from './web3Service';
import EHRRegistryABI from '../contracts/EHRRegistry.json';
import AccessControlABI from '../contracts/AccessControl.json';
import PatientRecordsABI from '../contracts/PatientRecords.json';

// Initialize contracts
const initContracts = async () => {
  try {
    // Get Web3 instance
    const web3 = await getWeb3();
    
    // Get user's accounts
    const accounts = await web3.eth.getAccounts();
    
    // Create contract instances
    const ehrRegistry = new web3.eth.Contract(
      EHRRegistryABI.abi,
      contractAddresses.EHRRegistry
    );
    
    const accessControl = new web3.eth.Contract(
      AccessControlABI.abi,
      contractAddresses.AccessControl
    );
    
    const patientRecords = new web3.eth.Contract(
      PatientRecordsABI.abi,
      contractAddresses.PatientRecords
    );
    
    return { 
      web3, 
      accounts, 
      contracts: { 
        ehrRegistry, 
        accessControl, 
        patientRecords 
      } 
    };
  } catch (error) {
    console.error('Failed to initialize contracts:', error);
    throw error;
  }
};

// Register a new patient
const registerPatient = async (patientAddress, patientName, patientDOB) => {
  try {
    const { accounts, contracts } = await initContracts();
    
    // Call the registerPatient function in EHRRegistry contract
    await contracts.ehrRegistry.methods
      .registerPatient(patientAddress, patientName, patientDOB)
      .send({ from: accounts[0] });
      
    return true;
  } catch (error) {
    console.error('Failed to register patient:', error);
    throw error;
  }
};

// Register a new doctor
const registerDoctor = async (doctorAddress, doctorName, specialization, hospitalId) => {
  try {
    const { accounts, contracts } = await initContracts();
    
    // Call the registerDoctor function in EHRRegistry contract
    await contracts.ehrRegistry.methods
      .registerDoctor(doctorAddress, doctorName, specialization, hospitalId)
      .send({ from: accounts[0] });
      
    return true;
  } catch (error) {
    console.error('Failed to register doctor:', error);
    throw error;
  }
};

// Get patient details
const getPatientDetails = async (patientAddress) => {
  try {
    const { contracts } = await initContracts();
    
    // Call the getPatient function in EHRRegistry contract
    const patientDetails = await contracts.ehrRegistry.methods
      .getPatient(patientAddress)
      .call();
      
    return patientDetails;
  } catch (error) {
    console.error('Failed to get patient details:', error);
    throw error;
  }
};

// Create a medical record
const createMedicalRecord = async (patientAddress, recordType, recordData, encryptionKey) => {
  try {
    const { accounts, contracts } = await initContracts();
    
    // Call the createRecord function in PatientRecords contract
    await contracts.patientRecords.methods
      .createRecord(patientAddress, recordType, recordData, encryptionKey)
      .send({ from: accounts[0] });
      
    return true;
  } catch (error) {
    console.error('Failed to create medical record:', error);
    throw error;
  }
};

// Get patient records
const getPatientRecords = async (patientAddress) => {
  try {
    const { contracts } = await initContracts();
    
    // Call the getPatientRecords function in PatientRecords contract
    const recordCount = await contracts.patientRecords.methods
      .getRecordCount(patientAddress)
      .call();
      
    const records = [];
    
    for (let i = 0; i < recordCount; i++) {
      const record = await contracts.patientRecords.methods
        .getRecord(patientAddress, i)
        .call();
        
      records.push(record);
    }
    
    return records;
  } catch (error) {
    console.error('Failed to get patient records:', error);
    throw error;
  }
};

// Grant access to a doctor
const grantAccess = async (doctorAddress) => {
  try {
    const { accounts, contracts } = await initContracts();
    
    // Call the grantAccess function in AccessControl contract
    await contracts.accessControl.methods
      .grantAccess(doctorAddress)
      .send({ from: accounts[0] });
      
    return true;
  } catch (error) {
    console.error('Failed to grant access:', error);
    throw error;
  }
};

// Check if a doctor has access to a patient's records
const checkAccess = async (patientAddress, doctorAddress) => {
  try {
    const { contracts } = await initContracts();
    
    // Call the hasAccess function in AccessControl contract
    const hasAccess = await contracts.accessControl.methods
      .hasAccess(patientAddress, doctorAddress)
      .call();
      
    return hasAccess;
  } catch (error) {
    console.error('Failed to check access:', error);
    throw error;
  }
};

export {
  initContracts,
  registerPatient,
  registerDoctor,
  getPatientDetails,
  createMedicalRecord,
  getPatientRecords,
  grantAccess,
  checkAccess
};
EOF

# Copy to doctor dashboard
cp /home/vanir/ehr-blockchain/frontend/patient-portal/src/services/contractService.js /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/services/
```

## 4. Create Basic UI Components for Patient Portal

```bash
# Create components directory
mkdir -p /home/vanir/ehr-blockchain/frontend/patient-portal/src/components

# Create PatientRegistration component
cat << EOF > /home/vanir/ehr-blockchain/frontend/patient-portal/src/components/PatientRegistration.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material';
import { registerPatient } from '../services/contractService';

const PatientRegistration = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Get current Ethereum account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      // Register patient
      await registerPatient(currentAccount, name, dob);
      
      setSuccess(true);
      setName('');
      setDob('');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Patient Registration
        </Typography>
        
        {success && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography>Registration successful!</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default PatientRegistration;
EOF

# Create MedicalRecords component
cat << EOF > /home/vanir/ehr-blockchain/frontend/patient-portal/src/components/MedicalRecords.js
import React, { useState, useEffect } from 'react';
import { 
  Typography, Paper, Container, List, ListItem, ListItemText, 
  Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, CircularProgress, Box 
} from '@mui/material';
import { getPatientRecords, createMedicalRecord } from '../services/contractService';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: '',
    data: '',
    encryptionKey: ''
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      const patientRecords = await getPatientRecords(currentAccount);
      setRecords(patientRecords);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateRecord = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      await createMedicalRecord(
        currentAccount, 
        newRecord.type, 
        newRecord.data, 
        newRecord.encryptionKey
      );
      
      setOpenDialog(false);
      setNewRecord({ type: '', data: '', encryptionKey: '' });
      fetchRecords();
    } catch (err) {
      console.error('Error creating record:', err);
      setError('Failed to create record. ' + err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            Medical Records
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Add New Record
          </Button>
        </Box>
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : records.length > 0 ? (
          <List>
            {records.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={record.recordType}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Created: {new Date(record.timestamp * 1000).toLocaleString()}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Data: {record.data}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center" sx={{ my: 4 }}>
            No medical records found.
          </Typography>
        )}
      </Paper>
      
      {/* Dialog for creating new record */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Medical Record</DialogTitle>
        <DialogContent>
          <TextField
            label="Record Type"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRecord.type}
            onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
            required
          />
          <TextField
            label="Record Data"
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            value={newRecord.data}
            onChange={(e) => setNewRecord({...newRecord, data: e.target.value})}
            required
          />
          <TextField
            label="Encryption Key (Optional)"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRecord.encryptionKey}
            onChange={(e) => setNewRecord({...newRecord, encryptionKey: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRecord} color="primary" variant="contained">
            Create Record
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecords;
EOF

# Update App.js to include these components
cat << EOF > /home/vanir/ehr-blockchain/frontend/patient-portal/src/App.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, Container, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PatientRegistration from './components/PatientRegistration';
import MedicalRecords from './components/MedicalRecords';
import { initContracts } from './services/contractService';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [tab, setTab] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await initContracts();
        setInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to connect to blockchain. Please make sure MetaMask is installed and connected to the correct network.');
      }
    };

    init();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Patient Health Records Portal
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        {error ? (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        ) : !initialized ? (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography>Connecting to blockchain...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
              <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="Registration" />
                <Tab label="Medical Records" />
              </Tabs>
            </Box>
            <Box sx={{ py: 3 }}>
              {tab === 0 && <PatientRegistration />}
              {tab === 1 && <MedicalRecords />}
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
EOF
```

## 5. Create Basic UI Components for Doctor Dashboard

```bash
# Create components directory
mkdir -p /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/components

# Create DoctorRegistration component
cat << EOF > /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/components/DoctorRegistration.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { registerDoctor } from '../services/contractService';

const DoctorRegistration = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalId, setHospitalId] = useState('1'); // Default to Hospital 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Get current Ethereum account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      // Register doctor
      await registerDoctor(currentAccount, name, specialization, hospitalId);
      
      setSuccess(true);
      setName('');
      setSpecialization('');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Doctor Registration
        </Typography>
        
        {success && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography>Registration successful!</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <TextField
            label="Specialization"
            fullWidth
            margin="normal"
            variant="outlined"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Hospital</InputLabel>
            <Select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              label="Hospital"
              required
            >
              <MenuItem value="1">Hospital 1</MenuItem>
              <MenuItem value="2">Hospital 2</MenuItem>
              <MenuItem value="3">Hospital 3</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default DoctorRegistration;
EOF

# Create PatientRecordsViewer component
cat << EOF > /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/components/PatientRecordsViewer.js
import React, { useState } from 'react';
import { 
  TextField, Button, Box, Typography, Paper, Container, 
  List, ListItem, ListItemText, CircularProgress, Divider 
} from '@mui/material';
import { getPatientDetails, getPatientRecords, checkAccess } from '../services/contractService';

const PatientRecordsViewer = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPatient(null);
    setRecords([]);
    setHasAccess(false);

    try {
      // Get current Ethereum account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      // Check if doctor has access to patient records
      const access = await checkAccess(patientAddress, currentAccount);
      setHasAccess(access);
      
      // Get patient details
      const patientDetails = await getPatientDetails(patientAddress);
      setPatient(patientDetails);
      
      // Get patient records if has access
      if (access) {
        const patientRecords = await getPatientRecords(patientAddress);
        setRecords(patientRecords);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to fetch patient data. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Patient Records Viewer
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSearch}>
          <Box display="flex" gap={2}>
            <TextField
              label="Patient Ethereum Address"
              fullWidth
              variant="outlined"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </form>
        
        {patient && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Patient Information</Typography>
            <Typography><strong>Name:</strong> {patient.name}</Typography>
            <Typography><strong>DOB:</strong> {patient.dateOfBirth}</Typography>
            <Typography><strong>Address:</strong> {patient.patientAddress}</Typography>
            
            {!hasAccess && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography>You do not have access to this patient's medical records.</Typography>
              </Box>
            )}
          </Box>
        )}
        
        {hasAccess && records.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Medical Records</Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {records.map((record, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={record.recordType}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Created: {new Date(record.timestamp * 1000).toLocaleString()}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Data: {record.data}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {hasAccess && records.length === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography>No medical records found for this patient.</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PatientRecordsViewer;
EOF

# Update App.js for Doctor Dashboard
cat << EOF > /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/App.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, Container, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DoctorRegistration from './components/DoctorRegistration';
import PatientRecordsViewer from './components/PatientRecordsViewer';
import { initContracts } from './services/contractService';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [tab, setTab] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await initContracts();
        setInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to connect to blockchain. Please make sure MetaMask is installed and connected to the correct network.');
      }
    };

    init();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Doctor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        {error ? (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        ) : !initialized ? (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography>Connecting to blockchain...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider',# Create components directory
mkdir -p /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/components

# Create DoctorRegistration component
cat << EOF > /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/components/DoctorRegistration.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { registerDoctor } from '../services/contractService';

const DoctorRegistration = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospitalId, setHospitalId] = useState('1'); // Default to Hospital 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Get current Ethereum account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      // Register doctor
      await registerDoctor(currentAccount, name, specialization, hospitalId);
      
      setSuccess(true);
      setName('');
      setSpecialization('');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Doctor Registration
        </Typography>
        
        {success && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography>Registration successful!</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <TextField
            label="Specialization"
            fullWidth
            margin="normal"
            variant="outlined"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Hospital</InputLabel>
            <Select
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              label="Hospital"
              required
            >
              <MenuItem value="1">Hospital 1</MenuItem>
              <MenuItem value="2">Hospital 2</MenuItem>
              <MenuItem value="3">Hospital 3</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default DoctorRegistration;
EOF

# Create PatientRecordsViewer component
cat << EOF > /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/components/PatientRecordsViewer.js
import React, { useState } from 'react';
import { 
  TextField, Button, Box, Typography, Paper, Container, 
  List, ListItem, ListItemText, CircularProgress, Divider 
} from '@mui/material';
import { getPatientDetails, getPatientRecords, checkAccess } from '../services/contractService';

const PatientRecordsViewer = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPatient(null);
    setRecords([]);
    setHasAccess(false);

    try {
      // Get current Ethereum account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      
      // Check if doctor has access to patient records
      const access = await checkAccess(patientAddress, currentAccount);
      setHasAccess(access);
      
      // Get patient details
      const patientDetails = await getPatientDetails(patientAddress);
      setPatient(patientDetails);
      
      // Get patient records if has access
      if (access) {
        const patientRecords = await getPatientRecords(patientAddress);
        setRecords(patientRecords);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to fetch patient data. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Patient Records Viewer
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSearch}>
          <Box display="flex" gap={2}>
            <TextField
              label="Patient Ethereum Address"
              fullWidth
              variant="outlined"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </form>
        
        {patient && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Patient Information</Typography>
            <Typography><strong>Name:</strong> {patient.name}</Typography>
            <Typography><strong>DOB:</strong> {patient.dateOfBirth}</Typography>
            <Typography><strong>Address:</strong> {patient.patientAddress}</Typography>
            
            {!hasAccess && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography>You do not have access to this patient's medical records.</Typography>
              </Box>
            )}
          </Box>
        )}
        
        {hasAccess && records.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Medical Records</Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {records.map((record, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={record.recordType}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Created: {new Date(record.timestamp * 1000).toLocaleString()}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Data: {record.data}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {hasAccess && records.length === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography>No medical records found for this patient.</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PatientRecordsViewer;
EOF

# Update App.js for Doctor Dashboard
cat << EOF > /home/vanir/ehr-blockchain/frontend/doctor-dashboard/src/App.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, Container, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DoctorRegistration from './components/DoctorRegistration';
import PatientRecordsViewer from './components/PatientRecordsViewer';
import { initContracts } from './services/contractService';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [tab, setTab] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await initContracts();
        setInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to connect to blockchain. Please make sure MetaMask is installed and connected to the correct network.');
      }
    };

    init();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Doctor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        {error ? (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        ) : !initialized ? (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography>Connecting to blockchain...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider',

Similar code found with 1 license type



Sorry, the response hit the length limit. Please rephrase your prompt.