
import { PerformanceMetrics, PerformanceMonitorConfig } from '../interfaces/performance';

/**
 * Server-side performance monitoring utility
 * This uses browser's performance API instead of Node.js perf_hooks
 */
export class ServerPerformanceMonitor {
  private startTime: number;
  private metrics: PerformanceMetrics;
  private config: PerformanceMonitorConfig;

  constructor(config?: Partial<PerformanceMonitorConfig>) {
    this.startTime = Date.now();
    this.metrics = {
      startTime: this.startTime,
      endTime: 0,
      duration: 0,
      memory: 0,
    };
    this.config = {
      logToConsole: config?.logToConsole || false,
      captureMemory: config?.captureMemory || false,
    };
  }

  /**
   * Start recording performance metrics
   */
  start(): void {
    this.startTime = Date.now();
    this.metrics.startTime = this.startTime;
  }

  /**
   * Stop recording and calculate metrics
   */
  stop(): PerformanceMetrics {
    const endTime = Date.now();
    this.metrics.endTime = endTime;
    this.metrics.duration = endTime - this.startTime;
    
    // Use browser performance memory if available
    if (this.config.captureMemory && window && (window.performance as any).memory) {
      this.metrics.memory = (window.performance as any).memory.usedJSHeapSize;
    }

    if (this.config.logToConsole) {
      console.log('Server Performance Metrics:', this.metrics);
    }

    return this.metrics;
  }

  /**
   * Get current metrics without stopping
   */
  getMetrics(): PerformanceMetrics {
    const currentTime = Date.now();
    return {
      ...this.metrics,
      duration: currentTime - this.startTime,
    };
  }
}

/**
 * Create a new performance monitor instance
 */
export function createServerPerformanceMonitor(
  config?: Partial<PerformanceMonitorConfig>
): ServerPerformanceMonitor {
  return new ServerPerformanceMonitor(config);
}
