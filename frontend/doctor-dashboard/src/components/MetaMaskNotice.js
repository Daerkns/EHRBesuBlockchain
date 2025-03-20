import React from 'react';
import { Box, Typography, Link, Alert } from '@mui/material';

const MetaMaskNotice = () => {
  return (
    <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="body1">
        This application requires MetaMask to interact with the blockchain. 
        {!window.ethereum && (
          <> Please <Link href="https://metamask.io/download/" target="_blank" rel="noopener">
            install MetaMask
          </Link> to use this application.</>
        )}
      </Typography>
      
      <Box mt={2}>
        <Typography variant="body2">
          Once connected, please ensure your MetaMask is set to the correct network:
        </Typography>
        <ul>
          <li>Network Name: EHR Blockchain</li>
          <li>RPC URL: http://localhost:8545</li>
          <li>Chain ID: 2018</li>
          <li>Currency Symbol: ETH</li>
        </ul>
      </Box>
    </Alert>
  );
};

export default MetaMaskNotice;
