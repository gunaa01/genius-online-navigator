
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Settings, ExternalLink } from "lucide-react";
import { Integration, getUserIntegrations, deleteIntegration } from "@/services/integrationService";
import { useToast } from "@/hooks/use-toast";
import CurrencyApiIntegration from "./CurrencyApiIntegration";
import KalvetIntegration from "./KalvetIntegration";

const IntegrationsList = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("currency");
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getUserIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error("Error loading integrations:", error);
      toast({
        title: "Error loading integrations",
        description: "Failed to load your integrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to disconnect ${name}?`)) {
      try {
        await deleteIntegration(id);
        setIntegrations(integrations.filter(i => i.id !== id));
        toast({
          title: "Integration disconnected",
          description: `${name} has been successfully removed.`,
        });
      } catch (error) {
        console.error("Error deleting integration:", error);
        toast({
          title: "Error removing integration",
          description: "Failed to remove the integration. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleIntegrationAdded = () => {
    setAddDialogOpen(false);
    loadIntegrations();
    toast({
      title: "Integration added",
      description: "Your new integration has been successfully connected.",
    });
  };

  const handleConfigure = (integration: Integration) => {
    toast({
      title: "Configure Integration",
      description: `Opening configuration for ${integration.name}`,
    });
    // In a real app, this would open a configuration modal for the specific integration
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'currency_api':
        return <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>;
      case 'kalvet':
        return <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Custom Integrations</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="currency">Currency API</TabsTrigger>
                <TabsTrigger value="kalvet">Kalvet Website</TabsTrigger>
              </TabsList>
              <TabsContent value="currency">
                <CurrencyApiIntegration onSuccess={handleIntegrationAdded} />
              </TabsContent>
              <TabsContent value="kalvet">
                <KalvetIntegration onSuccess={handleIntegrationAdded} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : integrations.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getIntegrationIcon(integration.type)}
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription className="text-xs capitalize">
                        {integration.type.replace('_', ' ')}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={integration.connected ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700"}>
                    {integration.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                {integration.type === 'currency_api' && (
                  <div>
                    <p className="text-xs text-muted-foreground">API Key: •••••{integration.api_key?.slice(-4)}</p>
                    {integration.configuration?.currencies && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {integration.configuration.currencies.length} currencies available
                      </p>
                    )}
                  </div>
                )}
                
                {integration.type === 'kalvet' && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Site: {integration.configuration?.site_url}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      API Key: •••••{integration.api_key?.slice(-4)}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConfigure(integration)}
                >
                  <Settings className="h-3.5 w-3.5 mr-1.5" />
                  Configure
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(integration.id, integration.name)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="py-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Integrations Added</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
              Add your first custom integration to connect with Currency API or Kalvet websites.
            </p>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Integration
              </Button>
            </DialogTrigger>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegrationsList;
