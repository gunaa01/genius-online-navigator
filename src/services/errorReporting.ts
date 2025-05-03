import { v4 as uuidv4 } from 'uuid';

// Types
export interface ErrorEvent {
  id: string;
  message: string;
  stack: string;
  component: string;
  module: string;
  browser: string;
  os: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  path: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'ignored';
  priority: 'low' | 'medium' | 'high' | 'critical';
  occurrences: number;
  lastOccurrence: string;
  assignedTo?: string;
}

export interface ErrorSummary {
  total: number;
  new: number;
  investigating: number;
  resolved: number;
  ignored: number;
  byModule: Record<string, number>;
  byBrowser: Record<string, number>;
  byComponent: Record<string, number>;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

// In-memory storage for errors (in a real app, this would be a database)
let errors: ErrorEvent[] = [];

// Local storage key
const ERROR_STORAGE_KEY = 'genius_navigator_errors';

// Load errors from local storage
const loadErrors = (): ErrorEvent[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedErrors = localStorage.getItem(ERROR_STORAGE_KEY);
    return storedErrors ? JSON.parse(storedErrors) : [];
  } catch (error) {
    console.error('Failed to load errors from storage:', error);
    return [];
  }
};

// Save errors to local storage
const saveErrors = (errors: ErrorEvent[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(errors));
  } catch (error) {
    console.error('Failed to save errors to storage:', error);
  }
};

// Initialize errors from storage
const initializeErrors = (): void => {
  errors = loadErrors();
  
  // If no errors exist, add some sample errors for demonstration
  if (errors.length === 0) {
    // Add sample errors for demonstration
    errors = [
      {
        id: 'err-001',
        message: 'Cannot read properties of undefined (reading \'length\')',
        stack: 'TypeError: Cannot read properties of undefined (reading \'length\')\n    at ClientProjectList (ClientProjectList.tsx:45)\n    at renderWithHooks (react-dom.development.js:16305)',
        component: 'ClientProjectList',
        module: 'Client Portal',
        browser: 'Chrome 112',
        os: 'Windows 11',
        userId: 'user-123',
        userName: 'John Smith',
        userRole: 'Client',
        path: '/client-portal',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'new',
        priority: 'high',
        occurrences: 5,
        lastOccurrence: new Date().toISOString()
      }
    ];
    saveErrors(errors);
  }
};

// Initialize on import
initializeErrors();

// Get all errors
export const getAllErrors = (): ErrorEvent[] => {
  return [...errors];
};

// Add a new error
export const addError = (error: Omit<ErrorEvent, 'id' | 'timestamp' | 'occurrences' | 'lastOccurrence' | 'status' | 'priority'>): ErrorEvent => {
  // Check if a similar error already exists
  const existingErrorIndex = errors.findIndex(e => 
    e.message === error.message && 
    e.component === error.component
  );
  
  if (existingErrorIndex >= 0) {
    // Update existing error
    const updatedError = {
      ...errors[existingErrorIndex],
      occurrences: errors[existingErrorIndex].occurrences + 1,
      lastOccurrence: new Date().toISOString()
    };
    
    errors[existingErrorIndex] = updatedError;
    saveErrors(errors);
    return updatedError;
  } else {
    // Create new error
    const newError: ErrorEvent = {
      ...error,
      id: `err-${uuidv4().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
      lastOccurrence: new Date().toISOString(),
      occurrences: 1,
      status: 'new',
      priority: determinePriority(error.message)
    };
    
    errors.push(newError);
    saveErrors(errors);
    return newError;
  }
};

// Determine error priority based on message
const determinePriority = (message: string): 'low' | 'medium' | 'high' | 'critical' => {
  const criticalPatterns = [
    'memory leak', 
    'crash', 
    'fatal', 
    'security', 
    'authentication'
  ];
  
  const highPatterns = [
    'undefined', 
    'null', 
    'cannot read property', 
    'is not a function', 
    'failed to fetch'
  ];
  
  const mediumPatterns = [
    'warning', 
    'deprecated', 
    'timeout', 
    'performance'
  ];
  
  const lowercaseMessage = message.toLowerCase();
  
  if (criticalPatterns.some(pattern => lowercaseMessage.includes(pattern))) {
    return 'critical';
  }
  
  if (highPatterns.some(pattern => lowercaseMessage.includes(pattern))) {
    return 'high';
  }
  
  if (mediumPatterns.some(pattern => lowercaseMessage.includes(pattern))) {
    return 'medium';
  }
  
  return 'low';
};

// Update error status
export const updateErrorStatus = (errorId: string, status: 'new' | 'investigating' | 'resolved' | 'ignored'): ErrorEvent | null => {
  const errorIndex = errors.findIndex(e => e.id === errorId);
  
  if (errorIndex >= 0) {
    const updatedError = {
      ...errors[errorIndex],
      status
    };
    
    errors[errorIndex] = updatedError;
    saveErrors(errors);
    return updatedError;
  }
  
  return null;
};

// Assign error to someone
export const assignError = (errorId: string, assignee: string): ErrorEvent | null => {
  const errorIndex = errors.findIndex(e => e.id === errorId);
  
  if (errorIndex >= 0) {
    const updatedError = {
      ...errors[errorIndex],
      assignedTo: assignee || undefined
    };
    
    errors[errorIndex] = updatedError;
    saveErrors(errors);
    return updatedError;
  }
  
  return null;
};

// Calculate error summary
export const calculateErrorSummary = (errorList: ErrorEvent[] = errors): ErrorSummary => {
  const summary: ErrorSummary = {
    total: errorList.length,
    new: 0,
    investigating: 0,
    resolved: 0,
    ignored: 0,
    byModule: {},
    byBrowser: {},
    byComponent: {},
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };
  
  errorList.forEach(error => {
    // Count by status
    summary[error.status]++;
    
    // Count by priority
    summary[error.priority]++;
    
    // Count by module
    summary.byModule[error.module] = (summary.byModule[error.module] || 0) + 1;
    
    // Count by browser
    summary.byBrowser[error.browser] = (summary.byBrowser[error.browser] || 0) + 1;
    
    // Count by component
    summary.byComponent[error.component] = (summary.byComponent[error.component] || 0) + 1;
  });
  
  return summary;
};

// Global error handler to capture runtime errors
export const setupGlobalErrorHandler = (): void => {
  if (typeof window !== 'undefined') {
    const originalOnError = window.onerror;
    
    window.onerror = (message, source, lineno, colno, error) => {
      // Call original handler if it exists
      if (originalOnError) {
        originalOnError.apply(window, [message, source, lineno, colno, error]);
      }
      
      // Extract component and module info from the source if possible
      const sourceFile = source ? source.split('/').pop() : 'unknown';
      const component = sourceFile.split('.')[0] || 'unknown';
      const module = determineModuleFromSource(sourceFile);
      
      // Get browser and OS info
      const browser = detectBrowser();
      const os = detectOS();
      
      // Get current path
      const path = window.location.pathname;
      
      // Add error to our tracking system
      addError({
        message: message.toString(),
        stack: error?.stack || `Error at ${source}:${lineno}:${colno}`,
        component,
        module,
        browser,
        os,
        path
      });
      
      return true;
    };
    
    // Also capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      addError({
        message: error.message || 'Unhandled Promise Rejection',
        stack: error.stack || 'No stack trace available',
        component: 'unknown',
        module: 'Async Operations',
        browser: detectBrowser(),
        os: detectOS(),
        path: window.location.pathname
      });
    });
  }
};

// Determine module from source file
const determineModuleFromSource = (sourceFile: string): string => {
  // This is a simplistic approach - in a real app, you'd have a more robust way to determine the module
  if (sourceFile.includes('auth')) return 'Authentication';
  if (sourceFile.includes('user')) return 'User Management';
  if (sourceFile.includes('content')) return 'Content Management';
  if (sourceFile.includes('dashboard')) return 'Dashboard';
  if (sourceFile.includes('analytics')) return 'Analytics';
  if (sourceFile.includes('settings')) return 'Settings';
  return 'Core';
};

// Detect browser
const detectBrowser = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf('Chrome') > -1) return `Chrome ${getBrowserVersion(userAgent, 'Chrome')}`;
  if (userAgent.indexOf('Safari') > -1) return `Safari ${getBrowserVersion(userAgent, 'Safari')}`;
  if (userAgent.indexOf('Firefox') > -1) return `Firefox ${getBrowserVersion(userAgent, 'Firefox')}`;
  if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) return `IE ${getBrowserVersion(userAgent, 'MSIE')}`;
  if (userAgent.indexOf('Edge') > -1) return `Edge ${getBrowserVersion(userAgent, 'Edge')}`;
  
  return 'Unknown Browser';
};

// Get browser version
const getBrowserVersion = (userAgent: string, browser: string): string => {
  let version = '';
  
  if (browser === 'Chrome') {
    version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
  } else if (browser === 'Safari') {
    version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
  } else if (browser === 'Firefox') {
    version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
  } else if (browser === 'MSIE') {
    version = userAgent.match(/MSIE ([0-9.]+)/)?.[1] || '';
    if (!version) {
      version = userAgent.match(/rv:([0-9.]+)/)?.[1] || '';
    }
  } else if (browser === 'Edge') {
    version = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || '';
  }
  
  return version;
};

// Detect OS
const detectOS = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf('Windows') > -1) return 'Windows';
  if (userAgent.indexOf('Mac') > -1) return 'macOS';
  if (userAgent.indexOf('Linux') > -1) return 'Linux';
  if (userAgent.indexOf('Android') > -1) return 'Android';
  if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) return 'iOS';
  
  return 'Unknown OS';
};

// Export a function to create a React error boundary
export const createErrorBoundary = (component: string, module: string) => {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    addError({
      message: error.message,
      stack: errorInfo.componentStack,
      component,
      module,
      browser: detectBrowser(),
      os: detectOS(),
      path: window.location.pathname
    });
  };
};

// Clear all errors
const clearErrors = (): void => {
  errors = [];
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ERROR_STORAGE_KEY);
  }
};

// Initialize the global error handler
setupGlobalErrorHandler();

// Export all public functions
export {
  getAllErrors,
  addError,
  updateErrorStatus,
  assignError,
  calculateErrorSummary,
  createErrorBoundary,
  clearErrors,
  detectBrowser,
  detectOS,
  determinePriority
};
