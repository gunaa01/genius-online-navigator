// Re-export all interfaces and types
export * from './interfaces/performance';

// Re-export server-side utilities
export { ServerPerformanceMonitor, serverPerformance } from './server/performance';

// Re-export client-side utilities
export { ClientPerformanceMonitor, clientPerformance } from './client/performance';

// Re-export React-specific utilities
export { withPerformanceTracking, useInteractionTracker } from './client/withPerformanceTracking';

// Default export for backward compatibility
export { clientPerformance as default };
