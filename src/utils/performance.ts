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
interface PerformanceConfig {
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
   * URL to send performance data to
   */
  reportingEndpoint?: string;
  
  /**
   * Batch size for reporting
   * @default 10
   */
  batchSize?: number;
  
  /**
   * Maximum number of entries to store per metric
   * @default 100
   */
  maxEntries?: number;
}

/**
 * Performance monitoring service
 */
class PerformanceMonitor {
  private config: Required<PerformanceConfig>;
  private metrics: PerformanceMetrics = {};
  private batchedMetrics: PerformanceMetrics[] = [];
  private isMonitoring = false;
  
  constructor(config: PerformanceConfig = {}) {
    // Default configuration
    this.config = {
      enabled: config.enabled ?? true,
      sampleRate: config.sampleRate ?? 0.1,
      logToConsole: config.logToConsole ?? process.env.NODE_ENV !== 'production',
      reportingEndpoint: config.reportingEndpoint ?? '',
      batchSize: config.batchSize ?? 10,
      maxEntries: config.maxEntries ?? 100,
    };
    
    // Initialize metrics
    this.resetMetrics();
    
    // Determine if this session should be monitored based on sample rate
    this.isMonitoring = this.config.enabled && Math.random() < this.config.sampleRate;
    
    // Only set up monitoring if enabled for this session
    if (this.isMonitoring) {
      this.setupMonitoring();
    }
  }
  
  /**
   * Start monitoring performance
   */
  private setupMonitoring(): void {
    // Initialize metrics storage
    this.metrics.apiResponseTime = {};
    this.metrics.componentRenderTime = {};
    this.metrics.resourceLoadTime = {};
    this.metrics.interactionTime = {};
    
    // Monitor page load metrics
    this.monitorPageLoad();
    
    // Monitor resource metrics
    this.monitorResources();
    
    // Monitor web vitals
    this.monitorWebVitals();
  }
  
  /**
   * Monitor page load metrics
   */
  private monitorPageLoad(): void {
    // Use Performance API if available
    if (typeof performance === 'undefined') return;
    
    // Time to First Byte (TTFB)
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      this.metrics.timeToFirstByte = navigationEntries[0].responseStart;
      this.metrics.domContentLoaded = navigationEntries[0].domContentLoadedEventEnd;
      this.metrics.windowLoaded = navigationEntries[0].loadEventEnd;
    }
    
    // Listen for DOMContentLoaded and load events as fallback
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.metrics.domContentLoaded = performance.now();
      });
      
      window.addEventListener('load', () => {
        this.metrics.windowLoaded = performance.now();
        
        // Collect resource metrics after page load
        this.collectResourceMetrics();
        
        // Log initial metrics
        if (this.config.logToConsole) {
          console.log('📊 Initial Performance Metrics:', this.metrics);
        }
      });
    } else {
      // If already loaded, set metrics now
      this.metrics.domContentLoaded = performance.now();
      this.metrics.windowLoaded = performance.now();
      this.collectResourceMetrics();
    }
  }
  
  /**
   * Monitor web vitals metrics
   */
  private monitorWebVitals(): void {
    // Use PerformanceObserver if available
    if (typeof PerformanceObserver === 'undefined') return;
    
    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          this.metrics.firstContentfulPaint = entries[0].startTime;
          if (this.config.logToConsole) {
            console.log('📊 FCP:', this.metrics.firstContentfulPaint);
          }
        }
        fcpObserver.disconnect();
      });
      
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.error('Failed to observe FCP:', e);
    }
    
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
          if (this.config.logToConsole) {
            console.log('📊 LCP:', this.metrics.largestContentfulPaint);
          }
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('Failed to observe LCP:', e);
    }
    
    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Only count layout shifts without recent user input
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        this.metrics.cumulativeLayoutShift = clsValue;
        if (this.config.logToConsole) {
          console.log('📊 CLS:', clsValue);
        }
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Failed to observe CLS:', e);
    }
    
    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          this.metrics.firstInputDelay = entries[0].processingStart - entries[0].startTime;
          if (this.config.logToConsole) {
            console.log('📊 FID:', this.metrics.firstInputDelay);
          }
        }
        fidObserver.disconnect();
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Failed to observe FID:', e);
    }
  }
  
  /**
   * Monitor resource loading
   */
  private monitorResources(): void {
    if (typeof PerformanceObserver === 'undefined') return;
    
    try {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        for (const entry of entries) {
          const url = new URL(entry.name);
          const resource = url.pathname.split('/').pop() || url.hostname;
          
          if (!this.metrics.resourceLoadTime![resource]) {
            this.metrics.resourceLoadTime![resource] = [];
          }
          
          if (this.metrics.resourceLoadTime![resource].length < this.config.maxEntries) {
            this.metrics.resourceLoadTime![resource].push(entry.duration);
          }
        }
      });
      
      resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.error('Failed to observe resources:', e);
    }
  }
  
  /**
   * Collect resource metrics
   */
  private collectResourceMetrics(): void {
    if (typeof performance === 'undefined') return;
    
    const resources = performance.getEntriesByType('resource');
    
    this.metrics.resourceCount = resources.length;
    this.metrics.totalResourceSize = 0;
    this.metrics.jsSize = 0;
    this.metrics.cssSize = 0;
    this.metrics.imageSize = 0;
    this.metrics.fontSize = 0;
    this.metrics.otherSize = 0;
    
    resources.forEach((resource) => {
      // Skip if transferSize is not available
      if (!(resource as any).transferSize) return;
      
      const size = (resource as any).transferSize;
      this.metrics.totalResourceSize! += size;
      
      if (resource.name.endsWith('.js')) {
        this.metrics.jsSize! += size;
      } else if (resource.name.endsWith('.css')) {
        this.metrics.cssSize! += size;
      } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/.test(resource.name)) {
        this.metrics.imageSize! += size;
      } else if (/\.(woff|woff2|ttf|otf|eot)$/.test(resource.name)) {
        this.metrics.fontSize! += size;
      } else {
        this.metrics.otherSize! += size;
      }
    });
    
    if (this.config.logToConsole) {
      console.log('📊 Resource Metrics:', {
        count: this.metrics.resourceCount,
        totalSize: `${Math.round(this.metrics.totalResourceSize / 1024)} KB`,
        js: `${Math.round(this.metrics.jsSize / 1024)} KB`,
        css: `${Math.round(this.metrics.cssSize / 1024)} KB`,
        images: `${Math.round(this.metrics.imageSize / 1024)} KB`,
        fonts: `${Math.round(this.metrics.fontSize / 1024)} KB`,
        other: `${Math.round(this.metrics.otherSize / 1024)} KB`,
      });
    }
  }
  
  /**
   * Reset all metrics
   */
  public resetMetrics(): void {
    this.metrics = {
      apiResponseTime: {},
      componentRenderTime: {},
      resourceLoadTime: {},
      interactionTime: {},
    };
  }
  
  /**
   * Track API response time
   * @param endpoint - API endpoint
   * @param duration - Response time in milliseconds
   */
  public trackApiResponse(endpoint: string, duration: number): void {
    if (!this.isMonitoring) return;
    
    if (!this.metrics.apiResponseTime![endpoint]) {
      this.metrics.apiResponseTime![endpoint] = [];
    }
    
    if (this.metrics.apiResponseTime![endpoint].length < this.config.maxEntries) {
      this.metrics.apiResponseTime![endpoint].push(duration);
    }
    
    if (this.config.logToConsole) {
      console.log(`📊 API Response (${endpoint}):`, duration, 'ms');
    }
  }
  
  /**
   * Track component render time
   * @param componentName - Component name
   * @param duration - Render time in milliseconds
   */
  public trackComponentRender(componentName: string, duration: number): void {
    if (!this.isMonitoring) return;
    
    if (!this.metrics.componentRenderTime![componentName]) {
      this.metrics.componentRenderTime![componentName] = [];
    }
    
    if (this.metrics.componentRenderTime![componentName].length < this.config.maxEntries) {
      this.metrics.componentRenderTime![componentName].push(duration);
    }
    
    if (this.config.logToConsole) {
      console.log(`📊 Component Render (${componentName}):`, duration, 'ms');
    }
  }
  
  /**
   * Track user interaction time
   * @param interactionName - Interaction name
   * @param duration - Interaction time in milliseconds
   */
  public trackInteraction(interactionName: string, duration: number): void {
    if (!this.isMonitoring) return;
    
    if (!this.metrics.interactionTime![interactionName]) {
      this.metrics.interactionTime![interactionName] = [];
    }
    
    if (this.metrics.interactionTime![interactionName].length < this.config.maxEntries) {
      this.metrics.interactionTime![interactionName].push(duration);
    }
    
    if (this.config.logToConsole) {
      console.log(`📊 Interaction (${interactionName}):`, duration, 'ms');
    }
  }
  
  /**
   * Get all collected metrics
   * @returns Current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Report metrics to the configured endpoint
   */
  public reportMetrics(): void {
    if (!this.isMonitoring || !this.config.reportingEndpoint) return;
    
    // Add current metrics to batch
    this.batchedMetrics.push({ ...this.metrics });
    
    // If we've reached the batch size, send the report
    if (this.batchedMetrics.length >= this.config.batchSize) {
      this.sendReport();
    }
  }
  
  /**
   * Send batched metrics to the reporting endpoint
   */
  private sendReport(): void {
    if (this.batchedMetrics.length === 0) return;
    
    const data = {
      metrics: this.batchedMetrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    // Use sendBeacon if available, otherwise use fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.config.reportingEndpoint,
        JSON.stringify(data)
      );
    } else {
      fetch(this.config.reportingEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        // Use keepalive to ensure the request completes even if the page is unloading
        keepalive: true,
      }).catch((error) => {
        console.error('Failed to report performance metrics:', error);
      });
    }
    
    // Clear batched metrics
    this.batchedMetrics = [];
  }
}

// Create a singleton instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Higher-order component to track component render time
 * @param Component - React component to track
 * @param componentName - Optional name for the component (defaults to displayName or name)
 * @returns Wrapped component with performance tracking
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WrappedComponent: React.FC<P> = (props) => {
    const startTime = performance.now();
    
    // Use useEffect to measure render time
    React.useEffect(() => {
      const endTime = performance.now();
      performanceMonitor.trackComponentRender(displayName, endTime - startTime);
    }, []);
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withPerformanceTracking(${displayName})`;
  
  return WrappedComponent;
}

/**
 * Hook to track performance of a component
 * @param componentName - Name of the component
 * @returns Object with tracking functions
 */
export function usePerformanceTracking(componentName: string) {
  const startTime = React.useRef(performance.now());
  
  // Track render time on mount
  React.useEffect(() => {
    const endTime = performance.now();
    performanceMonitor.trackComponentRender(componentName, endTime - startTime.current);
  }, [componentName]);
  
  // Return tracking functions
  return {
    /**
     * Track a custom interaction
     * @param interactionName - Name of the interaction
     * @param fn - Function to track
     * @returns Result of the function
     */
    trackInteraction: <T extends (...args: any[]) => any>(
      interactionName: string,
      fn: T
    ): ReturnType<T> => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      
      performanceMonitor.trackInteraction(`${componentName}.${interactionName}`, end - start);
      
      return result;
    },
    
    /**
     * Track an async interaction
     * @param interactionName - Name of the interaction
     * @param fn - Async function to track
     * @returns Promise with the result of the function
     */
    trackAsyncInteraction: async <T>(
      interactionName: string,
      fn: () => Promise<T>
    ): Promise<T> => {
      const start = performance.now();
      try {
        const result = await fn();
        const end = performance.now();
        
        performanceMonitor.trackInteraction(`${componentName}.${interactionName}`, end - start);
        
        return result;
      } catch (error) {
        const end = performance.now();
        performanceMonitor.trackInteraction(`${componentName}.${interactionName}.error`, end - start);
        throw error;
      }
    },
  };
}

/**
 * Track API response time
 * @param endpoint - API endpoint
 * @param fn - Async function to track
 * @returns Promise with the result of the function
 */
export async function trackApiCall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    
    performanceMonitor.trackApiResponse(endpoint, end - start);
    
    return result;
  } catch (error) {
    const end = performance.now();
    performanceMonitor.trackApiResponse(`${endpoint}.error`, end - start);
    throw error;
  }
}

// Export the singleton instance
export default performanceMonitor;
