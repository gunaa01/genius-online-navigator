import { ClientPerformanceMonitor } from '../performance';

describe('ClientPerformanceMonitor', () => {
  let monitor: ClientPerformanceMonitor;
  
  beforeEach(() => {
    // Create a fresh instance before each test
    monitor = new ClientPerformanceMonitor({
      enabled: true,
      sampleRate: 1, // 100% sampling for tests
      logToConsole: false
    });
  });

  afterEach(() => {
    // Reset metrics after each test
    monitor.resetMetrics();
  });

  describe('trackComponentRender', () => {
    it('should track component render time', () => {
      const componentName = 'TestComponent';
      const duration = 42;
      
      monitor.trackComponentRender(componentName, duration);
      
      const metrics = monitor.getMetrics();
      expect(metrics.componentRenderTime?.[componentName]).toContain(duration);
    });

    it('should not track when disabled', () => {
      const disabledMonitor = new ClientPerformanceMonitor({ enabled: false });
      disabledMonitor.trackComponentRender('TestComponent', 42);
      
      const metrics = disabledMonitor.getMetrics();
      expect(metrics.componentRenderTime).toBeUndefined();
    });
  });

  describe('trackInteraction', () => {
    it('should track interaction time', () => {
      const interactionName = 'buttonClick';
      const duration = 150;
      
      monitor.trackInteraction(interactionName, duration);
      
      const metrics = monitor.getMetrics();
      expect(metrics.interactionTime?.[interactionName]).toContain(duration);
    });
  });

  describe('trackResourceLoad', () => {
    it('should track resource load time', () => {
      const resourceUrl = 'https://example.com/image.jpg';
      const duration = 200;
      
      monitor.trackResourceLoad(resourceUrl, duration);
      
      const metrics = monitor.getMetrics();
      expect(metrics.resourceLoadTime?.[resourceUrl]).toContain(duration);
    });
  });

  describe('resetMetrics', () => {
    it('should clear all metrics', () => {
      monitor.trackComponentRender('TestComponent', 42);
      monitor.trackInteraction('buttonClick', 150);
      
      monitor.resetMetrics();
      
      const metrics = monitor.getMetrics();
      expect(metrics.componentRenderTime).toEqual({});
      expect(metrics.interactionTime).toEqual({});
    });
  });
});
