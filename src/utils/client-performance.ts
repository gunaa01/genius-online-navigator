import * as React from 'react';
import { ComponentType, FC, useEffect, useRef } from 'react';
import { PerformanceMonitor } from './performance';

// Create a singleton instance for the client
const performanceMonitor = new PerformanceMonitor();

export function withPerformanceTracking<P extends object>(
  Component: ComponentType<P>,
  componentName?: string
): FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WrappedComponent: FC<P> = (props) => {
    const startTime = useRef(performance.now());
    
    useEffect(() => {
      const endTime = performance.now();
      performanceMonitor.trackComponentRender(displayName, endTime - startTime.current);
    }, []);
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withPerformanceTracking(${displayName})`;
  
  return WrappedComponent;
}

export { performanceMonitor };
