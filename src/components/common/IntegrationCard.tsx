
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ShoppingCart,
  BarChart,
  Facebook,
  Upload,
  FileDown,
  Plug,
  Check,
  ExternalLink
} from "lucide-react";
import { Integration } from "@/hooks/useDemoData";

interface IntegrationCardProps {
  integrations: Integration[];
  loading: boolean;
}

const IntegrationCard = ({ integrations, loading }: IntegrationCardProps) => {
  if (loading) {
    return (
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-24 animate-pulse bg-secondary rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIntegrationIcon = (icon: string) => {
    switch (icon) {
      case "wordpress":
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 19.5c-5.247 0-9.5-4.253-9.5-9.5S6.753 2.5 12 2.5s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5z"/><path d="M3.866 12c0 3.028 1.761 5.65 4.315 6.884l-3.657-9.999c-.532.983-.842 2.115-.842 3.321zm14.601-1.503c0-.946-.341-1.603-.633-2.112-.388-.649-.754-1.198-.754-1.845 0-.723.549-1.397 1.324-1.397.035 0 .068.005.104.006a8.145 8.145 0 00-4.596-1.421L9.602 9.022l2.271.006c.036.556.104 1.076.275 1.563.165.475.261.861.437 1.563a11.12 11.12 0 01-.55 2.673l-.723 2.414-2.619-7.792a17.325 17.325 0 00-.005 5.448l.073.291-2.438-7.294a7.966 7.966 0 00-.99-.078c-1.284 0-2.394.23-2.394.23.034.546.096 1.186.177 2.061l.022.258 1.135.1-.002.01a8.15 8.15 0 00.639 3.517l2.742 7.592c.28.08.57.149.86.212A8.133 8.133 0 0012 20.5a8.103 8.103 0 003.788-.937.293.293 0 00-.018-.066l-1.83-5l1.209-3.471c.201-.581.343-1.091.343-1.529zm-6.89 1.231l2.24 6.495c-1.628-.861-2.23-2.468-2.235-2.624 0-.006-.004-.009-.005-.014zm8.064 2.461c.1-.824.158-1.548.158-2.189a6.8 6.8 0 00-.153-1.314c-.146-.721-.342-1.312-.54-1.839.683 1.248 1.074 2.676 1.074 4.203 0 2.26-1.051 4.278-2.69 5.587l.036-.055zm1.484-8.04c.033-.529.547-.928 1.108-.928.555 0 1.005.386 1.005.865 0 .395-.229.753-.702.753-.486 0-.939-.436-.939-.865 0-.022.012-.385.012-.385a1.019 1.019 0 00-.484-.871z"/></svg>;
      case "shopping-bag":
        return <ShoppingBag className="h-5 w-5" />;
      case "shopping-cart":
        return <ShoppingCart className="h-5 w-5" />;
      case "bar-chart":
        return <BarChart className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "google":
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>;
      default:
        return <Plug className="h-5 w-5" />;
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Plug className="h-5 w-5 mr-2 text-primary" />
          Data Integrations
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Data
          </Button>
          <Button size="sm">
            <Plug className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div 
              key={integration.id} 
              className={`flex items-center p-4 rounded-lg border ${integration.connected ? 'bg-secondary/30 border-primary/20' : 'bg-secondary/10 border-secondary/50'}`}
            >
              <div className={`h-10 w-10 rounded-full ${integration.connected ? 'bg-primary/10' : 'bg-secondary/50'} flex items-center justify-center mr-4`}>
                {getIntegrationIcon(integration.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
              <Button 
                variant={integration.connected ? "outline" : "secondary"} 
                size="sm"
                className={integration.connected ? "text-primary border-primary/30" : ""}
              >
                {integration.connected ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
