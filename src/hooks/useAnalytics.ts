
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import GoogleAnalyticsService, { GA4EventType, GA4EventParameters } from '../services/googleAnalyticsService';

interface UseAnalyticsOptions {
  measurementId?: string;
  debugMode?: boolean;
  trackPageViews?: boolean;
}

export function useAnalytics(options?: UseAnalyticsOptions) {
  const location = useLocation();
  const initializedRef = useRef(false);
  const analyticsService = GoogleAnalyticsService.getInstance();
  
  useEffect(() => {
    if (!initializedRef.current && options?.measurementId) {
      analyticsService.init({
        measurementId: options.measurementId,
        debugMode: options.debugMode,
        sendPageViews: options.trackPageViews
      });
      initializedRef.current = true;
    }
  }, [options]);
  
  // Track page views when the route changes
  useEffect(() => {
    if (initializedRef.current && options?.trackPageViews !== false) {
      analyticsService.sendPageView(
        document.title,
        location.pathname + location.search
      );
    }
  }, [location, options?.trackPageViews]);
  
  // Return functions for tracking events
  return {
    trackEvent: (
      eventName: GA4EventType | string,
      parameters?: GA4EventParameters
    ) => analyticsService.sendEvent(eventName, parameters),
    trackPurchase: (
      transactionId: string,
      value: number,
      currency?: string,
      items?: any[]
    ) => analyticsService.trackPurchase(transactionId, value, currency, items),
    trackFormSubmission: (
      formId: string,
      formName: string,
      formDestination?: string
    ) => analyticsService.trackFormSubmission(formId, formName, formDestination),
    setUserId: (userId: string | null) => analyticsService.setUserId(userId),
    setUserProperties: (properties: Record<string, string>) => analyticsService.setUserProperties(properties)
  };
}

export default useAnalytics;
