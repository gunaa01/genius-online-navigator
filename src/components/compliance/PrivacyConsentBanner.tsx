import React, { useState, useEffect } from 'react';
import { X, Shield, Info, Check, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { complianceService, CompliancePolicy, UserConsent } from '@/services/compliance/complianceService';
import { useAuth } from '@/contexts/AuthContext';

interface ConsentOption {
  id: string;
  name: string;
  description: string;
  required: boolean;
  checked: boolean;
}

interface PrivacyConsentBannerProps {
  onConsentComplete?: () => void;
  position?: 'bottom' | 'top';
  showOnlyRequired?: boolean;
}

/**
 * PrivacyConsentBanner - Component for displaying and managing privacy consents
 * 
 * Features:
 * - GDPR and CCPA compliant consent collection
 * - Granular consent options for different data processing activities
 * - Detailed privacy policy information
 * - Consent versioning and tracking
 * - Persistent consent storage
 */
const PrivacyConsentBanner: React.FC<PrivacyConsentBannerProps> = ({
  onConsentComplete,
  position = 'bottom',
  showOnlyRequired = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('essential');
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [userConsents, setUserConsents] = useState<UserConsent[]>([]);
  const [consentOptions, setConsentOptions] = useState<ConsentOption[]>([
    {
      id: 'essential',
      name: 'Essential',
      description: 'Required cookies that enable core functionality of the website.',
      required: true,
      checked: true
    },
    {
      id: 'functional',
      name: 'Functional',
      description: 'Cookies that enable personalized features and remember your preferences.',
      required: false,
      checked: false
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Cookies that help us understand how you interact with our website.',
      required: false,
      checked: false
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Cookies used to deliver advertisements relevant to you.',
      required: false,
      checked: false
    }
  ]);
  
  // Check if consent is needed
  useEffect(() => {
    const checkConsent = async () => {
      try {
        // Get applicable policies
        const policies = await complianceService.getPolicies();
        setPolicies(policies);
        
        // Get user consents
        const consents = await complianceService.getUserConsents();
        setUserConsents(consents);
        
        // Check if all required policies have been consented to
        const requiredPolicies = policies.filter(p => p.acknowledgmentRequired);
        const consentedPolicies = new Set(consents.filter(c => c.status === 'accepted').map(c => c.policyId));
        
        const needsConsent = requiredPolicies.some(p => !consentedPolicies.has(p.id));
        
        // Initialize consent options based on existing consents
        if (consents.length > 0) {
          const updatedOptions = [...consentOptions];
          
          // Map policy IDs to consent option IDs
          const policyToOptionMap: Record<string, string> = {
            'privacy-essential': 'essential',
            'privacy-functional': 'functional',
            'privacy-analytics': 'analytics',
            'privacy-marketing': 'marketing'
          };
          
          // Update consent options based on existing consents
          consents.forEach(consent => {
            const optionId = policyToOptionMap[consent.policyId];
            if (optionId) {
              const optionIndex = updatedOptions.findIndex(o => o.id === optionId);
              if (optionIndex >= 0) {
                updatedOptions[optionIndex].checked = consent.status === 'accepted';
              }
            }
          });
          
          setConsentOptions(updatedOptions);
        }
        
        setIsVisible(needsConsent);
      } catch (error) {
        console.error('Error checking consent status:', error);
        // Default to showing the banner if we can't determine consent status
        setIsVisible(true);
      }
    };
    
    checkConsent();
  }, []);
  
  // Handle consent option toggle
  const handleConsentToggle = (id: string, checked: boolean) => {
    setConsentOptions(options =>
      options.map(option =>
        option.id === id && !option.required
          ? { ...option, checked }
          : option
      )
    );
  };
  
  // Accept all consents
  const handleAcceptAll = async () => {
    try {
      // Set all options to checked
      setConsentOptions(options =>
        options.map(option => ({ ...option, checked: true }))
      );
      
      // Record consent for all policies
      await Promise.all(
        policies.map(policy =>
          complianceService.recordConsent(policy.id, 'accepted')
        )
      );
      
      // Log compliance action
      await complianceService.logComplianceAction(
        'accept_all_consents',
        'privacy_consent',
        'all',
        { timestamp: new Date().toISOString() }
      );
      
      setIsVisible(false);
      
      toast({
        title: "Preferences saved",
        description: "Your cookie preferences have been saved.",
      });
      
      if (onConsentComplete) {
        onConsentComplete();
      }
    } catch (error) {
      console.error('Error recording consent:', error);
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Accept only necessary consents
  const handleAcceptNecessary = async () => {
    try {
      // Update consent options
      const updatedOptions = consentOptions.map(option => ({
        ...option,
        checked: option.required
      }));
      
      setConsentOptions(updatedOptions);
      
      // Record consent for each policy
      await Promise.all(
        policies.map(policy => {
          const isRequired = policy.acknowledgmentRequired;
          return complianceService.recordConsent(
            policy.id,
            isRequired ? 'accepted' : 'declined'
          );
        })
      );
      
      // Log compliance action
      await complianceService.logComplianceAction(
        'accept_necessary_consents',
        'privacy_consent',
        'necessary',
        { timestamp: new Date().toISOString() }
      );
      
      setIsVisible(false);
      
      toast({
        title: "Preferences saved",
        description: "Your cookie preferences have been saved.",
      });
      
      if (onConsentComplete) {
        onConsentComplete();
      }
    } catch (error) {
      console.error('Error recording consent:', error);
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Save custom consent preferences
  const handleSavePreferences = async () => {
    try {
      // Map consent options to policies
      const optionToPolicyMap: Record<string, string> = {
        'essential': 'privacy-essential',
        'functional': 'privacy-functional',
        'analytics': 'privacy-analytics',
        'marketing': 'privacy-marketing'
      };
      
      // Record consent for each policy based on options
      await Promise.all(
        consentOptions.map(option => {
          const policyId = optionToPolicyMap[option.id];
          if (policyId) {
            return complianceService.recordConsent(
              policyId,
              option.checked ? 'accepted' : 'declined'
            );
          }
          return Promise.resolve(null);
        })
      );
      
      // Log compliance action
      await complianceService.logComplianceAction(
        'save_custom_consents',
        'privacy_consent',
        'custom',
        { 
          options: consentOptions.map(o => ({ id: o.id, accepted: o.checked })),
          timestamp: new Date().toISOString() 
        }
      );
      
      setIsVisible(false);
      setShowDetails(false);
      
      toast({
        title: "Preferences saved",
        description: "Your cookie preferences have been saved.",
      });
      
      if (onConsentComplete) {
        onConsentComplete();
      }
    } catch (error) {
      console.error('Error recording consent:', error);
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // If not visible, don't render anything
  if (!isVisible) {
    return null;
  }
  
  return (
    <>
      {/* Simple banner */}
      {!showDetails && (
        <div 
          className={`fixed ${position === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0 z-50 p-4 bg-background border-t shadow-lg animate-in slide-in-from-${position}`}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Privacy Preferences</h3>
                  <p className="text-sm text-muted-foreground pr-4 mt-1">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 ml-8 md:ml-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDetails(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAcceptNecessary}
                >
                  Necessary Only
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Detailed preferences dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Privacy Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences and consent settings
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="essential" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="essential">Essential</TabsTrigger>
              <TabsTrigger value="functional">Functional</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            
            {consentOptions.map(option => (
              <TabsContent key={option.id} value={option.id} className="space-y-4">
                <div className="flex items-start space-x-3 pt-2">
                  <div>
                    {option.required ? (
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    ) : (
                      <Checkbox
                        id={`consent-${option.id}`}
                        checked={option.checked}
                        onCheckedChange={(checked) => handleConsentToggle(option.id, !!checked)}
                        disabled={option.required}
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={`consent-${option.id}`}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.name} Cookies
                      {option.required && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    {option.id === 'essential' && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Authentication cookies to identify you when you sign in</li>
                        <li>Security cookies to prevent abuse and protect your account</li>
                        <li>Session cookies to remember your preferences during your visit</li>
                        <li>CSRF tokens to protect against cross-site request forgery</li>
                      </ul>
                    )}
                    
                    {option.id === 'functional' && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Preference cookies to remember your settings and choices</li>
                        <li>Language cookies to remember your language preference</li>
                        <li>Customization cookies to personalize your experience</li>
                        <li>Feature detection cookies to optimize your experience</li>
                      </ul>
                    )}
                    
                    {option.id === 'analytics' && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Google Analytics cookies to analyze how you use our website</li>
                        <li>Performance cookies to measure site performance</li>
                        <li>Usage pattern cookies to improve our services</li>
                        <li>Error tracking cookies to identify and fix issues</li>
                      </ul>
                    )}
                    
                    {option.id === 'marketing' && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Advertising cookies to show you relevant ads</li>
                        <li>Social media cookies for sharing content</li>
                        <li>Remarketing cookies to show you our ads on other sites</li>
                        <li>Campaign measurement cookies to measure marketing effectiveness</li>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(false)}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleAcceptNecessary}
                className="flex-1 sm:flex-auto"
              >
                Necessary Only
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-auto"
              >
                Accept All
              </Button>
              <Button 
                onClick={handleSavePreferences}
                className="flex-1 sm:flex-auto"
              >
                Save Preferences
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrivacyConsentBanner;
