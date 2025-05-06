// Error reporting service for tracking and managing application errors
import { useEffect, useState } from 'react';

// Error interface
export interface AppError {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  status: 'new' | 'in-progress' | 'resolved';
  assignee?: string;
  component?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  browser?: string;
  os?: string;
}

// In-memory error store for demo purposes
// In a real app, this would be persisted to a database
let errors: AppError[] = [];

/**
 * Generate a unique ID for errors
 */
const generateErrorId = () => {
  return `error-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Get all logged errors
 */
export const getAllErrors = () => {
  return [...errors];
};

/**
 * Add a new error to the error log
 * @param message Error message
 * @param stack Error stack trace
 * @param component Component where error occurred
 * @returns The created error object
 */
export const addError = (
  message: string, 
  stack?: string,
  component?: string
): AppError => {
  const newError: AppError = {
    id: generateErrorId(),
    timestamp: Date.now(),
    message,
    stack,
    component,
    status: 'new',
    priority: 'medium',
    ...detectBrowser(),
  };
  
  errors = [newError, ...errors];
  return newError;
};

/**
 * Update the status of an error
 * @param errorId ID of the error to update
 * @param status New status
 * @returns Updated error or undefined if not found
 */
export const updateErrorStatus = (
  errorId: string, 
  status: AppError['status']
): AppError | undefined => {
  const errorIndex = errors.findIndex(err => err.id === errorId);
  if (errorIndex === -1) return undefined;
  
  const updatedError = {
    ...errors[errorIndex],
    status
  };
  
  errors = [
    ...errors.slice(0, errorIndex),
    updatedError,
    ...errors.slice(errorIndex + 1)
  ];
  
  return updatedError;
};

/**
 * Assign an error to a team member
 * @param errorId ID of the error to update
 * @param assignee Name of the assignee
 * @returns Updated error or undefined if not found
 */
export const assignError = (
  errorId: string, 
  assignee: string
): AppError | undefined => {
  const errorIndex = errors.findIndex(err => err.id === errorId);
  if (errorIndex === -1) return undefined;
  
  const updatedError = {
    ...errors[errorIndex],
    assignee,
    status: errors[errorIndex].status === 'new' ? 'in-progress' : errors[errorIndex].status
  };
  
  errors = [
    ...errors.slice(0, errorIndex),
    updatedError,
    ...errors.slice(errorIndex + 1)
  ];
  
  return updatedError;
};

/**
 * Calculate summary statistics for errors
 * @returns Summary statistics
 */
export const calculateErrorSummary = () => {
  return {
    total: errors.length,
    new: errors.filter(err => err.status === 'new').length,
    inProgress: errors.filter(err => err.status === 'in-progress').length,
    resolved: errors.filter(err => err.status === 'resolved').length,
    critical: errors.filter(err => err.priority === 'critical').length,
    high: errors.filter(err => err.priority === 'high').length,
    medium: errors.filter(err => err.priority === 'medium').length,
    low: errors.filter(err => err.priority === 'low').length,
  };
};

/**
 * Create an error boundary HOC for React components
 * @returns Error boundary component and error state
 */
export const createErrorBoundary = () => {
  // Implementation would go here
  // This is a simplified version
  return {
    ErrorBoundary: ({ children }: { children: React.ReactNode }) => {
      return <React.Fragment>{children}</React.Fragment>;
    },
    error: null
  };
};

/**
 * Clear all errors (for testing/demo purposes)
 */
export const clearErrors = () => {
  errors = [];
};

/**
 * Detect browser and OS information
 * @returns Browser and OS info
 */
export const detectBrowser = () => {
  if (typeof window === 'undefined') {
    return { browser: 'unknown', os: 'unknown' };
  }
  
  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  let os = 'unknown';
  
  // Simple detection logic
  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) browser = 'Internet Explorer';
  
  if (userAgent.indexOf('Windows') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS';
  
  return { browser, os };
};

/**
 * React hook for reporting errors
 * @param errorMessage Optional initial error message
 */
export const useErrorReporting = (errorMessage?: string) => {
  const [error, setError] = useState<AppError | null>(
    errorMessage ? 
      addError(errorMessage) :
      null
  );
  
  const reportError = (message: string, stack?: string, component?: string) => {
    const newError = addError(message, stack, component);
    setError(newError);
    return newError;
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return {
    error,
    reportError,
    clearError
  };
};

// No need to re-export as they're already exported above
