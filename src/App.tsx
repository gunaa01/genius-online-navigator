
import * as React from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import RoutesComponent from "./routes";
import GA4Integration from "./components/analytics/GA4Integration";
import GTMIntegration from "./components/analytics/GTMIntegration";
import CookieConsent from "./components/compliance/CookieConsent";
import { SEOHead } from "./services/seo/seoService";

// Create a client for React Query
const queryClient = new QueryClient();

// Google Analytics and GTM IDs (should be in env variables in production)
const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Replace with your actual GA4 ID
const GTM_CONTAINER_ID = "GTM-XXXXXXX"; // Replace with your actual GTM ID

const App = () => {
  // Get user ID from auth if available
  const userId = localStorage.getItem('user_id') || undefined;
  
  // Track UTM parameters for campaign attribution
  React.useEffect(() => {
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
    }
  }, []);
  
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          {/* SEO Metadata */}
          <SEOHead 
            metadata={{
              title: "Genius Online Navigator | Digital Marketing Hub",
              description: "All-in-one digital marketing platform for SEO, analytics, content management, social media, and client collaboration.",
              keywords: ["digital marketing", "SEO", "analytics", "social media", "content management"],
              ogType: "website",
            }}
          />
          
          {/* Analytics Integration */}
          <GA4Integration 
            measurementId={GA4_MEASUREMENT_ID}
            userId={userId}
            userProperties={{
              userType: userId ? 'registered' : 'guest',
              appVersion: '1.0.0'
            }}
          />
          
          {/* Google Tag Manager */}
          <GTMIntegration 
            containerId={GTM_CONTAINER_ID}
            dataLayer={{
              platform: 'web',
              userType: userId ? 'registered' : 'guest'
            }}
          />
          
          {/* Toast Notifications */}
          <Toaster richColors position="top-right" />
          
          {/* Main Application Routes */}
          <RoutesComponent />
          
          {/* GDPR/CCPA Cookie Consent Banner */}
          <CookieConsent 
            privacyPolicyUrl="/privacy"
            companyName="Genius Online Navigator"
            region="global"
          />
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
