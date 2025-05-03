import { PerformanceMetrics, PerformanceMonitorConfig } from '../interfaces/performance';
import { performance } from 'perf_hooks';

/**
 * Server-side performance monitoring utility
 */
export class ServerPerformanceMonitor {
  private config: Required<PerformanceMonitorConfig>;
  private metrics: PerformanceMetrics = {};
  private batch: PerformanceMetrics[] = [];

  constructor(config: PerformanceMonitorConfig = {}) {
    this.config = {
      enabled: true,
      sampleRate: 0.1,
      logToConsole: process.env.NODE_ENV !== 'production',
      reportingEndpoint: '',
      batchSize: 10,
      ...config
    };
  }

  /**
   * Start a performance measurement
   * @returns The current timestamp in milliseconds
   */
  start(): number {
    if (!this.config.enabled) return 0;
    return performance.now();
  }

  /**
   * End a performance measurement
   * @param startTime - The timestamp from start()
   * @returns The duration in milliseconds
   */
  end(startTime: number): number {
    if (!this.config.enabled || startTime === 0) return 0;
    return performance.now() - startTime;
  }

  /**
   * Track API response time
   * @param endpoint - The API endpoint
   * @param duration - The response duration in milliseconds
   */
  trackApiResponse(endpoint: string, duration: number): void {
    if (!this.config.enabled) return;
    
    if (!this.metrics.apiResponseTime) {
      this.metrics.apiResponseTime = {};
    }
    
    if (!this.metrics.apiResponseTime[endpoint]) {
      this.metrics.apiResponseTime[endpoint] = [];
    }
    
    this.metrics.apiResponseTime[endpoint].push(duration);
    this.maybeReport();
  }

  /**
   * Get the current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset all collected metrics
   */
  resetMetrics(): void {
    this.metrics = {};
    this.batch = [];
  }

  private maybeReport(): void {
    if (this.config.reportingEndpoint && this.batch.length >= this.config.batchSize) {
      this.sendReport();
    }
  }

  private async sendReport(): Promise<void> {
    if (!this.config.reportingEndpoint || this.batch.length === 0) return;

    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          metrics: this.batch
        })
      });

      this.batch = [];
    } catch (error) {
      if (this.config.logToConsole) {
        console.error('Failed to send performance metrics:', error);
      }
    }
  }
}

export const serverPerformance = new ServerPerformanceMonitor();
