import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { isMetaMaskConnected, addAccountChangeListener, getAccount, getNetworkId } from '../services/web3Service';

const MetaMaskStatus = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await isMetaMaskConnected();
        setConnected(isConnected);
        
        if (isConnected) {
          const currentAccount = await getAccount();
          setAccount(currentAccount);
          
          const currentNetwork = await getNetworkId();
          setNetworkId(currentNetwork);
        }
      } catch (error) {
        console.error('Error checking MetaMask:', error);
      } finally {
        setChecking(false);
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    addAccountChangeListener((accounts) => {
      setConnected(accounts.length > 0);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount('');
      }
    });
    
    // We could also listen for network changes here
  }, []);

  const connectToMetaMask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = await getAccount();
      setAccount(currentAccount);
      setConnected(true);
      
      const currentNetwork = await getNetworkId();
      setNetworkId(currentNetwork);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  if (checking) {
    return null; // Don't show anything while checking
  }

  if (!window.ethereum) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="body1">
          MetaMask not detected. Please install MetaMask to use this application.
        </Typography>
        <Button 
          href="https://metamask.io/download/" 
          target="_blank" 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
        >
          Install MetaMask
        </Button>
      </Alert>
    );
  }

  if (!connected) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body1">
          Please connect to MetaMask to use this application.
        </Typography>
        <Button 
          onClick={connectToMetaMask} 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
        >
          Connect to MetaMask
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Network ID: {networkId}
      </Typography>
    </Box>
  );
};

export default MetaMaskStatus;
