import axios from 'axios';

// API Gateway URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Store JWT token in localStorage
const setToken = (token) => {
  localStorage.setItem('ehr_doctor_token', token);
};

// Get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('ehr_doctor_token');
};

// Remove JWT token from localStorage
const removeToken = () => {
  localStorage.removeItem('ehr_doctor_token');
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Get authenticated user info
const getUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Decode JWT payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Register a new doctor
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// Login doctor
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout doctor
const logout = () => {
  removeToken();
};

// Get doctor profile
const getProfile = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting profile:', error.response?.data || error.message);
    throw error;
  }
};

// Create axios instance with auth header
const createAuthAxios = () => {
  const token = getToken();
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};

export {
  register,
  login,
  logout,
  getProfile,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  getUser,
  createAuthAxios
};
