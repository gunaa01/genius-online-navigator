// Import Vite types for environment variables
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Google Tag Manager Integration Component
 * 
 * Provides GTM container loading and management with:
 * - Custom data layer support
 * - Environment configuration (auth/preview)
 * - Error handling
 * - Noscript fallback
 * - Custom data layer naming
 * 
 * @example
 * // Basic usage
 * <GTMIntegration containerId="GTM-XXXXXXX" />
 * 
 * @example
 * // Advanced usage with environment config
 * <GTMIntegration 
 *   containerId="GTM-XXXXXXX"
 *   dataLayer={{ platform: 'web' }}
 *   dataLayerName="customDataLayer"
 *   environmentAuth="auth_key"
 *   environmentPreview="env-1"
 * />
 */
interface GTMConfig {
  /** GTM container ID (format: GTM-XXXXXXX) */
  containerId: string;
  
  /** Initial data layer values */
  dataLayer?: Record<string, any>;
  
  /** Custom data layer name (default: 'dataLayer') */
  dataLayerName?: string;
  
  /** GTM environment auth key */
  environmentAuth?: string;
  
  /** GTM environment preview name */
  environmentPreview?: string;
}

interface GTMIntegrationProps {
  containerId: string;
  dataLayer?: Record<string, any>;
}

const GTMIntegration: React.FC<GTMConfig> = ({
  containerId,
  dataLayer = {},
  dataLayerName = 'dataLayer',
  environmentAuth,
  environmentPreview
}: GTMConfig) => {
  const location = useLocation();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Initialize data layer with custom name if provided
        // Initialize the data layer with a safer approach
if (!window[dataLayerName as keyof Window]) {
  (window as any)[dataLayerName] = [];
}
        
        // Push initial configuration
        const gtmConfig: Record<string, any> = {
          event: 'gtm.js',
          'gtm.start': new Date().getTime(),
          ...dataLayer
        };

        // Add environment config if provided
        if (environmentAuth && environmentPreview) {
          gtmConfig['gtm.uniqueEventId'] = 0;
          gtmConfig['gtm_auth'] = environmentAuth;
          gtmConfig['gtm_preview'] = environmentPreview;
        }

        (window as any)[dataLayerName].push(gtmConfig);

        // Load GTM script
        const script = document.createElement('script');
        script.async = true;
        
        // Build script URL with environment params if provided
        let scriptUrl = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
        if (environmentAuth && environmentPreview) {
          scriptUrl += `&gtm_auth=${environmentAuth}&gtm_preview=${environmentPreview}&gtm_cookies_win=x`;
        }
        
        script.src = scriptUrl;
        script.onerror = () => console.error('GTM script failed to load');
        document.head.appendChild(script);

        // Add noscript fallback
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
      }
    } catch (error) {
      console.error('GTM initialization error:', error);
    }
  }, [containerId, dataLayer, dataLayerName, environmentAuth, environmentPreview]);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page: {
          title: document.title,
          url: window.location.href,
          path: location.pathname + location.search
        }
      });
    }
  }, [location]);

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${containerId}`} />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', '${containerId}');
        `}
      </script>
    </Helmet>
  );
};

/**
 * Push data to the GTM dataLayer
 * @param data Data to push to the dataLayer
 */
export const pushToDataLayer = (data: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
    }
  } catch (error) {
    console.error('DataLayer push error:', error);
  }
};

/**
 * Track custom events in Google Tag Manager
 * @param eventName Name of the event to track
 * @param eventParams Additional parameters for the event
 */
export const trackGTMEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  pushToDataLayer({
    event: eventName,
    ...eventParams
  });
};

/**
 * Configure consent mode for GDPR compliance
 * @param consents Object containing consent status for different purposes
 */
export const configureConsentMode = (
  consents: {
    analytics_storage?: 'granted' | 'denied';
    ad_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied';
    personalization_storage?: 'granted' | 'denied';
    security_storage?: 'granted' | 'denied';
  }
): void => {
  if (window.dataLayer) {
    window.dataLayer.push({
      'consent': 'default',
      ...consents
    });
    
    // Update consent status
    window.dataLayer.push({
      'consent': 'update',
      ...consents
    });
  }
};

/**
 * Integrate with Hotjar for heatmaps and session recordings
 * @param hotjarId Hotjar site ID
 * @param hotjarVersion Hotjar snippet version
 */
export const initializeHotjar = (
  hotjarId: number,
  hotjarVersion: number = 6
): void => {
  pushToDataLayer({
    event: 'hotjar_init',
    hotjarId,
    hotjarVersion
  });
  
  // This would be handled by a custom HTML tag in GTM
  // For direct implementation, you would add the Hotjar snippet here
};

export default GTMIntegration;
