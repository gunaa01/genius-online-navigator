
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Info, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentBannerProps {
  privacyPolicyUrl?: string;
  onConsent?: (preferences: CookiePreferences) => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  privacyPolicyUrl = '/privacy',
  onConsent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsOpen(true);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (e) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(allEnabled));
    if (onConsent) onConsent(allEnabled);
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    if (onConsent) onConsent(preferences);
    setIsOpen(false);
    setShowPreferences(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Necessary cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/70 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardContent className="pt-6">
          {!showPreferences ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Info size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">Cookie Consent</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to improve your experience on our website. By browsing this website,
                you agree to our use of cookies. You can customize your preferences or 
                <a href={privacyPolicyUrl} className="text-primary hover:underline mx-1">
                  learn more in our Privacy Policy
                </a>.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Settings size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
              </div>
              
              <div className="space-y-4 my-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium flex items-center gap-1">
                      <CheckCircle size={16} className="text-green-500" />
                      Necessary Cookies
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.necessary} 
                    disabled
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">Analytics Cookies</h4>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics} 
                    onChange={() => handleTogglePreference('analytics')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">Marketing Cookies</h4>
                    <p className="text-xs text-muted-foreground">
                      Used to track visitors across websites for advertising purposes.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing} 
                    onChange={() => handleTogglePreference('marketing')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h4 className="font-medium">Personalization Cookies</h4>
                    <p className="text-xs text-muted-foreground">
                      Allow the website to remember your preferences and choices.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.personalization} 
                    onChange={() => handleTogglePreference('personalization')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 bg-muted/50 pt-4">
          {showPreferences ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowPreferences(false)}
              >
                Back
              </Button>
              <Button onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowPreferences(true)}
              >
                Customize
              </Button>
              <Button 
                variant="default" 
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CookieConsentBanner;
