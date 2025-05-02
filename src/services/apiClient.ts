
import axios from 'axios';

// Base API client with common configuration
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with non-2xx status
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error, no response received:', error.request);
    } else {
      // Request setup error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Enhanced API client with retry and additional features
export const enhancedApiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
enhancedApiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor with retry mechanism
let isRetrying = false;
enhancedApiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Implement retry logic for network errors and certain status codes
    if (
      (error.code === 'ECONNABORTED' || !error.response) && 
      originalRequest && 
      !originalRequest._retry && 
      !isRetrying
    ) {
      originalRequest._retry = true;
      isRetrying = true;
      
      try {
        console.log('Retrying request after network error...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        const response = await enhancedApiClient(originalRequest);
        isRetrying = false;
        return response;
      } catch (retryError) {
        isRetrying = false;
        return Promise.reject(retryError);
      }
    }
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Mock API for development
export const mockApiResponse = <T>(data: T): T => {
  return data;
};

// Export default client
export default apiClient;
