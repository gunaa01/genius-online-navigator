
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Integration types
export type IntegrationType = 
  | "wordpress" 
  | "shopify" 
  | "google_analytics"
  | "facebook_ads"
  | "woocommerce" 
  | "twitter" 
  | "linkedin"
  | "instagram"
  | "currency_api"
  | "kalvet";

// Integration
export interface Integration {
  id: string;
  user_id: string;
  name: string;
  type: IntegrationType;
  api_key?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  credentials?: any;
  configuration?: any;
  connected: boolean;
  created_at: string;
  updated_at: string;
}

// Available integrations data
export const availableIntegrations = [
  {
    id: "wordpress",
    name: "WordPress",
    description: "Connect your WordPress site to import content and post updates",
    icon: "wordpress",
    category: "cms"
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync products, orders, and customers from your Shopify store",
    icon: "shopify",
    category: "ecommerce"
  },
  {
    id: "google_analytics",
    name: "Google Analytics",
    description: "Import website analytics data to create reports and insights",
    icon: "google_analytics",
    category: "analytics"
  },
  {
    id: "facebook_ads",
    name: "Facebook Ads",
    description: "Manage and optimize your Facebook ad campaigns",
    icon: "facebook",
    category: "ads"
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Integrate with your WooCommerce store for product and order data",
    icon: "woocommerce",
    category: "ecommerce"
  },
  {
    id: "currency_api",
    name: "Currency API",
    description: "Real-time currency exchange rates for international businesses",
    icon: "currency",
    category: "finance"
  },
  {
    id: "kalvet",
    name: "Kalvet Website",
    description: "Connect to Kalvet's website services for enhanced functionality",
    icon: "website",
    category: "website"
  }
];

// Get user integrations
export const getUserIntegrations = async () => {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return data as Integration[];
  } catch (error: any) {
    toast({
      title: "Error fetching integrations",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Add new integration
export const addIntegration = async (integration: Partial<Integration>) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Ensure required fields are present to match the Supabase table requirements
    if (!integration.name) {
      throw new Error("Integration name is required");
    }

    if (!integration.type) {
      throw new Error("Integration type is required");
    }

    // Create a properly typed object for Supabase insert
    const insertData = {
      user_id: user.id,
      name: integration.name,
      type: integration.type,
      api_key: integration.api_key || null,
      access_token: integration.access_token || null,
      refresh_token: integration.refresh_token || null,
      credentials: integration.credentials || null,
      configuration: integration.configuration || null,
      connected: integration.connected !== undefined ? integration.connected : false
    };

    const { data, error } = await supabase
      .from("integrations")
      .insert(insertData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Integration added",
      description: `${integration.name} has been successfully connected.`,
    });
    
    return data as Integration;
  } catch (error: any) {
    toast({
      title: "Error adding integration",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Update integration
export const updateIntegration = async (id: string, updates: Partial<Integration>) => {
  try {
    const { data, error } = await supabase
      .from("integrations")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Integration updated",
      description: `Integration settings have been updated.`,
    });
    
    return data as Integration;
  } catch (error: any) {
    toast({
      title: "Error updating integration",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Delete integration
export const deleteIntegration = async (id: string) => {
  try {
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    toast({
      title: "Integration removed",
      description: `The integration has been successfully removed.`,
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error removing integration",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Connect to Currency API
export const connectCurrencyApi = async (apiKey: string) => {
  try {
    // Test the API key
    const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=' + apiKey);
    
    if (!response.ok) {
      throw new Error('Invalid API key or connection error');
    }
    
    const data = await response.json();
    
    // Save the integration if the API key is valid
    const integrationData = {
      name: "Currency API",
      type: "currency_api" as IntegrationType,
      api_key: apiKey,
      connected: true,
      configuration: {
        last_tested: new Date().toISOString(),
        currencies: data.data ? Object.keys(data.data) : []
      }
    };
    
    return await addIntegration(integrationData);
    
  } catch (error: any) {
    toast({
      title: "Error connecting to Currency API",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Connect to Kalvet website
export const connectKalvetSite = async (siteUrl: string, apiKey: string) => {
  try {
    // Validate the URL format
    if (!siteUrl.startsWith('http')) {
      siteUrl = 'https://' + siteUrl;
    }
    
    // Validate the URL is properly formatted
    const urlObj = new URL(siteUrl);
    
    // Prepare integration data with required fields
    const integrationData = {
      name: "Kalvet Website",
      type: "kalvet" as IntegrationType,
      api_key: apiKey,
      connected: true,
      configuration: {
        site_url: siteUrl,
        domain: urlObj.hostname
      }
    };
    
    return await addIntegration(integrationData);
    
  } catch (error: any) {
    toast({
      title: "Error connecting to Kalvet website",
      description: error.message || "Invalid URL format",
      variant: "destructive",
    });
    throw error;
  }
};
