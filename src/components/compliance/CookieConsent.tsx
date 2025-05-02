import React, { useState, useEffect } from 'react';
import { X, Info, Shield, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { configureConsentMode } from '@/components/analytics/GTMIntegration';

interface CookieConsentProps {
  privacyPolicyUrl: string;
  companyName: string;
  region?: 'eu' | 'us' | 'global';
  onConsentChange?: (consents: CookieConsents) => void;
}

export interface CookieConsents {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

/**
 * GDPR/CCPA Compliant Cookie Consent Banner
 * Implements a comprehensive cookie consent solution with granular controls
 */
const CookieConsent: React.FC<CookieConsentProps> = ({
  privacyPolicyUrl,
  companyName,
  region = 'global',
  onConsentChange
}) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [consents, setConsents] = useState<CookieConsents>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Check for existing consent on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie_consent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsents(parsedConsent);
      } catch (e) {
        console.error('Error parsing saved consent:', e);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  // Save consent to localStorage and notify parent component
  const saveConsents = (newConsents: CookieConsents) => {
    localStorage.setItem('cookie_consent', JSON.stringify(newConsents));
    setConsents(newConsents);
    
    if (onConsentChange) {
      onConsentChange(newConsents);
    }
    
    // Configure GTM consent mode
    configureConsentMode({
      analytics_storage: newConsents.analytics ? 'granted' : 'denied',
      ad_storage: newConsents.marketing ? 'granted' : 'denied',
      functionality_storage: 'granted', // Necessary cookies always allowed
      personalization_storage: newConsents.preferences ? 'granted' : 'denied',
      security_storage: 'granted' // Security cookies always allowed
    });
  };

  // Accept all cookies
  const acceptAll = () => {
    const allConsents: CookieConsents = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    saveConsents(allConsents);
    setShowBanner(false);
    setShowPreferences(false);
  };

  // Accept only necessary cookies
  const acceptNecessary = () => {
    const necessaryOnly: CookieConsents = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    saveConsents(necessaryOnly);
    setShowBanner(false);
    setShowPreferences(false);
  };

  // Save current preferences
  const savePreferences = () => {
    saveConsents(consents);
    setShowBanner(false);
    setShowPreferences(false);
  };

  // Toggle individual consent
  const toggleConsent = (type: keyof CookieConsents) => {
    if (type === 'necessary') return; // Necessary cookies can't be toggled
    
    setConsents({
      ...consents,
      [type]: !consents[type]
    });
  };

  // Get region-specific text
  const getRegionText = () => {
    switch (region) {
      case 'eu':
        return 'To comply with EU GDPR regulations';
      case 'us':
        return 'To comply with CCPA and other US privacy laws';
      default:
        return 'To comply with global privacy regulations';
    }
  };

  return (
    <>
      {/* Main Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50 animate-in slide-in-from-bottom">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Cookie className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Cookie Consent</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getRegionText()}, we use cookies to enhance your experience, analyze site traffic, and for marketing purposes.
                    See our <a href={privacyPolicyUrl} className="text-primary underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a> for more information.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 ml-8 md:ml-0">
                <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                  Preferences
                </Button>
                <Button variant="outline" size="sm" onClick={acceptNecessary}>
                  Necessary Only
                </Button>
                <Button size="sm" onClick={acceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cookie Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Customize your cookie preferences for {companyName}. Necessary cookies are always enabled as they are essential for the website to function properly.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="essential">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="essential">Essential</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="essential" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Necessary Cookies</h4>
                  <p className="text-sm text-muted-foreground">These cookies are essential for the website to function properly.</p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="text-xs text-muted-foreground border-l-2 border-primary/20 pl-3">
                <p>Examples: Session cookies, authentication, security</p>
                <p>These cookies cannot be disabled as they are required for basic website functionality.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">These cookies help us understand how visitors interact with our website.</p>
                </div>
                <Switch 
                  checked={consents.analytics} 
                  onCheckedChange={() => toggleConsent('analytics')} 
                />
              </div>
              <div className="text-xs text-muted-foreground border-l-2 border-primary/20 pl-3">
                <p>Examples: Google Analytics, Hotjar, visitor statistics</p>
                <p>These cookies collect anonymous information about how you use our site, which pages you visit, and how long you stay.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="marketing" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-sm text-muted-foreground">These cookies are used to track visitors across websites to display relevant advertisements.</p>
                </div>
                <Switch 
                  checked={consents.marketing} 
                  onCheckedChange={() => toggleConsent('marketing')} 
                />
              </div>
              <div className="text-xs text-muted-foreground border-l-2 border-primary/20 pl-3">
                <p>Examples: Google Ads, Facebook Pixel, retargeting</p>
                <p>These cookies are used to show you relevant ads on other websites based on your interests and browsing patterns.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Preference Cookies</h4>
                  <p className="text-sm text-muted-foreground">These cookies remember your preferences and settings.</p>
                </div>
                <Switch 
                  checked={consents.preferences} 
                  onCheckedChange={() => toggleConsent('preferences')} 
                />
              </div>
              <div className="text-xs text-muted-foreground border-l-2 border-primary/20 pl-3">
                <p>Examples: Language preferences, theme settings, form data</p>
                <p>These cookies help us remember your settings and preferences to enhance your experience on future visits.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={acceptNecessary}>
              Necessary Only
            </Button>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={acceptAll}>
                Accept All
              </Button>
              <Button onClick={savePreferences}>
                Save Preferences
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Floating button to reopen preferences */}
      {!showBanner && !showPreferences && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 rounded-full z-50 shadow-md"
          onClick={() => setShowPreferences(true)}
          title="Cookie Settings"
        >
          <Cookie className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default CookieConsent;
