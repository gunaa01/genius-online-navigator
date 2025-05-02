import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RoutesComponent from './routes';
import { Toaster } from 'sonner';
import CookieConsentBanner from './components/compliance/CookieConsentBanner';
import GoogleAnalyticsService from './services/googleAnalyticsService';
import AnalyticsService from './services/analyticsService';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Analytics Services
    const ga4Service = GoogleAnalyticsService.getInstance();
    ga4Service.init({
      measurementId: 'G-XXXXXXXXXX', // Replace with your actual GA4 measurement ID
      debugMode: process.env.NODE_ENV === 'development',
      sendPageViews: true
    });
    
    const analyticsService = AnalyticsService.getInstance();
    analyticsService.init({
      enableGoogleAnalytics: true,
      enableFacebookPixel: false, // Set to true and provide pixelId to enable
      enableHotjar: false, // Set to true and provide hotjarId to enable
      anonymizeIp: true,
      trackingId: 'G-XXXXXXXXXX' // Same as GA4 measurement ID
    });

    // Add listener for history changes
    const handleRouteChange = () => {
      const pagePath = window.location.pathname + window.location.search;
      const pageTitle = document.title;
      
      // Track page view in GA4
      ga4Service.sendPageView(pageTitle, pagePath);
      
      // Track in other analytics services
      analyticsService.trackPageView(pagePath);
    };

    // Initial page view
    handleRouteChange();

    // Listen for popstate events
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleCookieConsent = (preferences: any) => {
    // Enable analytics based on preferences
    if (preferences.analytics) {
      // Allow analytics tracking
      console.log('Analytics tracking enabled by user consent');
    }

    // Other cookies can be handled here
    if (preferences.marketing) {
      // Enable marketing cookies
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RoutesComponent />
      <Toaster position="top-right" />
      <CookieConsentBanner onConsent={handleCookieConsent} />
    </QueryClientProvider>
  );
};

export default App;
