import React, { useState } from 'react';
import { Paper, Typography, Box, Button, CircularProgress, Divider } from '@mui/material';
import { getWeb3 } from '../services/web3Service'; // Changed from initWeb3 to getWeb3
import EHRRegistryABI from '../contracts/EHRRegistry.json';
import AccessControlABI from '../contracts/AccessControl.json';
import PatientRecordsABI from '../contracts/PatientRecords.json';
import CONTRACT_ADDRESSES from '../config/contracts';

const ContractDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState(null);
  const [account, setAccount] = useState('');
  const [contractMethods, setContractMethods] = useState({
    ehrRegistry: [],
    accessControl: [],
    patientRecords: []
  });

  const initializeDebugger = async () => {
    setLoading(true);
    try {
      // Initialize Web3
      const web3 = await getWeb3(); // Changed from initWeb3() to getWeb3()
      
      // Get current account
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      
      // Initialize contracts
      const ehrRegistry = new web3.eth.Contract(
        EHRRegistryABI.abi,
        CONTRACT_ADDRESSES.EHRRegistry
      );
      
      const accessControl = new web3.eth.Contract(
        AccessControlABI.abi,
        CONTRACT_ADDRESSES.AccessControl
      );
      
      const patientRecords = new web3.eth.Contract(
        PatientRecordsABI.abi,
        CONTRACT_ADDRESSES.PatientRecords
      );
      
      setContracts({ ehrRegistry, accessControl, patientRecords });
      
      // Extract methods
      setContractMethods({
        ehrRegistry: Object.keys(ehrRegistry.methods).filter(method => !method.includes('(')),
        accessControl: Object.keys(accessControl.methods).filter(method => !method.includes('(')),
        patientRecords: Object.keys(patientRecords.methods).filter(method => !method.includes('('))
      });
      
    } catch (error) {
      console.error('Error initializing debugger:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Smart Contract Debugger
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">
          Contract Addresses:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><Typography variant="body2">EHRRegistry: {CONTRACT_ADDRESSES.EHRRegistry}</Typography></li>
          <li><Typography variant="body2">AccessControl: {CONTRACT_ADDRESSES.AccessControl}</Typography></li>
          <li><Typography variant="body2">PatientRecords: {CONTRACT_ADDRESSES.PatientRecords}</Typography></li>
        </Box>
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={initializeDebugger}
        disabled={loading}
        sx={{ mt: 2, mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Analyze Contracts'}
      </Button>
      
      {account && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Connected Account: {account}
        </Typography>
      )}
      
      {contracts && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6">EHRRegistry Methods:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {contractMethods.ehrRegistry.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6">AccessControl Methods:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {contractMethods.accessControl.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6">PatientRecords Methods:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {contractMethods.patientRecords.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ContractDebugger;
