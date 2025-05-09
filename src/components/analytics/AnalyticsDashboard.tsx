import React, { useState, useEffect, useCallback } from 'react';
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
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Activity,
  Users,
  Calendar,
  FileText,
  Loader2,
  Globe,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Info,
  Settings,
  MousePointer,
  TrendingUp,
  Share2
} from "lucide-react";
import CrossChannelDashboard from './CrossChannelDashboard';
import RealTimeMetricsCard from './RealTimeMetricsCard';
import SEOAnalyticsDashboard from './SEOAnalyticsDashboard';
import ErrorBoundary from '../ErrorBoundary';

// Types
interface AnalyticsDashboardProps {
  variant?: 'default' | 'innovation' | 'comprehensive';
  enableRealTime?: boolean;
}

// Mock data for analytics
const overviewStats = [
  {
    title: 'Active Projects',
    value: 24,
    change: 12.5,
    trend: 'up',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
  },
  {
    title: 'Team Utilization',
    value: '78%',
    change: 5.2,
    trend: 'up',
    icon: <Users className="h-5 w-5 text-blue-500" />
  },
  {
    title: 'Avg. Project Duration',
    value: '32 days',
    change: -8.3,
    trend: 'down',
    icon: <Clock className="h-5 w-5 text-amber-500" />
  },
  {
    title: 'Revenue',
    value: '$128.5K',
    change: 18.7,
    trend: 'up',
    icon: <DollarSign className="h-5 w-5 text-emerald-500" />
  }
];

// Interface for metrics
interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  format: 'number' | 'percentage' | 'currency';
}

// Mock data
const mockMetrics: AnalyticsMetric[] = [
  {
    id: 'visitors',
    name: 'Total Visitors',
    value: 24689,
    change: 12.5,
    trend: 'up',
    format: 'number'
  },
  {
    id: 'pageviews',
    name: 'Page Views',
    value: 78432,
    change: 8.2,
    trend: 'up',
    format: 'number'
  },
  {
    id: 'bounce',
    name: 'Bounce Rate',
    value: 42.3,
    change: -3.1,
    trend: 'down',
    format: 'percentage'
  },
  {
    id: 'conversion',
    name: 'Conversion Rate',
    value: 3.8,
    change: 0.5,
    trend: 'up',
    format: 'percentage'
  },
  {
    id: 'revenue',
    name: 'Revenue',
    value: 12580,
    change: 15.3,
    trend: 'up',
    format: 'currency'
  },
  {
    id: 'avgtime',
    name: 'Avg. Time on Site',
    value: 3.2,
    change: 0.8,
    trend: 'up',
    format: 'number'
  },
];

const formatMetricValue = (metric: AnalyticsMetric) => {
  switch (metric.format) {
    case 'percentage':
      return `${metric.value}%`;
    case 'currency':
      return `$${metric.value.toLocaleString()}`;
    default:
      return metric.value.toLocaleString();
  }
};

// Format number with k/m for thousands/millions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Enhanced AnalyticsDashboard component with multiple variants and functionality
 */
export default function AnalyticsDashboard({ 
  variant = 'default',
  enableRealTime = false 
}: AnalyticsDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState("30d");
  const [activeTab, setActiveTab] = useState('overview');
  const [forecast, setForecast] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [reportScheduled, setReportScheduled] = useState(false);
  
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };
  
  // Mock predictive analytics function
  const predictFuture = useCallback(async () => {
    // Replace with real AI/analytics integration
    setForecast('Expected visitors next week: 30,000 (+15%)');
  }, []);

  // Mock actionable insights
  useEffect(() => {
    setInsights([
      'Traffic spike detected on Monday (↑22%)',
      'Conversion rate below average on mobile (↓5%)',
      'Consider optimizing landing page for better retention.'
    ]);
  }, []);

  const handleScheduleReport = () => {
    setReportScheduled(true);
    // Logic for scheduling report export (placeholder)
  };
  
  // Render based on variant
  if (variant === 'innovation') {
    return <InnovationAnalyticsDashboard timeFrame={timeFrame} setTimeFrame={setTimeFrame} />;
  }
  
  if (variant === 'comprehensive') {
    return <ComprehensiveAnalyticsDashboard 
      enableRealTime={enableRealTime}
      timeFrame={timeFrame}
      setTimeFrame={setTimeFrame}
      insights={insights}
      forecast={forecast}
      predictFuture={predictFuture}
      handleScheduleReport={handleScheduleReport}
      reportScheduled={reportScheduled}
    />;
  }
  
  // Default dashboard
  return (
    <div className="space-y-8">
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
      
      {enableRealTime && (
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
      )}
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 md:w-auto w-full">
          <TabsTrigger value="overview" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Audience
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
          <CrossChannelDashboard enableRealTime={enableRealTime} />
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

        {/* SEO Tab */}
        <TabsContent value="seo">
          <SEOAnalyticsDashboard enableRealTime={enableRealTime} />
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
                  <h3 className="text-lg font-medium mb-2">Audience Analytics</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Detailed audience insights will be displayed here, including demographics,
                    interests, behavior patterns, and engagement metrics.
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

// Innovation-focused analytics dashboard
const InnovationAnalyticsDashboard = ({ timeFrame, setTimeFrame }: { timeFrame: string, setTimeFrame: (value: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Innovation Analytics</h1>
          <p className="text-muted-foreground">Insights and metrics to track your innovation initiatives</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={timeFrame}
            onValueChange={setTimeFrame}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>AI-Powered Insights Available</AlertTitle>
        <AlertDescription>
          We've analyzed your data and found 3 opportunities to improve project efficiency.
          <Button variant="link" className="p-0 h-auto">View Insights</Button>
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                {stat.icon}
              </div>
              <div className="mt-3 flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Additional Innovation analytics specific components would go here */}
    </div>
  );
};

// Comprehensive analytics dashboard with all features
const ComprehensiveAnalyticsDashboard = ({ 
  enableRealTime = false,
  timeFrame,
  setTimeFrame,
  insights,
  forecast,
  predictFuture,
  handleScheduleReport,
  reportScheduled
}: { 
  enableRealTime: boolean;
  timeFrame: string;
  setTimeFrame: (value: string) => void;
  insights: string[];
  forecast: string | null;
  predictFuture: () => Promise<void>;
  handleScheduleReport: () => void;
  reportScheduled: boolean;
}) => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Comprehensive Analytics</h1>
          <div className="flex items-center gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {enableRealTime && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Real-time data enabled</AlertTitle>
            <AlertDescription>
              You're viewing real-time analytics data that updates automatically.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMetricValue(metric)}</div>
                <div className="flex items-center mt-1">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : metric.trend === 'down' ? (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  ) : null}
                  <span className={`text-sm ${
                    metric.trend === 'up' 
                      ? 'text-green-500' 
                      : metric.trend === 'down' 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional comprehensive analytics components would go here */}
        
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>AI-powered analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, i) => (
              <Alert key={i}>
                <Info className="h-4 w-4" />
                <AlertDescription>{insight}</AlertDescription>
              </Alert>
            ))}
            
            {forecast && (
              <Alert className="bg-purple-50 border-purple-200">
                <Activity className="h-4 w-4 text-purple-500" />
                <AlertDescription className="text-purple-700">{forecast}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={predictFuture}>
                Generate Forecast
              </Button>
              <Button 
                variant={reportScheduled ? "outline" : "default"}
                onClick={handleScheduleReport}
                disabled={reportScheduled}
              >
                {reportScheduled ? "Report Scheduled" : "Schedule Weekly Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

// Export specialized components separately
export { InnovationAnalyticsDashboard, ComprehensiveAnalyticsDashboard };