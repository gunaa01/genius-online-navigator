// Enhanced demo data with more realistic and richer dashboard content
import { useState, useEffect } from "react";

export function useDemoData() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ users: 1240, sales: 320, growth: 17, churn: 2.1 });
  const [visitors, setVisitors] = useState([120, 140, 180, 210, 240, 260, 280]);
  const [revenue, setRevenue] = useState([1200, 1350, 1500, 1700, 1900, 2100, 2300]);
  const [socialAccounts, setSocialAccounts] = useState([
    { platform: "Twitter", connected: true, followers: 1200 },
    { platform: "Facebook", connected: true, followers: 950 },
    { platform: "Instagram", connected: false, followers: 0 },
  ]);
  const [integrations, setIntegrations] = useState([
    { name: "Zapier", active: true, logo: "zapier.png" },
    { name: "Slack", active: false, logo: "slack.png" },
    { name: "Shopify", active: true, logo: "shopify.png" },
  ]);
  const [reports, setReports] = useState([
    { id: 1, name: "April Report", date: "2025-04-01", summary: "Strong growth in user engagement and revenue." },
    { id: 2, name: "March Report", date: "2025-03-01", summary: "Steady increase in new signups." },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return {
    metrics,
    visitors,
    revenue,
    socialAccounts,
    integrations,
    reports,
    loading,
  };
}
