
import { useState, useEffect } from "react";

export interface MetricData {
  name: string;
  value: number;
  change: number;
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface SocialAccount {
  id: string;
  platform: "twitter" | "instagram" | "facebook" | "linkedin";
  username: string;
  followers: number;
  connected: boolean;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: "analytics" | "social" | "ads";
  date: string;
  downloadUrl: string;
}

export function useDemoData() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [visitors, setVisitors] = useState<ChartData[]>([]);
  const [revenue, setRevenue] = useState<ChartData[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics([
        { name: "Total Visitors", value: 37892, change: 12.5, icon: "user" },
        { name: "Conversion Rate", value: 4.7, change: 2.1, icon: "percent" },
        { name: "Avg. Session", value: 3.2, change: -0.8, icon: "clock" },
        { name: "Total Revenue", value: 48900, change: 14.2, icon: "dollar" }
      ]);
      
      setVisitors([
        { name: "Mon", value: 2400 },
        { name: "Tue", value: 1398 },
        { name: "Wed", value: 9800 },
        { name: "Thu", value: 3908 },
        { name: "Fri", value: 4800 },
        { name: "Sat", value: 3800 },
        { name: "Sun", value: 4300 }
      ]);
      
      setRevenue([
        { name: "Mon", value: 4000 },
        { name: "Tue", value: 3000 },
        { name: "Wed", value: 2000 },
        { name: "Thu", value: 2780 },
        { name: "Fri", value: 1890 },
        { name: "Sat", value: 2390 },
        { name: "Sun", value: 3490 }
      ]);
      
      setSocialAccounts([
        { id: "1", platform: "twitter", username: "@yourbusiness", followers: 2450, connected: true },
        { id: "2", platform: "instagram", username: "@yourbusiness", followers: 8350, connected: true },
        { id: "3", platform: "facebook", username: "Your Business", followers: 4200, connected: false },
        { id: "4", platform: "linkedin", username: "Your Business", followers: 1800, connected: false }
      ]);
      
      setIntegrations([
        { id: "1", name: "WordPress", icon: "wordpress", description: "Connect your WordPress website", connected: true },
        { id: "2", name: "Shopify", icon: "shopping-bag", description: "Connect your Shopify store", connected: false },
        { id: "3", name: "WooCommerce", icon: "shopping-cart", description: "Connect your WooCommerce store", connected: false },
        { id: "4", name: "Google Analytics", icon: "bar-chart", description: "Connect your Google Analytics", connected: true },
        { id: "5", name: "Facebook Ads", icon: "facebook", description: "Connect your Facebook Ads account", connected: false },
        { id: "6", name: "Google Ads", icon: "google", description: "Connect your Google Ads account", connected: false }
      ]);
      
      setReports([
        { id: "1", name: "Monthly Website Analytics", type: "analytics", date: "2025-04-01", downloadUrl: "#" },
        { id: "2", name: "Social Media Performance", type: "social", date: "2025-04-05", downloadUrl: "#" },
        { id: "3", name: "Ad Campaign Results", type: "ads", date: "2025-04-10", downloadUrl: "#" },
        { id: "4", name: "Quarterly Performance", type: "analytics", date: "2025-03-31", downloadUrl: "#" }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  return {
    metrics,
    visitors,
    revenue,
    socialAccounts,
    integrations,
    reports,
    loading
  };
}
