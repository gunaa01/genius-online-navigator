/**
 * Performance monitoring utilities for tracking and reporting component and API performance
 */

// Performance metrics storage
interface PerformanceMetric {
  component: string;
  action: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
}

// In-memory storage for metrics (would be sent to analytics service in production)
const metrics: PerformanceMetric[] = [];

// Configure whether performance monitoring is enabled
const isEnabled = process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true';

/**
 * Start tracking a performance metric
 * @param component Component name
 * @param action Action being performed
 * @returns Metric ID for ending the tracking
 */
export const startPerformanceTracking = (component: string, action: string): string => {
  if (!isEnabled) return '';
  
  const metricId = `${component}-${action}-${Date.now()}`;
  metrics.push({
    component,
    action,
    startTime: performance.now(),
    success: false
  });
  
  return metricId;
};

/**
 * End tracking a performance metric
 * @param metricId Metric ID from startPerformanceTracking
 * @param success Whether the action was successful
 * @param error Optional error message if action failed
 */
export const endPerformanceTracking = (metricId: string, success: boolean = true, error?: string): void => {
  if (!isEnabled || !metricId) return;
  
  const [component, action, timestamp] = metricId.split('-');
  const metricIndex = metrics.findIndex(
    m => m.component === component && m.action === action && m.startTime.toString() === timestamp
  );
  
  if (metricIndex >= 0) {
    const endTime = performance.now();
    metrics[metricIndex].endTime = endTime;
    metrics[metricIndex].duration = endTime - metrics[metricIndex].startTime;
    metrics[metricIndex].success = success;
    if (error) metrics[metricIndex].error = error;
    
    // Log the metric for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${component} - ${action} took ${metrics[metricIndex].duration?.toFixed(2)}ms`);
    }
    
    // In production, you would send this to your analytics service
    if (process.env.NODE_ENV === 'production') {
      sendMetricToAnalytics(metrics[metricIndex]);
    }
  }
};

/**
 * Performance monitoring hook for React components
 * @param componentName Name of the component
 * @returns Object with tracking functions
 */
export const usePerformanceMonitoring = (componentName: string) => {
  return {
    trackAction: (action: string) => startPerformanceTracking(componentName, action),
    endTracking: (metricId: string, success: boolean = true, error?: string) => 
      endPerformanceTracking(metricId, success, error)
  };
};

/**
 * Send metric to analytics service
 * @param metric Performance metric to send
 */
const sendMetricToAnalytics = (metric: PerformanceMetric) => {
  // This would integrate with your analytics service
  // Example: 
  // analyticsService.trackPerformance({
  //   name: `${metric.component}.${metric.action}`,
  //   duration: metric.duration,
  //   success: metric.success,
  //   error: metric.error
  // });
};

/**
 * Get all collected performance metrics
 * @returns Array of performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetric[] => {
  return [...metrics];
};

/**
 * Clear all collected performance metrics
 */
export const clearPerformanceMetrics = (): void => {
  metrics.length = 0;
};
