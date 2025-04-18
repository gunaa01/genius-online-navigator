
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

const Index = () => {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <ReportGenerator reports={reports} loading={loading} />
          </section>
          <section>
            <AIInsights />
          </section>
        </div>

        <section>
          <SocialMediaConnect accounts={socialAccounts} loading={loading} />
        </section>

        <section>
          <IntegrationCard integrations={integrations} loading={loading} />
        </section>
        
        <section className="border rounded-lg p-6 bg-muted/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">New to Genius?</h3>
                <p className="text-muted-foreground">Learn more about our features and how to take your business online.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/offline-to-online">Offline to Online Guide</Link>
              </Button>
              <Button asChild>
                <Link to="/landing">Platform Overview</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
