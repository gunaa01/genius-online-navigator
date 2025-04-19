
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, Facebook, BarChart, ShoppingBag, ShoppingCart, Check, ExternalLink, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface IntegrationPlatformsProps {
  handleConnectIntegration: (integrationName: string) => void;
  handleConfigureIntegration: (integrationName: string) => void;
}

const IntegrationPlatforms = ({ 
  handleConnectIntegration, 
  handleConfigureIntegration 
}: IntegrationPlatformsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  return (
    <Card className="card-shadow mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary">
            <path d="M2 12h5"></path><path d="M17 12h5"></path><path d="M7 12a5 5 0 0 1 5-5"></path><path d="M12 7v10"></path><path d="M12 17a5 5 0 0 0 5-5"></path>
          </svg>
          Available Integrations
        </CardTitle>
        <CardDescription>
          Connect your business tools to sync data automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex">
          <div className="relative flex-grow max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search integrations..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-secondary/30 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Google Analytics</CardTitle>
                  <CardDescription className="text-xs">Track website performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Connected</Badge>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-primary border-primary/30"
                onClick={() => handleConfigureIntegration("Google Analytics")}
              >
                <Check className="mr-2 h-4 w-4" /> Configure
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center mr-3">
                  <Facebook className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Facebook Ads</CardTitle>
                  <CardDescription className="text-xs">Manage ad campaigns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-xs text-muted-foreground">Connect your Facebook Ads account to manage campaigns</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => handleConnectIntegration("Facebook Ads")}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center mr-3">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Shopify</CardTitle>
                  <CardDescription className="text-xs">E-commerce integration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-xs text-muted-foreground">Sync product and customer data from your store</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => handleConnectIntegration("Shopify")}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-secondary/30 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 19.5c-5.247 0-9.5-4.253-9.5-9.5S6.753 2.5 12 2.5s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5z"/><path d="M3.866 12c0 3.028 1.761 5.65 4.315 6.884l-3.657-9.999c-.532.983-.842 2.115-.842 3.321zm14.601-1.503c0-.946-.341-1.603-.633-2.112-.388-.649-.754-1.198-.754-1.845 0-.723.549-1.397 1.324-1.397.035 0 .068.005.104.006a8.145 8.145 0 00-4.596-1.421L9.602 9.022l2.271.006c.036.556.104 1.076.275 1.563.165.475.261.861.437 1.563a11.12 11.12 0 01-.55 2.673l-.723 2.414-2.619-7.792a17.325 17.325 0 00-.005 5.448l.073.291-2.438-7.294a7.966 7.966 0 00-.99-.078c-1.284 0-2.394.23-2.394.23.034.546.096 1.186.177 2.061l.022.258 1.135.1-.002.01a8.15 8.15 0 00.639 3.517l2.742 7.592c.28.08.57.149.86.212A8.133 8.133 0 0012 20.5a8.103 8.103 0 003.788-.937.293.293 0 00-.018-.066l-1.83-5l1.209-3.471c.201-.581.343-1.091.343-1.529zm-6.89 1.231l2.24 6.495c-1.628-.861-2.23-2.468-2.235-2.624 0-.006-.004-.009-.005-.014zm8.064 2.461c.1-.824.158-1.548.158-2.189a6.8 6.8 0 00-.153-1.314c-.146-.721-.342-1.312-.54-1.839.683 1.248 1.074 2.676 1.074 4.203 0 2.26-1.051 4.278-2.69 5.587l.036-.055zm1.484-8.04c.033-.529.547-.928 1.108-.928.555 0 1.005.386 1.005.865 0 .395-.229.753-.702.753-.486 0-.939-.436-.939-.865 0-.022.012-.385.012-.385a1.019 1.019 0 00-.484-.871z"/></svg>
                </div>
                <div>
                  <CardTitle className="text-base">WordPress</CardTitle>
                  <CardDescription className="text-xs">CMS integration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Connected</Badge>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-primary border-primary/30"
                onClick={() => handleConfigureIntegration("WordPress")}
              >
                <Check className="mr-2 h-4 w-4" /> Configure
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center mr-3">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">WooCommerce</CardTitle>
                  <CardDescription className="text-xs">WordPress e-commerce</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-xs text-muted-foreground">Connect your WooCommerce store</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => handleConnectIntegration("WooCommerce")}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-dashed flex flex-col justify-center items-center p-6">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-medium mb-1">Connect More</h3>
            <p className="text-xs text-muted-foreground text-center mb-3">
              Browse more integration options
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({
                title: "Explore Integrations",
                description: "Opening integration marketplace"
              })}
            >
              Explore Integrations
            </Button>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationPlatforms;
