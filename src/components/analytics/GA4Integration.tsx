import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics 4 Integration Component
 * 
 * Provides comprehensive GA4 tracking capabilities including:
 * - Page view tracking
 * - Custom event tracking
 * - User ID and property tracking
 * - Debug mode configuration
 * - Custom dimension support
 * - Enhanced measurement
 * 
 * @example
 * // Basic usage
 * <GA4Integration measurementId="G-XXXXXXXXXX" />
 * 
 * @example
 * // Advanced usage with user tracking
 * <GA4Integration 
 *   measurementId="G-XXXXXXXXXX"
 *   userId="user123"
 *   userProperties={{ tier: 'premium' }}
 *   debugMode={process.env.NODE_ENV === 'development'}
 *   customDimensions={{ dimension1: 'value' }}
 * />
 */
interface GA4Config {
  /** GA4 measurement ID (format: G-XXXXXXXXXX) */
  measurementId: string;
  
  /** Optional user ID for cross-device tracking */
  userId?: string;
  
  /** User properties to segment in reports */
  userProperties?: Record<string, any>;
  
  /** Enable debug mode in development */
  debugMode?: boolean;
  
  /** Custom dimensions configuration */
  customDimensions?: Record<string, any>;
  
  /** Additional page view parameters */
  pageViewParams?: Record<string, any>;
}

/**
 * Google Analytics 4 Integration Component
 * Implements GA4 tracking with enhanced ecommerce and custom event tracking
 */
const GA4Integration: React.FC<GA4Config> = ({
  measurementId,
  userId,
  userProperties = {},
  debugMode = false,
  customDimensions = {},
  pageViewParams = {}
}) => {
  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize dataLayer and gtag function
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());

        // Initialize GA4 with debug mode if enabled
        if (debugMode) {
          window.gtag('set', 'debug_mode', true);
        }

        // Set custom dimensions
        Object.entries(customDimensions).forEach(([key, value]) => {
          window.gtag('set', key, value);
        });

        // Main configuration
        window.gtag('config', measurementId, {
          user_id: userId,
          ...userProperties,
          send_page_view: false // We'll handle page views manually
        });
      }
    } catch (error) {
      console.error('GA4 initialization error:', error);
    }
  }, [measurementId, userId, userProperties, debugMode, customDimensions]);

  // Track page views
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        // Enhanced page view tracking with additional parameters
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_title: document.title,
          page_location: window.location.href,
          ...pageViewParams
        });
      }
    } catch (error) {
      console.error('GA4 page view tracking error:', error);
    }
  }, [location, pageViewParams]);

  // Enhanced event tracking with error handling
  const trackEvent = (name: string, params?: Record<string, any>) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', name, {
          ...params,
          non_interaction: params?.nonInteraction || false
        });
      }
    } catch (error) {
      console.error('GA4 event tracking error:', error);
    }
  };

  // Expose tracking functions via window for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.trackGAEvent = trackEvent;
      return () => {
        delete window.trackGAEvent;
      };
    }
  }, []);

  // Track ecommerce events in Google Analytics 4
  const trackEcommerceEvent = (
    action: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase',
    items: Array<{
      item_id: string;
      item_name: string;
      item_category?: string;
      price?: number;
      quantity?: number;
    }>,
    additionalParams?: Record<string, any>
  ): void => {
    if (window.gtag) {
      window.gtag('event', action, {
        items,
        ...additionalParams
      });
    }
  };

  // Track UTM parameters for campaign attribution
  const trackUTMParameters = (): Record<string, string> => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
  
    // Extract UTM parameters
    const utmParameters = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content'
    ];
  
    utmParameters.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });
  
    // Store in session storage for cross-page attribution
    if (Object.keys(utmParams).length > 0) {
      sessionStorage.setItem('utm_parameters', JSON.stringify(utmParams));
      
      // Track campaign view event
      trackEvent('campaign_view', utmParams);
    }
  
    return utmParams;
  };

  return null; // This component doesn't render anything
};

// Type declaration for global access
declare global {
  interface Window {
    trackGAEvent?: (name: string, params?: Record<string, any>) => void;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Create standalone functions that can be exported
const trackEvent = (name: string, params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        ...params,
        non_interaction: params?.nonInteraction || false
      });
    }
  } catch (error) {
    console.error('GA4 event tracking error:', error);
  }
};

const trackEcommerceEvent = (
  action: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase',
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price?: number;
    quantity?: number;
  }>,
  additionalParams?: Record<string, any>
): void => {
  if (window.gtag) {
    window.gtag('event', action, {
      items,
      ...additionalParams
    });
  }
};

const trackUTMParameters = (): Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  // Extract UTM parameters
  const utmParameters = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
  ];

  utmParameters.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  // Store in session storage for cross-page attribution
  if (Object.keys(utmParams).length > 0) {
    sessionStorage.setItem('utm_parameters', JSON.stringify(utmParams));
    
    // Track campaign view event
    trackEvent('campaign_view', utmParams);
  }

  return utmParams;
};

export default GA4Integration;
export { trackEvent, trackEcommerceEvent, trackUTMParameters };
