import React from 'react';
import { clientPerformance } from './performance';

/**
 * Higher-Order Component for tracking React component render performance
 * @param Component - The React component to wrap
 * @param componentName - Optional custom name for the component
 * @returns A wrapped component with performance tracking
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';

  const WrappedComponent: React.FC<P> = (props) => {
    const startTime = React.useRef(performance.now());

    React.useEffect(() => {
      const endTime = performance.now();
      clientPerformance.trackComponentRender(displayName, endTime - startTime.current);
    }, []);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceTracking(${displayName})`;
  return WrappedComponent;
}

/**
 * Hook for tracking custom interactions
 * @param interactionName - Name of the interaction to track
 * @returns A function to call when the interaction ends
 */
export function useInteractionTracker(interactionName: string): () => void {
  const startTime = React.useRef<number | null>(null);

  const startTracking = React.useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endTracking = React.useCallback(() => {
    if (startTime.current !== null) {
      const endTime = performance.now();
      clientPerformance.trackInteraction(interactionName, endTime - startTime.current);
      startTime.current = null;
    }
  }, [interactionName]);

  return endTracking;
}
