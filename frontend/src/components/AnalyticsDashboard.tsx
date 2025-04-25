import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ErrorBoundary from './ErrorBoundary';
import { 
  BarChart2, 
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Globe,
  Clock,
  MousePointer,
  Download,
  Share2,
  Settings
} from 'lucide-react';

// Types
interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  format: 'number' | 'percentage' | 'currency';
}

interface AnalyticsChart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  data: any; // In a real app, this would be properly typed chart data
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

/**
 * AnalyticsDashboard component for displaying comprehensive analytics and insights
 * about website traffic, user behavior, conversions, and business metrics.
 */
const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Format metric value based on its type
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

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">
              <BarChart2 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="audience">
              <Users className="mr-2 h-4 w-4" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="behavior">
              <MousePointer className="mr-2 h-4 w-4" />
              Behavior
            </TabsTrigger>
            <TabsTrigger value="conversions">
              <TrendingUp className="mr-2 h-4 w-4" />
              Conversions
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMetrics.map((metric) => (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatMetricValue(metric)}</div>
                    <div className={`flex items-center text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 
                        (metric.id === 'bounce' ? 'text-green-600' : 'text-red-600') : 
                        'text-gray-600'
                    }`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                      {' '}
                      {Math.abs(metric.change)}% from previous period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>
                    Visitor trends over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Traffic chart will be displayed here</p>
                    {/* In a real implementation, this would be a chart component */}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>
                    Where your visitors are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Traffic sources chart will be displayed here</p>
                    {/* In a real implementation, this would be a chart component */}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>
                    Visits by device type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Device breakdown chart will be displayed here</p>
                    {/* In a real implementation, this would be a chart component */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>
                  Understand who your visitors are
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Age Distribution</h3>
                    <div className="h-[250px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Age distribution chart will be displayed here</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Gender Distribution</h3>
                    <div className="h-[250px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Gender distribution chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Where your visitors are located
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Geographic map will be displayed here</p>
                  {/* In a real implementation, this would be a map component */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interests & Affinities</CardTitle>
                <CardDescription>
                  Topics and categories your audience is interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Interests chart will be displayed here</p>
                  {/* In a real implementation, this would be a chart component */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
                <CardDescription>
                  Most visited pages and their metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Page</th>
                        <th className="text-right py-3 px-4">Views</th>
                        <th className="text-right py-3 px-4">Avg. Time</th>
                        <th className="text-right py-3 px-4">Bounce Rate</th>
                        <th className="text-right py-3 px-4">Exit Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">/home</td>
                        <td className="text-right py-3 px-4">12,543</td>
                        <td className="text-right py-3 px-4">2:15</td>
                        <td className="text-right py-3 px-4">32%</td>
                        <td className="text-right py-3 px-4">18%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">/products</td>
                        <td className="text-right py-3 px-4">8,721</td>
                        <td className="text-right py-3 px-4">3:42</td>
                        <td className="text-right py-3 px-4">24%</td>
                        <td className="text-right py-3 px-4">15%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">/blog</td>
                        <td className="text-right py-3 px-4">6,432</td>
                        <td className="text-right py-3 px-4">4:12</td>
                        <td className="text-right py-3 px-4">28%</td>
                        <td className="text-right py-3 px-4">22%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">/contact</td>
                        <td className="text-right py-3 px-4">3,987</td>
                        <td className="text-right py-3 px-4">1:45</td>
                        <td className="text-right py-3 px-4">35%</td>
                        <td className="text-right py-3 px-4">42%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">/about</td>
                        <td className="text-right py-3 px-4">2,876</td>
                        <td className="text-right py-3 px-4">2:32</td>
                        <td className="text-right py-3 px-4">30%</td>
                        <td className="text-right py-3 px-4">25%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Flow</CardTitle>
                <CardDescription>
                  How users navigate through your site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">User flow diagram will be displayed here</p>
                  {/* In a real implementation, this would be a flow diagram component */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Site Speed</CardTitle>
                <CardDescription>
                  Page load times and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Page Load</p>
                    <p className="text-2xl font-bold">1.8s</p>
                    <p className="text-xs text-green-600">↓ 0.3s from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">First Contentful Paint</p>
                    <p className="text-2xl font-bold">0.9s</p>
                    <p className="text-xs text-green-600">↓ 0.1s from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Time to Interactive</p>
                    <p className="text-2xl font-bold">2.3s</p>
                    <p className="text-xs text-green-600">↓ 0.4s from last month</p>
                  </div>
                </div>
                
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Performance trend chart will be displayed here</p>
                  {/* In a real implementation, this would be a chart component */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  Track how users progress through your conversion funnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Conversion funnel chart will be displayed here</p>
                  {/* In a real implementation, this would be a funnel chart component */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Goal Completions</CardTitle>
                <CardDescription>
                  Track progress toward your defined goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Sign-ups</p>
                    <p className="text-2xl font-bold">1,245</p>
                    <p className="text-xs text-green-600">↑ 15% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Purchases</p>
                    <p className="text-2xl font-bold">867</p>
                    <p className="text-xs text-green-600">↑ 12% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                    <p className="text-2xl font-bold">3,421</p>
                    <p className="text-xs text-green-600">↑ 8% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Contact Form</p>
                    <p className="text-2xl font-bold">532</p>
                    <p className="text-xs text-green-600">↑ 5% from last month</p>
                  </div>
                </div>
                
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Goal completions trend chart will be displayed here</p>
                  {/* In a real implementation, this would be a chart component */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>
                  Track revenue and sales performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$128,540</p>
                    <p className="text-xs text-green-600">↑ 18% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                    <p className="text-2xl font-bold">$148.25</p>
                    <p className="text-xs text-green-600">↑ 5% from last month</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">3.8%</p>
                    <p className="text-xs text-green-600">↑ 0.5% from last month</p>
                  </div>
                </div>
                
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Revenue trend chart will be displayed here</p>
                  {/* In a real implementation, this would be a chart component */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Settings</CardTitle>
                <CardDescription>
                  Configure your analytics dashboard preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Data Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium">Google Analytics</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="p-4 border rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium">Facebook Pixel</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="p-4 border rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium">Hotjar</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    <div className="p-4 border rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium">Custom Analytics</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Dashboard Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <p className="font-medium">Default Date Range</p>
                      <Select defaultValue="30d">
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select default date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 90 days</SelectItem>
                          <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="font-medium">Default View</p>
                      <Select defaultValue="overview">
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="audience">Audience</SelectItem>
                          <SelectItem value="behavior">Behavior</SelectItem>
                          <SelectItem value="conversions">Conversions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsDashboard;
