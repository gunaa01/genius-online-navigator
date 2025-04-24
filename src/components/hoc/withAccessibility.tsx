import React, { useRef, useEffect } from 'react';
import { generateId } from '@/utils/accessibility';

/**
 * Props for the withAccessibility HOC
 */
export interface WithAccessibilityProps {
  /**
   * ID for the component
   */
  id?: string;
  
  /**
   * ARIA label for the component
   */
  'aria-label'?: string;
  
  /**
   * ARIA labelledby for the component
   */
  'aria-labelledby'?: string;
  
  /**
   * ARIA describedby for the component
   */
  'aria-describedby'?: string;
  
  /**
   * ARIA role for the component
   */
  role?: string;
  
  /**
   * Tab index for the component
   */
  tabIndex?: number;
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the component should be focusable when disabled
   */
  focusableWhenDisabled?: boolean;
  
  /**
   * Whether the component should announce changes to screen readers
   */
  announceChanges?: boolean;
  
  /**
   * Message to announce when the component changes
   */
  announceMessage?: string;
  
  /**
   * Whether to focus the component on mount
   */
  autoFocus?: boolean;
  
  /**
   * Additional accessibility props
   */
  [key: string]: any;
}

/**
 * Higher-order component that enhances a component with accessibility features
 * @param Component - Component to enhance
 * @param defaultProps - Default accessibility props
 * @returns Enhanced component with accessibility features
 */
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>,
  defaultProps: Partial<WithAccessibilityProps> = {}
) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const EnhancedComponent = React.forwardRef<
    HTMLElement,
    P & WithAccessibilityProps
  >((props, ref) => {
    const {
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      role,
      tabIndex,
      disabled,
      focusableWhenDisabled,
      announceChanges,
      announceMessage,
      autoFocus,
      ...rest
    } = props;
    
    // Generate a unique ID if not provided
    const componentId = id || useRef(generateId(displayName.toLowerCase())).current;
    
    // Create ref for the component
    const componentRef = useRef<HTMLElement>(null);
    
    // Combine refs
    const combinedRef = useCombinedRefs(ref, componentRef);
    
    // Handle auto focus
    useEffect(() => {
      if (autoFocus && componentRef.current && !disabled) {
        componentRef.current.focus();
      }
    }, [autoFocus, disabled]);
    
    // Handle announcing changes
    useEffect(() => {
      if (announceChanges && announceMessage) {
        announceToScreenReader(announceMessage);
      }
    }, [announceChanges, announceMessage]);
    
    // Calculate accessibility props
    const accessibilityProps: WithAccessibilityProps = {
      id: componentId,
      role: role || defaultProps.role,
      tabIndex: calculateTabIndex(tabIndex, disabled, focusableWhenDisabled),
      'aria-disabled': disabled,
    };
    
    // Add aria-label if provided
    if (ariaLabel || defaultProps['aria-label']) {
      accessibilityProps['aria-label'] = ariaLabel || defaultProps['aria-label'];
    }
    
    // Add aria-labelledby if provided
    if (ariaLabelledby || defaultProps['aria-labelledby']) {
      accessibilityProps['aria-labelledby'] = ariaLabelledby || defaultProps['aria-labelledby'];
    }
    
    // Add aria-describedby if provided
    if (ariaDescribedby || defaultProps['aria-describedby']) {
      accessibilityProps['aria-describedby'] = ariaDescribedby || defaultProps['aria-describedby'];
    }
    
    return (
      <Component
        ref={combinedRef}
        {...(rest as P)}
        {...accessibilityProps}
      />
    );
  });
  
  EnhancedComponent.displayName = `withAccessibility(${displayName})`;
  
  return EnhancedComponent;
}

/**
 * Calculate the tabIndex based on the component's state
 * @param tabIndex - Provided tabIndex
 * @param disabled - Whether the component is disabled
 * @param focusableWhenDisabled - Whether the component should be focusable when disabled
 * @returns Calculated tabIndex
 */
function calculateTabIndex(
  tabIndex?: number,
  disabled?: boolean,
  focusableWhenDisabled?: boolean
): number | undefined {
  if (tabIndex !== undefined) {
    return tabIndex;
  }
  
  if (disabled && !focusableWhenDisabled) {
    return -1;
  }
  
  return undefined;
}

/**
 * Announce a message to screen readers
 * @param message - Message to announce
 */
function announceToScreenReader(message: string): void {
  let liveRegion = document.getElementById('a11y-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-live-region';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }
  
  liveRegion.textContent = message;
  
  // Clear the announcement after a delay
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  }, 3000);
}

/**
 * Combine multiple refs into one
 * @param refs - Refs to combine
 * @returns Combined ref callback
 */
function useCombinedRefs<T>(...refs: Array<React.Ref<T> | null | undefined>): React.RefCallback<T> {
  return (element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  };
}

export default withAccessibility;
