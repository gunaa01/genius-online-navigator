import { ServerPerformanceMonitor } from '../performance';
import { performance } from 'perf_hooks';

describe('ServerPerformanceMonitor', () => {
  let monitor: ServerPerformanceMonitor;
  
  beforeEach(() => {
    monitor = new ServerPerformanceMonitor({
      enabled: true,
      logToConsole: false
    });
  });

  afterEach(() => {
    monitor.resetMetrics();
  });

  describe('start and end', () => {
    it('should measure time between start and end', async () => {
      const start = monitor.start();
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const duration = monitor.end(start);
      
      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(50);
    });

    it('should return 0 when disabled', () => {
      const disabledMonitor = new ServerPerformanceMonitor({ enabled: false });
      const start = disabledMonitor.start();
      const duration = disabledMonitor.end(start);
      
      expect(duration).toBe(0);
    });
  });

  describe('trackApiResponse', () => {
    it('should track API response times', () => {
      const endpoint = '/api/test';
      const duration = 100;
      
      monitor.trackApiResponse(endpoint, duration);
      
      const metrics = monitor.getMetrics();
      expect(metrics.apiResponseTime?.[endpoint]).toContain(duration);
    });
  });

  describe('resetMetrics', () => {
    it('should clear all metrics', () => {
      monitor.trackApiResponse('/api/test', 100);
      monitor.resetMetrics();
      
      const metrics = monitor.getMetrics();
      expect(metrics.apiResponseTime).toEqual({});
    });
  });
});
