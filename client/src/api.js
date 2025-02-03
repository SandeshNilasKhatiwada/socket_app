import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend URL

// Register a new user
export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Login user and return JWT token
export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

// Fetch all messages
export const fetchMessages = async () => {
  return axios.get(`${API_URL}/messages`);
};

// Send a message
export const sendMessageApi = async (messageData) => {
  return axios.post(`${API_URL}/messages`, messageData);
};
