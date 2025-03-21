import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  useMediaQuery, 
  AppBar, 
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

// Components
import DoctorRegistration from './components/DoctorRegistration';
import PatientRecords from './components/PatientRecords';
import ContractDebugger from './components/ContractDebugger';
import SystemMonitor from './components/SystemMonitor';
import Login from './components/Login';
import Register from './components/Register';

// Services
import { isRegisteredDoctor } from './services/doctorService';
import { isAuthenticated, getUser, logout } from './services/authService';

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
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      
      if (isAuth) {
        setUser(getUser());
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!authenticated) return;
      
      try {
        setChecking(true);
        const registered = await isRegisteredDoctor();
        setIsRegistered(registered);
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setChecking(false);
      }
    };

    checkRegistration();
  }, [authenticated]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleAuthSuccess = (userData, view) => {
    if (userData) {
      setAuthenticated(true);
      setUser(userData);
    } else if (view) {
      setAuthView(view);
    }
  };
  
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    setUserMenuAnchor(null);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Dashboard
          </Typography>
          
          {authenticated && user && (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleUserMenuOpen}
                aria-controls="user-menu"
                aria-haspopup="true"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    Signed in as <strong>{user.username}</strong>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {authenticated ? (
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 3 }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : "disabled"}
              >
                <Tab label="My Profile" />
                <Tab label="Patient Records" />
                <Tab label="System Monitor" icon={<MonitorHeartIcon />} iconPosition="start" />
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
                      Please go to the Profile tab to complete your registration.
                    </Typography>
                  </Paper>
                )}
              </>
            )}
            {value === 2 && (
              <SystemMonitor />
            )}
            {value === 3 && (
              <ContractDebugger />
            )}
          </Box>
        ) : (
          <Box sx={{ py: 3 }}>
            {authView === 'login' ? (
              <Login onLoginSuccess={handleAuthSuccess} />
            ) : (
              <Register onRegisterSuccess={handleAuthSuccess} />
            )}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
