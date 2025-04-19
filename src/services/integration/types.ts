
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
