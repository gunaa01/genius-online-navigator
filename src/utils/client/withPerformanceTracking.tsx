import * as ReactDefault from 'react';
import { clientPerformance } from './performance';

interface ReactWithHooks {
  useRef: typeof ReactDefault.useRef;
  useEffect: typeof ReactDefault.useEffect;
  useCallback: typeof ReactDefault.useCallback;
}

/**
 * Higher-Order Component for tracking React component render performance
 * @param Component - The React component to wrap
 * @param componentName - Optional custom name for the component
 * @param react - Optional React instance (for testing)
 * @returns A wrapped component with performance tracking
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string,
  react: ReactWithHooks = ReactDefault
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';

  const WrappedComponent: React.FC<P> = (props) => {
    const startTime = react.useRef(performance.now());

    react.useEffect(() => {
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
 * @param react - Optional React instance (for testing)
 * @returns A function to call when the interaction ends
 */
// Export for testing
export const trackInteractionTime = (
  interactionName: string,
  startTime: number | null,
  endTime: number
) => {
  if (startTime !== null) {
    clientPerformance.trackInteraction(interactionName, endTime - startTime);
  }
};

interface InteractionTracker {
  startTracking: () => void;
  endTracking: () => void;
}

export function useInteractionTracker(
  interactionName: string,
  react: ReactWithHooks = ReactDefault
): InteractionTracker {
  const startTime = react.useRef<number | null>(null);
  const now = () => performance.now();

  const startTracking = react.useCallback(() => {
    startTime.current = now();
  }, []);

  const endTracking = react.useCallback(() => {
    if (startTime.current !== null) {
      trackInteractionTime(interactionName, startTime.current, now());
      startTime.current = null;
    }
  }, [interactionName]);

  return { startTracking, endTracking };
}
