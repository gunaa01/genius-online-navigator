import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Activity,
  Users,
  Calendar,
  Search,
  Share2,
  Globe,
  FileText,
  Loader2
} from "lucide-react";
import CrossChannelDashboard from '@/components/analytics/CrossChannelDashboard';
import RealTimeMetricsCard from '@/components/analytics/RealTimeMetricsCard';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState("7days");
  
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights across all your marketing channels
          </p>
        </div>
        
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Data
            </Button>
          </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricsCard
          title="Website Visitors"
          metric={24692}
          previousMetric={21348}
          suffix=" visitors"
          isLive={true}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 24692 * (0.98 + Math.random() * 0.04);
          }}
        />
        
        <RealTimeMetricsCard
          title="Conversion Rate"
          metric={3.7}
          previousMetric={3.2}
          format="percentage"
          precision={1}
          suffix="%"
          isLive={true}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 3.7 * (0.95 + Math.random() * 0.1);
          }}
        />
        
        <RealTimeMetricsCard
          title="Social Engagement"
          metric={18345}
          previousMetric={15678}
          isLive={true}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 18345 * (0.97 + Math.random() * 0.06);
          }}
        />
        
        <RealTimeMetricsCard
          title="Revenue"
          metric={127890}
          previousMetric={114567}
          format="currency"
          prefix="$"
          precision={0}
          isLive={true}
          updateInterval={60000}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return 127890 * (0.98 + Math.random() * 0.04);
          }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 md:w-auto w-full">
          <TabsTrigger value="overview" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Campaigns
          </TabsTrigger>
          </TabsList>

        {/* Overview Tab - Shows key metrics across all channels */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance At A Glance</CardTitle>
              <CardDescription>
                Key metrics across all marketing channels and campaigns
              </CardDescription>
                </CardHeader>
                <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive charts will appear here</p>
                </div>
                  </div>
                </CardContent>
              </Card>
              
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  Visitor journey from awareness to conversion
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive funnel will appear here</p>
                  </div>
                  </div>
                </CardContent>
              </Card>
              
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Revenue patterns over time
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive chart will appear here</p>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        {/* Channels Tab - Shows the cross-channel dashboard */}
        <TabsContent value="channels">
          <CrossChannelDashboard enableRealTime={true} />
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content">
          <Card>
              <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                Analyze engagement and conversion metrics for your content
              </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Content Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on comprehensive content analytics that will show you 
                    performance metrics, engagement rates, and SEO impact of your content.
                  </p>
                </div>
              </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience">
          <Card>
              <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>
                Understand your audience demographics and behavior
              </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Audience Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on detailed audience demographics, geographic distribution,
                    behavior patterns, and engagement preferences.
                  </p>
                </div>
              </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
              <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Track and optimize your marketing campaigns
              </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <div className="text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Campaign Analytics Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on comprehensive campaign tracking with conversion attribution,
                    ROI analysis, and performance comparison across channels.
                  </p>
                </div>
              </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
