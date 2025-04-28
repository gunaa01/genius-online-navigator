/**
 * Keyboard navigation utilities for accessibility
 * Following WCAG 2.1 AA compliance standards
 */

/**
 * Key codes for keyboard navigation
 */
export enum KeyCode {
  TAB = 'Tab',
  ENTER = 'Enter',
  SPACE = ' ',
  ESCAPE = 'Escape',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  HOME = 'Home',
  END = 'End',
  PAGE_UP = 'PageUp',
  PAGE_DOWN = 'PageDown',
}

/**
 * Interface for keyboard navigation options
 */
export interface KeyboardNavigationOptions {
  selector: string;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onSelect?: (element: HTMLElement) => void;
  onEscape?: () => void;
}

/**
 * Create keyboard navigation for a group of elements
 * @param options Keyboard navigation options
 * @returns Cleanup function
 */
export const createKeyboardNavigation = (options: KeyboardNavigationOptions): () => void => {
  const {
    selector,
    orientation = 'both',
    loop = true,
    onSelect,
    onEscape,
  } = options;

  // Find all focusable elements
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (elements.length === 0) return () => {};

  // Set tabindex for all elements
  elements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });

  // Current focused index
  let currentIndex = 0;

  // Handle keydown event
  const handleKeyDown = (event: KeyboardEvent) => {
    // Only handle if the event target is one of our elements
    const target = event.target as HTMLElement;
    if (!elements.includes(target)) return;

    let newIndex = currentIndex;

    switch (event.key) {
      case KeyCode.ARROW_RIGHT:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = currentIndex + 1;
          if (newIndex >= elements.length) {
            newIndex = loop ? 0 : elements.length - 1;
          }
          event.preventDefault();
        }
        break;
      case KeyCode.ARROW_LEFT:
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? elements.length - 1 : 0;
          }
          event.preventDefault();
        }
        break;
      case KeyCode.ARROW_DOWN:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = currentIndex + 1;
          if (newIndex >= elements.length) {
            newIndex = loop ? 0 : elements.length - 1;
          }
          event.preventDefault();
        }
        break;
      case KeyCode.ARROW_UP:
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? elements.length - 1 : 0;
          }
          event.preventDefault();
        }
        break;
      case KeyCode.HOME:
        newIndex = 0;
        event.preventDefault();
        break;
      case KeyCode.END:
        newIndex = elements.length - 1;
        event.preventDefault();
        break;
      case KeyCode.ENTER:
      case KeyCode.SPACE:
        if (onSelect) {
          onSelect(elements[currentIndex]);
        }
        event.preventDefault();
        break;
      case KeyCode.ESCAPE:
        if (onEscape) {
          onEscape();
        }
        event.preventDefault();
        break;
      default:
        return;
    }

    // Update focus if index changed
    if (newIndex !== currentIndex) {
      elements[currentIndex].setAttribute('tabindex', '-1');
      elements[newIndex].setAttribute('tabindex', '0');
      elements[newIndex].focus();
      currentIndex = newIndex;
    }
  };

  // Add event listener
  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    elements.forEach(element => {
      element.removeAttribute('tabindex');
    });
  };
};

/**
 * Focus trap for modal dialogs
 * @param containerRef Reference to container element
 * @returns Object with activation and deactivation functions
 */
export const createFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  let previouslyFocusedElement: HTMLElement | null = null;

  // Get all focusable elements
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors));
  };

  // Handle tab key
  const handleTabKey = (event: KeyboardEvent) => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // If shift + tab and first element is focused, move to last element
    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
    // If tab and last element is focused, move to first element
    else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  };

  // Handle keydown
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyCode.TAB) {
      handleTabKey(event);
    } else if (event.key === KeyCode.ESCAPE) {
      deactivate();
    }
  };

  // Activate focus trap
  const activate = () => {
    previouslyFocusedElement = document.activeElement as HTMLElement;
    
    // Focus first element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
  };

  // Deactivate focus trap
  const deactivate = () => {
    document.removeEventListener('keydown', handleKeyDown);
    
    // Restore focus
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  return { activate, deactivate };
};

/**
 * Skip to content link for keyboard navigation
 * @param contentId ID of main content
 * @returns JSX element
 */
export const SkipToContent: React.FC<{ contentId: string }> = ({ contentId }) => {
  return (
    <a 
      href={`#${contentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded"
    >
      Skip to content
    </a>
  );
};
