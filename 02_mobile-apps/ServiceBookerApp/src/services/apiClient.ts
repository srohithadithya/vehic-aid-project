// ServiceBookerApp/src/services/apiClient.ts

import axios from 'axios';
import { Alert } from 'react-native';
import * as AuthService from './authService'; // Import the service that handles tokens

// NOTE: Use the host machine's IP (10.0.2.2 for Android Emulator) for development.
const BASE_URL = 'http://10.0.2.2:8000/api/v1/'; 

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for requests
});

// --- Request Interceptor (JWT Token Handling) ---
apiClient.interceptors.request.use(async (config) => {
  const token = await AuthService.getAccessToken();
  
  if (token) {
    // Attach token for authenticated endpoints
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Response Interceptor (Global Error Handling) ---
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401 || status === 403) {
      // Token expired or Unauthorized. Force user logout.
      AuthService.logout();
      Alert.alert('Session Expired', 'Please log in again.');
    } else if (status === 400 || status === 500) {
      // Handle server validation errors or internal errors
      console.error("API Error Response:", error.response.data);
      throw new Error(error.response.data.detail || 'A server error occurred.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;