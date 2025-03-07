import axios from 'axios';

/**
 * API Service Configuration
 * 
 * Single Responsibility: Configure and provide the API client
 */
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Setup request interceptor to add auth token
 * @param {string} token - JWT token
 */
const setupAuthInterceptor = (token) => {
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

/**
 * Setup response interceptor to handle auth errors
 * @param {Function} logoutCallback - Function to call when auth fails
 */
const setupResponseInterceptor = (logoutCallback) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle authentication errors
      if (error.response?.status === 401 && logoutCallback) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};

export { 
  apiClient, 
  setupAuthInterceptor, 
  setupResponseInterceptor 
};