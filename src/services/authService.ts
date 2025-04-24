import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Define API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// JWT token interface
export interface JwtToken {
  sub: string; // user id
  email: string;
  role: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  avatar?: string;
}

// Auth response interface
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register data interface
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Authentication service for handling JWT tokens and user authentication
 */
class AuthService {
  /**
   * Login user with email and password
   * @param credentials - User credentials
   * @returns Auth response with token and user data
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`,
        credentials
      );
      
      // Store token in localStorage
      this.setToken(response.data.access_token);
      
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Register a new user
   * @param data - User registration data
   * @returns Auth response with token and user data
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/register`,
        data
      );
      
      // Store token in localStorage
      this.setToken(response.data.access_token);
      
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Logout user by removing token
   */
  logout(): void {
    localStorage.removeItem('token');
    // Remove auth header from axios
    delete axios.defaults.headers.common['Authorization'];
  }
  
  /**
   * Get current user data from token
   * @returns User data or null if not authenticated
   */
  getCurrentUser(): User | null {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }
    
    try {
      const decoded = this.decodeToken(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }
      
      // Return user data from token
      return {
        id: decoded.sub,
        email: decoded.email,
        firstName: '', // These fields are not in the token
        lastName: '',  // We would need to fetch them from the API
        role: decoded.role as 'admin' | 'user',
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
      return null;
    }
  }
  
  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get user profile data
   * @returns User profile data
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Update user profile
   * @param data - User profile data to update
   * @returns Updated user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axios.put<User>(`${API_URL}/auth/profile`, data);
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Success message
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(
        `${API_URL}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Request password reset
   * @param email - User email
   * @returns Success message
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(
        `${API_URL}/auth/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Reset password with token
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Success message
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(
        `${API_URL}/auth/reset-password`,
        {
          token,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Refresh token
   * @returns New auth response
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/refresh-token`
      );
      
      // Store new token
      this.setToken(response.data.access_token);
      
      return response.data;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }
  
  /**
   * Set token in localStorage and axios headers
   * @param token - JWT token
   */
  private setToken(token: string): void {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  /**
   * Get token from localStorage
   * @returns JWT token or null
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  /**
   * Decode JWT token
   * @param token - JWT token
   * @returns Decoded token
   */
  private decodeToken(token: string): JwtToken {
    return jwtDecode<JwtToken>(token);
  }
  
  /**
   * Handle authentication errors
   * @param error - Error object
   */
  private handleAuthError(error: any): void {
    if (axios.isAxiosError(error)) {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        this.logout();
      }
      
      // Extract error message
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Authentication error:', errorMessage);
    } else {
      console.error('Authentication error:', error);
    }
  }
}

// Create singleton instance
const authService = new AuthService();

// Initialize axios interceptor for adding auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Initialize axios interceptor for handling token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        await authService.refreshToken();
        
        // Retry original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default authService;
