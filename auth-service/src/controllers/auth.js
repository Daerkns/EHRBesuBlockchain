const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const Web3 = require('web3');

// Initialize Web3
const web3 = new Web3(process.env.BESU_NODE_URL || 'http://localhost:8545');

// Verify blockchain address ownership with signature
const verifyBlockchainAddress = async (address, signature, message) => {
  try {
    // Recover the address that signed the message
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error verifying blockchain address:', error);
    return false;
  }
};

// Generate a nonce for blockchain address verification
const generateNonce = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { 
      username, 
      password, 
      role, 
      name, 
      email, 
      blockchainAddress, 
      signature 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Verify blockchain address if provided
    if (blockchainAddress && signature) {
      const message = `Register ${username} with ${blockchainAddress} at ${Date.now()}`;
      const isVerified = await verifyBlockchainAddress(blockchainAddress, signature, message);
      
      if (!isVerified) {
        return res.status(400).json({ message: 'Blockchain address verification failed' });
      }
    }
    
    // Create new user
    const user = new User({
      username,
      password,
      role,
      name,
      email,
      blockchainAddress
    });
    
    await user.save();
    
    // Generate JWT token with blockchain address claim
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        blockchainAddress: user.blockchainAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        blockchainAddress: user.blockchainAddress
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password, signature, blockchainAddress } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If blockchain signature is provided, verify it
    if (signature && blockchainAddress) {
      // Verify that the blockchain address matches the user's registered address
      if (user.blockchainAddress !== blockchainAddress) {
        return res.status(401).json({ message: 'Blockchain address does not match registered address' });
      }
      
      const message = `Login ${username} with ${blockchainAddress} at ${Date.now()}`;
      const isVerified = await verifyBlockchainAddress(blockchainAddress, signature, message);
      
      if (!isVerified) {
        return res.status(401).json({ message: 'Blockchain signature verification failed' });
      }
    } else {
      // Traditional password authentication
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }
    
    // Generate JWT token with blockchain address claim
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        blockchainAddress: user.blockchainAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        blockchainAddress: user.blockchainAddress
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
