import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Accessibility preferences interface
 */
interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

/**
 * Accessibility context interface
 */
interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreference: (key: keyof AccessibilityPreferences, value: boolean) => void;
  resetPreferences: () => void;
}

/**
 * Default accessibility preferences
 */
const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
};

/**
 * Create accessibility context
 */
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * Accessibility provider component
 */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load preferences from localStorage or use defaults
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : DEFAULT_PREFERENCES;
  });

  // Update preference
  const updatePreference = (key: keyof AccessibilityPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    
    // Apply preferences to document
    document.documentElement.classList.toggle('high-contrast', preferences.highContrast);
    document.documentElement.classList.toggle('large-text', preferences.largeText);
    document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);
    document.documentElement.classList.toggle('screen-reader', preferences.screenReader);
    
    // Apply prefers-reduced-motion media query
    if (preferences.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
    
    // Apply large text
    if (preferences.largeText) {
      document.documentElement.style.setProperty('font-size', '120%');
    } else {
      document.documentElement.style.removeProperty('font-size');
    }
  }, [preferences]);

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to use accessibility context
 */
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
