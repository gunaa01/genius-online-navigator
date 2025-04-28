
import React, { useState } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plug } from "lucide-react";
import { useDemoData } from "@/hooks/useDemoData";
import IntegrationCard from "@/components/common/IntegrationCard";
import IntegrationsList from '@/components/integrations/IntegrationsList';
import { useToast } from "@/hooks/use-toast";
import IntegrationPlatforms from '@/components/integrations/IntegrationPlatforms';
import ApiKeysTab from '@/components/integrations/ApiKeysTab';
import WebhooksTab from '@/components/integrations/WebhooksTab';
import DataImportTab, { DataImport } from '@/components/integrations/DataImportTab';

// Mock data
const apiKeys = [
  {
    id: 1,
    name: "Google Analytics API Key",
    key: "GA-API-xxxxx-xxxxx",
    created: "2025-03-15",
    lastUsed: "2025-04-15"
  },
  {
    id: 2,
    name: "Facebook Ads API Key",
    key: "FB-API-xxxxx-xxxxx",
    created: "2025-03-20",
    lastUsed: "2025-04-12"
  }
];

const webhooks = [
  {
    id: 1,
    name: "New Customer Notification",
    url: "https://hooks.yourwebsite.com/customers",
    events: ["customer.created"],
    active: true
  },
  {
    id: 2,
    name: "Order Processing",
    url: "https://hooks.yourwebsite.com/orders",
    events: ["order.created", "order.updated"],
    active: true
  },
  {
    id: 3,
    name: "Payment Updates",
    url: "https://hooks.yourwebsite.com/payments",
    events: ["payment.succeeded", "payment.failed"],
    active: false
  }
];

const dataImports: DataImport[] = [
  {
    id: 1,
    filename: "customer_data_march.csv",
    type: "Customer Data",
    size: "2.4 MB",
    importDate: "2025-03-31",
    status: "completed",
    records: 1245
  },
  {
    id: 2,
    filename: "product_inventory_q1.xlsx",
    type: "Inventory",
    size: "3.8 MB",
    importDate: "2025-04-05",
    status: "completed",
    records: 876
  },
  {
    id: 3,
    filename: "marketing_data.csv",
    type: "Marketing",
    size: "1.2 MB",
    importDate: "2025-04-12",
    status: "processing",
    records: null
  }
];

const Integrations = () => {
  const { integrations, loading } = useDemoData();
  const [activeTab, setActiveTab] = useState("platforms");
  const { toast } = useToast();

  // Handler functions
  const handleConnectIntegration = (integrationName: string) => {
    toast({
      title: "Connection Initiated",
      description: `Connecting to ${integrationName}...`,
    });
  };

  const handleConfigureIntegration = (integrationName: string) => {
    toast({
      title: "Configure Integration",
      description: `Opening configuration for ${integrationName}`,
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Data",
      description: "Opening data import wizard",
    });
  };

  const handleGenerateApiKey = () => {
    toast({
      title: "API Key Generated",
      description: "A new API key has been created",
    });
  };

  const handleRevokeApiKey = (keyId: number) => {
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked",
    });
  };

  const handleAddWebhook = () => {
    toast({
      title: "Add Webhook",
      description: "Opening webhook configuration form",
    });
  };

  const handleEditWebhook = (webhookName: string) => {
    toast({
      title: "Edit Webhook",
      description: `Opening webhook editor for ${webhookName}`
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">Connect your data sources and tools</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" /> Import Data
            </Button>
            <Button onClick={() => handleConnectIntegration("New Integration")}>
              <Plug className="mr-2 h-4 w-4" /> Add Integration
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="custom">Custom Integrations</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="import">Data Import</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms">
            <IntegrationPlatforms 
              handleConnectIntegration={handleConnectIntegration}
              handleConfigureIntegration={handleConfigureIntegration}
            />
            <IntegrationCard integrations={integrations} loading={loading} />
          </TabsContent>

          <TabsContent value="custom">
            <IntegrationsList />
          </TabsContent>

          <TabsContent value="api-keys">
            <ApiKeysTab 
              apiKeys={apiKeys} 
              onGenerateApiKey={handleGenerateApiKey}
              onRevokeApiKey={handleRevokeApiKey}
            />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhooksTab 
              webhooks={webhooks} 
              onAddWebhook={handleAddWebhook}
              onEditWebhook={handleEditWebhook}
            />
          </TabsContent>

          <TabsContent value="import">
            <DataImportTab 
              dataImports={dataImports}
              onImportData={handleImportData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
