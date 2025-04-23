import axios from 'axios';

// Base API URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.geniusonlinenavigator.com';

// Create a base axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced API client with interceptors for authentication, error handling, etc.
export const enhancedApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
enhancedApiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or secure storage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
enhancedApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken,
          });
          
          const { token } = response.data;
          
          // Update token in storage
          localStorage.setItem('auth_token', token);
          
          // Update Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return enhancedApiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        
        // Clear tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        // Redirect to login (in a real app, this would use a router)
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// For mock API responses during development
export const mockApiResponse = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

export default apiClient;
