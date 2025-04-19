
import { toast } from "@/hooks/use-toast";
import { addIntegration } from "./integrationApi";
import { IntegrationType } from "./types";

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
