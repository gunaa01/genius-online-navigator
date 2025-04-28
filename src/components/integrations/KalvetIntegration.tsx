
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Globe, ExternalLink } from "lucide-react";
import { connectKalvetSite } from "@/services/integrationService";
import { useToast } from "@/hooks/use-toast";

interface KalvetIntegrationProps {
  onSuccess: () => void;
}

const KalvetIntegration = ({ onSuccess }: KalvetIntegrationProps) => {
  const [siteUrl, setSiteUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!siteUrl.trim()) {
      toast({
        title: "Website URL Required",
        description: "Please enter your Kalvet website URL",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Kalvet API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await connectKalvetSite(siteUrl, apiKey);
      toast({
        title: "Success!",
        description: "Kalvet website connected successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error connecting Kalvet site:", error);
      // Error toast is already shown in the service function
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitWebsite = () => {
    window.open("https://kalvet.com", "_blank");
    toast({
      title: "Opening Website",
      description: "Redirecting to Kalvet website",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Kalvet Website Integration</CardTitle>
            <CardDescription>
              Connect to your Kalvet-powered website
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-url">Website URL</Label>
            <Input
              id="site-url"
              type="text"
              placeholder="https://your-kalvet-site.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kalvet-api-key">API Key</Label>
            <Input
              id="kalvet-api-key"
              type="password"
              placeholder="Enter your Kalvet API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find your API key in your Kalvet website admin dashboard
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="outline"
          onClick={handleVisitWebsite}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Kalvet
        </Button>
        <Button onClick={handleConnect} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Globe className="h-4 w-4 mr-2" />
          )}
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KalvetIntegration;
