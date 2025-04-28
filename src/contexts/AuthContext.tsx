/**
 * Authentication Context
 * 
 * This module provides a React context for authentication state and functions.
 * It manages user authentication, login/logout, and token refresh.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, User, LoginCredentials, RegisterData, UpdateProfileRequest } from '@/services/api/authService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isAuthenticated()) {
          // Get current user data
          const response = await authService.getCurrentUser();
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        // If there's an error, clear auth state
        await authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Clean up auth service event listeners on unmount
    return () => {
      authService.cleanup();
    };
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.user.firstName}!`,
      });
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Login failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.data.user.firstName}!`,
      });
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Registration failed",
        description: err.message || "Could not create account",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (err: any) {
      setError(err);
      toast({
        title: "Logout error",
        description: err.message || "Error during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: UpdateProfileRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(data);
      setUser(response.data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Update failed",
        description: err.message || "Could not update profile",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Protected Route component to restrict access to authenticated users
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      // Store the current location to redirect back after login
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        localStorage.setItem('auth_redirect', currentPath);
      }
      // Redirect to login
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
    }
  }, [isAuthenticated, isLoading, redirectTo, isRedirecting]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthContext;
