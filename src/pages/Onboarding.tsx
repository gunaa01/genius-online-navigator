
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Upload, 
  Globe, 
  ShoppingCart, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import PricingTiers from "@/components/common/PricingTiers";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="flex items-center mb-8">
        <Sparkles className="h-8 w-8 mr-2 text-accent" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Genius
        </h1>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              2
            </div>
            <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              3
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>Skip Setup</Button>
        </div>

        {currentStep === 1 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Genius!</CardTitle>
              <CardDescription>
                Let's get your account set up. Tell us a bit about your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" placeholder="Your Business Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" placeholder="https://yourbusiness.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['E-commerce', 'Service Business', 'Blog/Content', 'Other'].map((type) => (
                    <div 
                      key={type} 
                      className="border rounded-md p-4 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex justify-center mb-2">
                        {type === 'E-commerce' && <ShoppingCart className="h-6 w-6 text-primary" />}
                        {type === 'Service Business' && <Globe className="h-6 w-6 text-primary" />}
                        {type === 'Blog/Content' && <Upload className="h-6 w-6 text-primary" />}
                        {type === 'Other' && <CheckCircle className="h-6 w-6 text-primary" />}
                      </div>
                      <p className="text-center text-sm">{type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={goToNextStep}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Connect Your Data</CardTitle>
              <CardDescription>
                Choose how you want to connect your business data to Genius.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="integration">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="integration">Platform Integration</TabsTrigger>
                  <TabsTrigger value="upload">Manual Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="integration" className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Connect your existing platforms for seamless data integration.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['WordPress', 'Shopify', 'WooCommerce', 'Wix', 'Google Analytics', 'Facebook Ads'].map((platform) => (
                      <div 
                        key={platform} 
                        className="border rounded-md p-4 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors flex flex-col items-center"
                      >
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-2">
                          {platform === 'WordPress' && (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 19.5c-5.247 0-9.5-4.253-9.5-9.5S6.753 2.5 12 2.5s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5z"/><path d="M3.866 12c0 3.028 1.761 5.65 4.315 6.884l-3.657-9.999c-.532.983-.842 2.115-.842 3.321zm14.601-1.503c0-.946-.341-1.603-.633-2.112-.388-.649-.754-1.198-.754-1.845 0-.723.549-1.397 1.324-1.397.035 0 .068.005.104.006a8.145 8.145 0 00-4.596-1.421L9.602 9.022l2.271.006c.036.556.104 1.076.275 1.563.165.475.261.861.437 1.563a11.12 11.12 0 01-.55 2.673l-.723 2.414-2.619-7.792a17.325 17.325 0 00-.005 5.448l.073.291-2.438-7.294a7.966 7.966 0 00-.99-.078c-1.284 0-2.394.23-2.394.23.034.546.096 1.186.177 2.061l.022.258 1.135.1-.002.01a8.15 8.15 0 00.639 3.517l2.742 7.592c.28.08.57.149.86.212A8.133 8.133 0 0012 20.5a8.103 8.103 0 003.788-.937.293.293 0 00-.018-.066l-1.83-5l1.209-3.471c.201-.581.343-1.091.343-1.529zm-6.89 1.231l2.24 6.495c-1.628-.861-2.23-2.468-2.235-2.624 0-.006-.004-.009-.005-.014zm8.064 2.461c.1-.824.158-1.548.158-2.189a6.8 6.8 0 00-.153-1.314c-.146-.721-.342-1.312-.54-1.839.683 1.248 1.074 2.676 1.074 4.203 0 2.26-1.051 4.278-2.69 5.587l.036-.055zm1.484-8.04c.033-.529.547-.928 1.108-.928.555 0 1.005.386 1.005.865 0 .395-.229.753-.702.753-.486 0-.939-.436-.939-.865 0-.022.012-.385.012-.385a1.019 1.019 0 00-.484-.871z"/></svg>
                          )}
                          {platform === 'Shopify' && <ShoppingCart className="h-5 w-5" />}
                          {platform === 'Google Analytics' && (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                          )}
                        </div>
                        <p className="text-sm font-medium">{platform}</p>
                        <Button variant="link" size="sm" className="mt-2">
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="upload" className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Manually upload your data files to get started quickly.
                  </p>
                  <div className="border-2 border-dashed border-secondary rounded-lg p-10 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drag & Drop Files</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: CSV, Excel, JSON files
                    </p>
                    <Button>
                      Select Files
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={goToNextStep}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
              <CardDescription>
                Select the plan that best fits your business needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PricingTiers />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={goToNextStep}>
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
