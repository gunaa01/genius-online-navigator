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
import { 
  Search, Bell, Plus, HelpCircle, Calendar, Filter, 
  TrendingUp, RefreshCw, Download, Zap, Settings, 
  FileText, BarChart2, Mail, Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  
  const [dateRange, setDateRange] = useState("7days");
  const [healthScore, setHealthScore] = useState({ score: 0, status: "" });
  
  // Calculate Business Health Score based on metrics
  useEffect(() => {
    if (!loading && metrics.length > 0) {
      // Simple algorithm: average of normalized metrics
      const conversionRate = metrics.find(m => m.name === "Conversion Rate")?.value || 0;
      const revenueValue = metrics.find(m => m.name === "Total Revenue")?.value || 0;
      const visitors = metrics.find(m => m.name === "Total Visitors")?.value || 0;
      
      // Normalize and weight different factors
      const normalizedConversion = (conversionRate / 10) * 0.4; // 40% weight, assuming 10% is excellent
      const normalizedRevenue = (revenueValue / 100000) * 0.35; // 35% weight, assuming $100k is excellent
      const normalizedVisitors = (visitors / 50000) * 0.25; // 25% weight, assuming 50k is excellent
      
      // Calculate score (0-100)
      const score = Math.min(100, Math.round((normalizedConversion + normalizedRevenue + normalizedVisitors) * 100));
      
      // Determine status
      let status = "Critical";
      if (score >= 80) status = "Excellent";
      else if (score >= 60) status = "Good";
      else if (score >= 40) status = "Fair";
      else if (score >= 20) status = "Poor";
      
      setHealthScore({ score, status });
    }
  }, [loading, metrics]);

  return (
    <DashboardLayout>
      <Helmet>
        <title>Genius Dashboard | Business Analytics & Insights</title>
        <meta name="description" content="View your key business metrics, analytics, and AI-powered insights all in one place." />
      </Helmet>
      
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
            <Button size="icon" variant="outline" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </header>
        
        {/* Date Range & Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-3.5 w-3.5 mr-2" />
              Customize
            </Button>
          </div>
        </div>
        
        {/* Business Health Score */}
        {!loading && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                Business Health Score
                <Badge variant={
                  healthScore.status === "Excellent" ? "success" : 
                  healthScore.status === "Good" ? "default" : 
                  healthScore.status === "Fair" ? "warning" : 
                  "destructive"
                }>
                  {healthScore.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {healthScore.score}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">Your business health score is calculated from conversion rates, revenue, and visitor trends.</p>
                  <Link to="/analytics" className="text-sm text-primary flex items-center mt-1">
                    <Zap className="h-3 w-3 mr-1" /> Get recommendations to improve
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
        
        {/* Quick Action Shortcuts */}
        <section>
          <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/ads">
              <Card className="hover:border-primary hover:bg-primary/5 transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Create Ad</h3>
                </CardContent>
              </Card>
            </Link>
            <Link to="/social">
              <Card className="hover:border-primary hover:bg-primary/5 transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Schedule Post</h3>
                </CardContent>
              </Card>
            </Link>
            <Link to="/reports">
              <Card className="hover:border-primary hover:bg-primary/5 transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Generate Report</h3>
                </CardContent>
              </Card>
            </Link>
            <Link to="/team">
              <Card className="hover:border-primary hover:bg-primary/5 transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Invite Team</h3>
                </CardContent>
              </Card>
            </Link>
          </div>
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
