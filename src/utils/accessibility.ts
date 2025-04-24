/**
 * Accessibility utilities for ensuring WCAG 2.1 AA compliance
 */

/**
 * Keyboard key codes for common keys
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/**
 * ARIA roles for common components
 */
export const AriaRoles = {
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  COMBOBOX: 'combobox',
  DIALOG: 'dialog',
  GRID: 'grid',
  LINK: 'link',
  LISTBOX: 'listbox',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  MENUITEMCHECKBOX: 'menuitemcheckbox',
  MENUITEMRADIO: 'menuitemradio',
  OPTION: 'option',
  PROGRESSBAR: 'progressbar',
  RADIO: 'radio',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  SWITCH: 'switch',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  TEXTBOX: 'textbox',
  TREE: 'tree',
  TREEITEM: 'treeitem',
};

/**
 * Check if the contrast ratio between two colors meets WCAG AA standards
 * @param foreground - Foreground color in hex format (e.g., #FFFFFF)
 * @param background - Background color in hex format (e.g., #000000)
 * @param isLargeText - Whether the text is considered large (14pt bold or 18pt regular)
 * @returns Whether the contrast ratio meets WCAG AA standards
 */
export function meetsContrastRatio(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Calculate the contrast ratio between two colors
 * @param foreground - Foreground color in hex format (e.g., #FFFFFF)
 * @param background - Background color in hex format (e.g., #000000)
 * @returns Contrast ratio between the two colors
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate the relative luminance of a color
 * @param color - Color in hex format (e.g., #FFFFFF)
 * @returns Relative luminance of the color
 */
function getLuminance(color: string): number {
  // Remove # if present
  const hex = color.startsWith('#') ? color.slice(1) : color;
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Calculate luminance
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Generate a unique ID for accessibility attributes
 * @param prefix - Prefix for the ID
 * @returns Unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create props for a visually hidden element (screen reader only)
 * @returns CSS properties for visually hidden elements
 */
export const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;

/**
 * Create an accessible keyboard handler for interactive elements
 * @param onClick - Click handler function
 * @param keys - Array of keys that should trigger the handler (defaults to Enter and Space)
 * @returns Keyboard event handler
 */
export function createKeyboardHandler(
  onClick: (event: React.KeyboardEvent | React.MouseEvent) => void,
  keys = [KeyboardKeys.ENTER, KeyboardKeys.SPACE]
): (event: React.KeyboardEvent) => void {
  return (event: React.KeyboardEvent) => {
    if (keys.includes(event.key)) {
      event.preventDefault();
      onClick(event);
    }
  };
}

/**
 * Create props for an accessible button
 * @param onClick - Click handler function
 * @param ariaLabel - Accessible label for the button
 * @param disabled - Whether the button is disabled
 * @returns Props for an accessible button
 */
export function createButtonProps(
  onClick: (event: React.KeyboardEvent | React.MouseEvent) => void,
  ariaLabel?: string,
  disabled = false
): Record<string, any> {
  return {
    role: AriaRoles.BUTTON,
    tabIndex: disabled ? -1 : 0,
    'aria-disabled': disabled,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    onClick: disabled ? undefined : onClick,
    onKeyDown: disabled ? undefined : createKeyboardHandler(onClick),
  };
}

/**
 * Check if a string is a valid ARIA role
 * @param role - ARIA role to check
 * @returns Whether the role is valid
 */
export function isValidAriaRole(role: string): boolean {
  return Object.values(AriaRoles).includes(role as any);
}

/**
 * Create props for an element that announces its loading state to screen readers
 * @param isLoading - Whether the element is loading
 * @param loadingMessage - Message to announce when loading
 * @returns Props for announcing loading state
 */
export function createLoadingProps(
  isLoading: boolean,
  loadingMessage = 'Loading, please wait.'
): Record<string, any> {
  return {
    'aria-busy': isLoading,
    'aria-live': 'polite',
    ...(isLoading ? { 'aria-label': loadingMessage } : {}),
  };
}

/**
 * Create props for an accessible form field
 * @param id - ID of the form field
 * @param label - Label for the form field
 * @param required - Whether the field is required
 * @param invalid - Whether the field is invalid
 * @param errorMessage - Error message for invalid fields
 * @returns Props for an accessible form field
 */
export function createFormFieldProps(
  id: string,
  label: string,
  required = false,
  invalid = false,
  errorMessage?: string
): Record<string, any> {
  const errorId = `${id}-error`;
  
  return {
    id,
    'aria-labelledby': `${id}-label`,
    'aria-required': required,
    'aria-invalid': invalid,
    ...(invalid && errorMessage
      ? { 'aria-errormessage': errorId, 'aria-describedby': errorId }
      : {}),
    labelProps: {
      id: `${id}-label`,
      htmlFor: id,
    },
    errorProps: {
      id: errorId,
      role: 'alert',
    },
  };
}

/**
 * Create props for an accessible dialog
 * @param id - ID of the dialog
 * @param title - Title of the dialog
 * @param description - Description of the dialog
 * @returns Props for an accessible dialog
 */
export function createDialogProps(
  id: string,
  title: string,
  description?: string
): Record<string, any> {
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;
  
  return {
    id,
    role: AriaRoles.DIALOG,
    'aria-modal': true,
    'aria-labelledby': titleId,
    ...(descriptionId ? { 'aria-describedby': descriptionId } : {}),
    titleProps: {
      id: titleId,
    },
    ...(descriptionId
      ? {
          descriptionProps: {
            id: descriptionId,
          },
        }
      : {}),
  };
}

/**
 * Create props for an accessible live region
 * @param priority - Priority of the live region (polite or assertive)
 * @param atomic - Whether the entire region should be announced
 * @returns Props for a live region
 */
export function createLiveRegionProps(
  priority: 'polite' | 'assertive' = 'polite',
  atomic = true
): Record<string, any> {
  return {
    'aria-live': priority,
    'aria-atomic': atomic,
    role: 'status',
  };
}

/**
 * Check if the current environment supports screen readers
 * @returns Whether screen readers are likely supported
 */
export function supportsScreenReaders(): boolean {
  return typeof window !== 'undefined' && 
    (
      // Check for common screen reader detection methods
      'speechSynthesis' in window || 
      navigator.userAgent.toLowerCase().includes('voice') ||
      document.documentElement.getAttribute('data-force-a11y') === 'true'
    );
}

/**
 * Focus an element and announce it to screen readers
 * @param element - Element to focus
 * @param announcement - Optional text to announce
 */
export function focusAndAnnounce(element: HTMLElement, announcement?: string): void {
  if (!element) return;
  
  // Focus the element
  element.focus();
  
  // Announce to screen readers if needed
  if (announcement && supportsScreenReaders()) {
    const liveRegion = document.getElementById('a11y-live-region');
    
    if (liveRegion) {
      liveRegion.textContent = announcement;
    } else {
      // Create a live region if it doesn't exist
      const newLiveRegion = document.createElement('div');
      newLiveRegion.id = 'a11y-live-region';
      newLiveRegion.setAttribute('aria-live', 'assertive');
      newLiveRegion.setAttribute('aria-atomic', 'true');
      newLiveRegion.className = 'sr-only';
      newLiveRegion.textContent = announcement;
      
      document.body.appendChild(newLiveRegion);
      
      // Clean up after announcement
      setTimeout(() => {
        newLiveRegion.textContent = '';
      }, 3000);
    }
  }
}

/**
 * Trap focus within an element (for modals, dialogs, etc.)
 * @param rootElement - Element to trap focus within
 * @returns Function to remove the focus trap
 */
export function trapFocus(rootElement: HTMLElement): () => void {
  if (!rootElement) return () => {};
  
  // Find all focusable elements
  const focusableElements = rootElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return () => {};
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Focus the first element
  firstElement.focus();
  
  // Handle tab key to cycle through elements
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyboardKeys.TAB) {
      if (event.shiftKey) {
        // Shift + Tab: cycle backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: cycle forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  
  // Add event listener
  rootElement.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    rootElement.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Create a skip link for keyboard users to bypass navigation
 * @param targetId - ID of the element to skip to
 * @param label - Label for the skip link
 * @returns JSX for the skip link
 */
export function createSkipLink(
  targetId: string,
  label = 'Skip to main content'
): JSX.Element {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {label}
    </a>
  );
}

export default {
  KeyboardKeys,
  AriaRoles,
  meetsContrastRatio,
  getContrastRatio,
  generateId,
  visuallyHidden,
  createKeyboardHandler,
  createButtonProps,
  isValidAriaRole,
  createLoadingProps,
  createFormFieldProps,
  createDialogProps,
  createLiveRegionProps,
  supportsScreenReaders,
  focusAndAnnounce,
  trapFocus,
  createSkipLink,
};
