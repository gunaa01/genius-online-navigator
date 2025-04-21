// Renamed from Index.tsx
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import ReportGenerator from "@/components/dashboard/ReportGenerator";
import SocialMediaConnect from "@/components/dashboard/SocialMediaConnect";
import AIInsights from "@/components/dashboard/AIInsights";
import IntegrationCard from "@/components/common/IntegrationCard";
import { useDemoData } from "@/hooks/useDemoData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Plus, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { 
    metrics, 
    visitors, 
    revenue, 
    socialAccounts, 
    integrations, 
    reports, 
    loading 
  } = useDemoData();

  return (
    <DashboardLayout>
      <div style={{background: 'yellow', padding: 20, fontWeight: 'bold'}}>Hello from Dashboard (debug test)</div>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search..." 
                className="pl-9 w-full md:w-64"
              />
            </div>
            <Button size="icon" variant="outline">
              <Bell className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </header>

        <section>
          <MetricsOverview metrics={metrics} loading={loading} />
        </section>

        <section>
          <AnalyticsPanel 
            visitors={visitors} 
            revenue={revenue} 
            loading={loading} 
          />
        </section>

        <section>
          <ReportGenerator reports={reports} loading={loading} />
        </section>

        <section>
          <SocialMediaConnect accounts={socialAccounts} loading={loading} />
        </section>

        <section>
          <AIInsights loading={loading} />
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration: Record<string, unknown>) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
