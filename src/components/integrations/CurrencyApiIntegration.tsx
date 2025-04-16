
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign, ExternalLink } from "lucide-react";
import { connectCurrencyApi } from "@/services/integrationService";
import { useToast } from "@/hooks/use-toast";

interface CurrencyApiIntegrationProps {
  onSuccess: () => void;
}

const CurrencyApiIntegration = ({ onSuccess }: CurrencyApiIntegrationProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to connect",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await connectCurrencyApi(apiKey);
      toast({
        title: "Success!",
        description: "Currency API connected successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error connecting Currency API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Currency API Integration</CardTitle>
            <CardDescription>
              Connect to real-time currency exchange rates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Currency API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from the{" "}
              <a
                href="https://currencyapi.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Currency API website
              </a>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="outline"
          onClick={() => window.open("https://currencyapi.com", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Website
        </Button>
        <Button onClick={handleConnect} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <DollarSign className="h-4 w-4 mr-2" />
          )}
          Connect API
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrencyApiIntegration;
