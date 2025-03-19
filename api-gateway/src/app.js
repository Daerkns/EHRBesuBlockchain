const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { initIPFS } = require('./services/ipfs');
const { loadContracts } = require('./services/blockchain');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize services
const initServices = async () => {
  try {
    // Initialize IPFS
    await initIPFS();
    
    // Load blockchain contracts
    await loadContracts();
    
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
};

// Import routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, async () => {
  console.log(`API Gateway running on port ${PORT}`);
  await initServices();
});

module.exports = app;
