import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component
 * Ensures that only authenticated users can access certain routes
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  // Check authentication status when component mounts
  useEffect(() => {
    console.log('[ProtectedRoute] useEffect: dispatching checkAuthStatus');
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    console.log('[ProtectedRoute] isLoading:', isLoading);
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Render children if authenticated
  console.log('[ProtectedRoute] Authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
