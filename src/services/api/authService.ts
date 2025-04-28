/**
 * Authentication Service API
 * 
 * This module provides API methods for authentication-related operations,
 * including login, registration, password reset, and token management.
 */

import { apiClient, ApiResponse } from './apiClient';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'developer' | 'client' | 'guest';
  avatar?: string;
  teams?: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

/**
 * Authentication Service class for auth-related API operations
 */
class AuthService {
  private readonly basePath = '/auth';
  private readonly userPath = '/users';
  private readonly storageKeyPrefix = 'genius_navigator_';
  
  // Storage keys
  private readonly accessTokenKey = `${this.storageKeyPrefix}access_token`;
  private readonly refreshTokenKey = `${this.storageKeyPrefix}refresh_token`;
  private readonly userKey = `${this.storageKeyPrefix}user`;

  constructor() {
    // Initialize auth tokens from storage if available
    this.initializeFromStorage();

    // Set up auth error event listener
    window.addEventListener('auth:error', this.handleAuthError);
  }

  /**
   * Initialize auth tokens from storage
   */
  private initializeFromStorage(): void {
    const accessToken = localStorage.getItem(this.accessTokenKey);
    if (accessToken) {
      apiClient.setAuthToken(accessToken);
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError = async (event: Event): Promise<void> => {
    const customEvent = event as CustomEvent;
    console.log('Auth error:', customEvent.detail);
    
    // Try to refresh the token if it's expired
    if (customEvent.detail?.status === 401) {
      try {
        await this.refreshToken();
      } catch (error) {
        // If refresh fails, log out the user
        this.logout();
        // Redirect to login page
        window.location.href = '/auth/login';
      }
    }
  };

  /**
   * Login with email and password
   */
  public async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      `${this.basePath}/login`,
      credentials
    );
    
    // Store tokens and user data
    this.setTokens(response.data.tokens);
    this.setUser(response.data.user);
    
    return response;
  }

  /**
   * Register a new user
   */
  public async register(data: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      `${this.basePath}/register`,
      data
    );
    
    // Store tokens and user data
    this.setTokens(response.data.tokens);
    this.setUser(response.data.user);
    
    return response;
  }

  /**
   * Logout the current user
   */
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint if user is logged in
      if (this.isAuthenticated()) {
        await apiClient.post<void>(`${this.basePath}/logout`, {
          refreshToken: localStorage.getItem(this.refreshTokenKey)
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear tokens and user data regardless of API call result
      this.clearAuth();
    }
  }

  /**
   * Refresh the access token using the refresh token
   */
  public async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post<AuthTokens>(
      `${this.basePath}/refresh-token`,
      { refreshToken }
    );
    
    // Store new tokens
    this.setTokens(response.data);
    
    return response;
  }

  /**
   * Request a password reset
   */
  public async requestPasswordReset(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      `${this.basePath}/request-password-reset`,
      data
    );
  }

  /**
   * Reset password with token
   */
  public async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      `${this.basePath}/reset-password`,
      { token, newPassword }
    );
  }

  /**
   * Change password
   */
  public async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      `${this.userPath}/change-password`,
      data
    );
  }

  /**
   * Get the current user
   */
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<User>(`${this.userPath}/me`);
    
    // Update stored user data
    this.setUser(response.data);
    
    return response;
  }

  /**
   * Update user profile
   */
  public async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.put<User>(`${this.userPath}/profile`, data);
    
    // Update stored user data
    this.setUser(response.data);
    
    return response;
  }

  /**
   * Check if the user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  /**
   * Get the current user from storage
   */
  public getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Get the access token
   */
  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  /**
   * Set authentication tokens
   */
  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
    apiClient.setAuthToken(tokens.accessToken);
  }

  /**
   * Set user data
   */
  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    apiClient.setAuthToken(null);
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    window.removeEventListener('auth:error', this.handleAuthError);
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Export the class for testing or custom instances
export default AuthService;
