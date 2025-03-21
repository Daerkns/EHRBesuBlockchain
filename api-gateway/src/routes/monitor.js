const express = require('express');
const router = express.Router();
const axios = require('axios');
const { web3 } = require('../services/blockchain');
const authMiddleware = require('../middleware/auth');

// Get status of all services
router.get('/services', authMiddleware, async (req, res) => {
  try {
    const services = [];
    
    // Check Auth Service
    try {
      const authResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/health`, { timeout: 3000 });
      services.push({
        id: 'auth-service',
        name: 'Authentication Service',
        status: authResponse.status === 200 ? 'healthy' : 'degraded',
        uptime: authResponse.data?.uptime || 'Unknown',
        url: process.env.AUTH_SERVICE_URL
      });
    } catch (error) {
      services.push({
        id: 'auth-service',
        name: 'Authentication Service',
        status: 'down',
        uptime: 'N/A',
        url: process.env.AUTH_SERVICE_URL
      });
    }
    
    // Check API Gateway (self)
    services.push({
      id: 'api-gateway',
      name: 'API Gateway',
      status: 'healthy', // Since we're responding, we're healthy
      uptime: process.uptime().toFixed(0) + 's',
      url: `http://localhost:${process.env.PORT || 3000}`
    });
    
    // Check IPFS
    try {
      const ipfsUrl = process.env.IPFS_API_URL || '/ip4/127.0.0.1/tcp/5001';
      const ipfsResponse = await axios.post(`${ipfsUrl}/api/v0/version`, {}, { timeout: 3000 });
      services.push({
        id: 'ipfs',
        name: 'IPFS Node',
        status: ipfsResponse.status === 200 ? 'healthy' : 'degraded',
        uptime: 'Unknown', // IPFS doesn't provide uptime in its API
        url: ipfsUrl
      });
    } catch (error) {
      services.push({
        id: 'ipfs',
        name: 'IPFS Node',
        status: 'down',
        uptime: 'N/A',
        url: process.env.IPFS_API_URL || '/ip4/127.0.0.1/tcp/5001'
      });
    }
    
    res.json(services);
  } catch (error) {
    console.error('Error getting services status:', error);
    res.status(500).json({ message: 'Failed to get services status' });
  }
});

// Get status of blockchain nodes
router.get('/nodes', authMiddleware, async (req, res) => {
  try {
    const nodes = [];
    const nodeUrls = [
      { id: 'hospital1', name: 'Hospital 1', url: 'http://localhost:8545' },
      { id: 'hospital2', name: 'Hospital 2', url: 'http://localhost:8546' },
      { id: 'hospital3', name: 'Hospital 3 (Validator)', url: 'http://localhost:8547' },
      { id: 'hospital4', name: 'Hospital 4 (Validator)', url: 'http://localhost:8548' }
    ];
    
    // Check each node
    for (const node of nodeUrls) {
      try {
        // Create a new web3 instance for this node
        const nodeWeb3 = new web3.constructor(node.url);
        
        // Get node info
        const [blockNumber, peerCount] = await Promise.all([
          nodeWeb3.eth.getBlockNumber(),
          nodeWeb3.eth.net.getPeerCount()
        ]);
        
        nodes.push({
          id: node.id,
          name: node.name,
          status: 'healthy',
          peers: peerCount,
          blocks: blockNumber,
          url: node.url
        });
      } catch (error) {
        console.error(`Error checking node ${node.id}:`, error);
        nodes.push({
          id: node.id,
          name: node.name,
          status: 'down',
          peers: 0,
          blocks: 0,
          url: node.url
        });
      }
    }
    
    res.json(nodes);
  } catch (error) {
    console.error('Error getting nodes status:', error);
    res.status(500).json({ message: 'Failed to get nodes status' });
  }
});

module.exports = router;
