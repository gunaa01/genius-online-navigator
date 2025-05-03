import { PerformanceMetrics, PerformanceMonitorConfig } from '../interfaces/performance';

/**
 * Client-side performance monitoring utility
 */
export class ClientPerformanceMonitor {
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
   * Track component render time
   * @param componentName - Name of the component
   * @param duration - Render duration in milliseconds
   */
  trackComponentRender(componentName: string, duration: number): void {
    if (!this.shouldTrack()) return;
    
    if (!this.metrics.componentRenderTime) {
      this.metrics.componentRenderTime = {};
    }
    
    if (!this.metrics.componentRenderTime[componentName]) {
      this.metrics.componentRenderTime[componentName] = [];
    }
    
    this.metrics.componentRenderTime[componentName].push(duration);
    this.maybeReport();
  }

  /**
   * Track user interaction time
   * @param interactionName - Name of the interaction
   * @param duration - Duration in milliseconds
   */
  trackInteraction(interactionName: string, duration: number): void {
    if (!this.shouldTrack()) return;
    
    if (!this.metrics.interactionTime) {
      this.metrics.interactionTime = {};
    }
    
    if (!this.metrics.interactionTime[interactionName]) {
      this.metrics.interactionTime[interactionName] = [];
    }
    
    this.metrics.interactionTime[interactionName].push(duration);
    this.maybeReport();
  }

  /**
   * Track resource load time
   * @param resourceUrl - URL of the resource
   * @param duration - Load duration in milliseconds
   */
  trackResourceLoad(resourceUrl: string, duration: number): void {
    if (!this.shouldTrack()) return;
    
    if (!this.metrics.resourceLoadTime) {
      this.metrics.resourceLoadTime = {};
    }
    
    if (!this.metrics.resourceLoadTime[resourceUrl]) {
      this.metrics.resourceLoadTime[resourceUrl] = [];
    }
    
    this.metrics.resourceLoadTime[resourceUrl].push(duration);
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

  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;
    return Math.random() < this.config.sampleRate;
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

export const clientPerformance = new ClientPerformanceMonitor();
