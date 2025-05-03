/**
 * Performance metrics to track
 */
export interface PerformanceMetrics {
  // Page load metrics
  timeToFirstByte?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  domContentLoaded?: number;
  windowLoaded?: number;
  
  // Custom metrics
  apiResponseTime?: Record<string, number[]>;
  componentRenderTime?: Record<string, number[]>;
  resourceLoadTime?: Record<string, number[]>;
  interactionTime?: Record<string, number[]>;
  
  // Resource metrics
  resourceCount?: number;
  totalResourceSize?: number;
  jsSize?: number;
  cssSize?: number;
  imageSize?: number;
  fontSize?: number;
  otherSize?: number;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitorConfig {
  /**
   * Whether to enable performance monitoring
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Sample rate for performance monitoring (0-1)
   * @default 0.1 (10% of users)
   */
  sampleRate?: number;
  
  /**
   * Whether to log metrics to console
   * @default false in production, true in development
   */
  logToConsole?: boolean;
  
  /**
   * Endpoint to report metrics to
   */
  reportingEndpoint?: string;
  
  /**
   * Number of metrics to batch before sending
   * @default 10
   */
  batchSize?: number;
}
