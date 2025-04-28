/**
 * Cache Performance Monitor
 * 
 * This module provides utilities for monitoring and analyzing the performance
 * of the caching system, including hit rates, response times, and storage usage.
 */

import { CacheStats } from './cacheTypes';

// Performance metrics
export interface PerformanceMetrics {
  // Cache hit rate (percentage)
  hitRate: number;
  // Average response time in milliseconds
  avgResponseTime: number;
  // Cache size in bytes
  cacheSize: number;
  // Number of entries in the cache
  entryCount: number;
  // Number of cache evictions
  evictions: number;
  // Number of cache expirations
  expirations: number;
  // Bandwidth saved in bytes
  bandwidthSaved: number;
  // Network requests saved
  requestsSaved: number;
  // Timestamp of the metrics
  timestamp: number;
}

// Response time record
interface ResponseTimeRecord {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  responseTime: number;
  cached: boolean;
  size: number;
}

/**
 * Performance Monitor
 * 
 * Tracks and analyzes cache performance metrics
 */
export class PerformanceMonitor {
  private responseTimes: ResponseTimeRecord[] = [];
  private metrics: PerformanceMetrics = {
    hitRate: 0,
    avgResponseTime: 0,
    cacheSize: 0,
    entryCount: 0,
    evictions: 0,
    expirations: 0,
    bandwidthSaved: 0,
    requestsSaved: 0,
    timestamp: Date.now()
  };
  private maxRecords: number = 1000;
  private listeners: ((metrics: PerformanceMetrics) => void)[] = [];
  private updateInterval: number | null = null;

  /**
   * Create a new PerformanceMonitor
   * 
   * @param updateIntervalMs How often to update metrics (in milliseconds)
   */
  constructor(updateIntervalMs: number = 60000) {
    // Set up periodic metrics calculation
    if (typeof window !== 'undefined' && updateIntervalMs > 0) {
      this.updateInterval = window.setInterval(() => {
        this.calculateMetrics();
      }, updateIntervalMs);
    }
  }

  /**
   * Start tracking a request
   * 
   * @param url The request URL
   * @param method The request method
   * @returns A tracking ID for the request
   */
  startTracking(url: string, method: string): number {
    const startTime = performance.now();
    const id = this.responseTimes.length;
    
    this.responseTimes.push({
      url,
      method,
      startTime,
      endTime: 0,
      responseTime: 0,
      cached: false,
      size: 0
    });
    
    // Limit the number of records
    if (this.responseTimes.length > this.maxRecords) {
      this.responseTimes.shift();
    }
    
    return id;
  }

  /**
   * End tracking a request
   * 
   * @param id The tracking ID
   * @param cached Whether the response was from cache
   * @param size The response size in bytes
   */
  endTracking(id: number, cached: boolean = false, size: number = 0): void {
    if (id < 0 || id >= this.responseTimes.length) {
      return;
    }
    
    const endTime = performance.now();
    const record = this.responseTimes[id];
    
    record.endTime = endTime;
    record.responseTime = endTime - record.startTime;
    record.cached = cached;
    record.size = size;
    
    // Update metrics after tracking a request
    this.calculateMetrics();
  }

  /**
   * Record cache stats
   * 
   * @param stats The cache stats
   */
  recordCacheStats(stats: CacheStats): void {
    this.metrics.entryCount = stats.size;
    this.metrics.hitRate = stats.hits / (stats.hits + stats.misses) * 100 || 0;
    this.metrics.evictions = stats.evictions || 0;
    this.metrics.expirations = stats.expirations || 0;
    
    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Calculate performance metrics
   */
  private calculateMetrics(): void {
    // Calculate average response time
    let totalResponseTime = 0;
    let cachedResponseTime = 0;
    let uncachedResponseTime = 0;
    let cachedCount = 0;
    let uncachedCount = 0;
    let totalSize = 0;
    
    for (const record of this.responseTimes) {
      if (record.endTime === 0) continue; // Skip incomplete records
      
      totalResponseTime += record.responseTime;
      
      if (record.cached) {
        cachedResponseTime += record.responseTime;
        cachedCount++;
        totalSize += record.size;
      } else {
        uncachedResponseTime += record.responseTime;
        uncachedCount++;
      }
    }
    
    const totalCount = cachedCount + uncachedCount;
    
    if (totalCount > 0) {
      this.metrics.avgResponseTime = totalResponseTime / totalCount;
    }
    
    // Calculate bandwidth and requests saved
    this.metrics.bandwidthSaved = totalSize;
    this.metrics.requestsSaved = cachedCount;
    
    // Update timestamp
    this.metrics.timestamp = Date.now();
    
    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Notify listeners of metrics updates
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.metrics);
      } catch (error) {
        console.error('Error in performance metrics listener:', error);
      }
    }
  }

  /**
   * Add a listener for metrics updates
   * 
   * @param listener The listener function
   */
  addListener(listener: (metrics: PerformanceMetrics) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   * 
   * @param listener The listener function to remove
   */
  removeListener(listener: (metrics: PerformanceMetrics) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Get current performance metrics
   * 
   * @returns The current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get response time analysis
   * 
   * @returns Analysis of response times
   */
  getResponseTimeAnalysis() {
    let cachedResponseTimes: number[] = [];
    let uncachedResponseTimes: number[] = [];
    
    for (const record of this.responseTimes) {
      if (record.endTime === 0) continue; // Skip incomplete records
      
      if (record.cached) {
        cachedResponseTimes.push(record.responseTime);
      } else {
        uncachedResponseTimes.push(record.responseTime);
      }
    }
    
    return {
      cached: this.calculateStats(cachedResponseTimes),
      uncached: this.calculateStats(uncachedResponseTimes),
      improvement: this.calculateImprovement(cachedResponseTimes, uncachedResponseTimes)
    };
  }

  /**
   * Calculate statistical metrics for an array of values
   * 
   * @param values Array of numeric values
   * @returns Statistical metrics
   */
  private calculateStats(values: number[]) {
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        p95: 0,
        count: 0
      };
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      count: sorted.length
    };
  }

  /**
   * Calculate performance improvement from caching
   * 
   * @param cachedTimes Cached response times
   * @param uncachedTimes Uncached response times
   * @returns Performance improvement metrics
   */
  private calculateImprovement(cachedTimes: number[], uncachedTimes: number[]) {
    if (cachedTimes.length === 0 || uncachedTimes.length === 0) {
      return {
        avgImprovement: 0,
        percentImprovement: 0,
        timeSaved: 0
      };
    }
    
    const cachedAvg = cachedTimes.reduce((acc, val) => acc + val, 0) / cachedTimes.length;
    const uncachedAvg = uncachedTimes.reduce((acc, val) => acc + val, 0) / uncachedTimes.length;
    
    const avgImprovement = uncachedAvg - cachedAvg;
    const percentImprovement = (avgImprovement / uncachedAvg) * 100;
    const timeSaved = avgImprovement * cachedTimes.length;
    
    return {
      avgImprovement,
      percentImprovement,
      timeSaved
    };
  }

  /**
   * Reset all metrics and response time records
   */
  reset(): void {
    this.responseTimes = [];
    this.metrics = {
      hitRate: 0,
      avgResponseTime: 0,
      cacheSize: 0,
      entryCount: 0,
      evictions: 0,
      expirations: 0,
      bandwidthSaved: 0,
      requestsSaved: 0,
      timestamp: Date.now()
    };
    
    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.updateInterval !== null && typeof window !== 'undefined') {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.listeners = [];
  }
}

// Create and export a singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export the class for testing or custom instances
export default PerformanceMonitor;
