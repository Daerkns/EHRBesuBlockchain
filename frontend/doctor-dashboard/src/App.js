import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Paper, Tabs, Tab, CssBaseline, 
  ThemeProvider, createTheme, useMediaQuery, AppBar, Toolbar
} from '@mui/material';
import DoctorRegistration from './components/DoctorRegistration';
import PatientRecords from './components/PatientRecords';
import ContractDebugger from './components/ContractDebugger';
import { isRegisteredDoctor } from './services/doctorService';
import seedTestData from './utils/seedTestData';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [value, setValue] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checking, setChecking] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Seed test data for development
    seedTestData();
    
    const checkRegistration = async () => {
      try {
        const registered = await isRegisteredDoctor();
        setIsRegistered(registered);
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setChecking(false);
      }
    };

    checkRegistration();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : "disabled"}
            >
              <Tab label="Registration" />
              <Tab label="Patient Records" />
              <Tab label="Debug Contracts" />
            </Tabs>
          </Paper>
          
          {value === 0 && (
            <DoctorRegistration />
          )}
          {value === 1 && (
            <>
              {checking ? (
                <Typography>Checking registration status...</Typography>
              ) : isRegistered ? (
                <PatientRecords />
              ) : (
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h5" color="error" gutterBottom>
                    Registration Required
                  </Typography>
                  <Typography variant="body1">
                    You need to register as a doctor before you can access patient records.
                    Please go to the Registration tab to complete your registration.
                  </Typography>
                </Paper>
              )}
            </>
          )}
          {value === 2 && (
            <ContractDebugger />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
