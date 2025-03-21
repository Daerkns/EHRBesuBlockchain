import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  CircularProgress, 
  Chip, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createAuthAxios } from '../services/authService';

const SystemMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSystemStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authAxios = createAuthAxios();
      
      // Fetch services status
      const servicesResponse = await authAxios.get('/monitor/services');
      setServices(servicesResponse.data);
      
      // Fetch blockchain nodes status
      const nodesResponse = await authAxios.get('/monitor/nodes');
      setNodes(nodesResponse.data);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching system status:', error);
      setError('Failed to fetch system status. Please try again later.');
      
      // Set mock data for development
      setServices([
        { id: 'auth-service', name: 'Authentication Service', status: 'healthy', uptime: '2d 5h 30m', url: 'http://localhost:4000' },
        { id: 'api-gateway', name: 'API Gateway', status: 'healthy', uptime: '2d 5h 30m', url: 'http://localhost:3000' },
        { id: 'ipfs', name: 'IPFS Node', status: 'healthy', uptime: '2d 5h 15m', url: 'http://localhost:5001' }
      ]);
      
      setNodes([
        { id: 'hospital1', name: 'Hospital 1', status: 'healthy', peers: 3, blocks: 1024, url: 'http://localhost:8545' },
        { id: 'hospital2', name: 'Hospital 2', status: 'healthy', peers: 3, blocks: 1024, url: 'http://localhost:8546' },
        { id: 'hospital3', name: 'Hospital 3 (Validator)', status: 'healthy', peers: 3, blocks: 1024, url: 'http://localhost:8547' },
        { id: 'hospital4', name: 'Hospital 4 (Validator)', status: 'healthy', peers: 3, blocks: 1024, url: 'http://localhost:8548' }
      ]);
      
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case 'healthy':
        return <Chip icon={<CheckCircleIcon />} label="Healthy" color="success" size="small" />;
      case 'degraded':
        return <Chip icon={<WarningIcon />} label="Degraded" color="warning" size="small" />;
      case 'down':
        return <Chip icon={<ErrorIcon />} label="Down" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          System Monitor
        </Typography>
        <Box>
          <Button 
            startIcon={<RefreshIcon />} 
            onClick={fetchSystemStatus}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
          {lastUpdated && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
      </Box>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Services
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Uptime</TableCell>
                      <TableCell>URL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{getStatusChip(service.status)}</TableCell>
                        <TableCell>{service.uptime}</TableCell>
                        <TableCell>{service.url}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Blockchain Nodes
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Node</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Peers</TableCell>
                      <TableCell>Blocks</TableCell>
                      <TableCell>RPC URL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nodes.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell>{node.name}</TableCell>
                        <TableCell>{getStatusChip(node.status)}</TableCell>
                        <TableCell>{node.peers}</TableCell>
                        <TableCell>{node.blocks}</TableCell>
                        <TableCell>{node.url}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SystemMonitor;
