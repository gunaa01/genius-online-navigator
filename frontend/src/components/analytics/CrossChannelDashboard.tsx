import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  Megaphone,
  Loader2
} from "lucide-react";
import RealTimeMetricsCard from './RealTimeMetricsCard';

// Define channel icons with appropriate colors
const channelIcons = {
  website: <Globe className="h-4 w-4 text-blue-600" />,
  social: <Share2 className="h-4 w-4 text-purple-600" />,
  instagram: <Instagram className="h-4 w-4 text-pink-600" />,
  facebook: <Facebook className="h-4 w-4 text-blue-700" />,
  twitter: <Twitter className="h-4 w-4 text-blue-400" />,
  linkedin: <Linkedin className="h-4 w-4 text-blue-500" />,
  email: <Mail className="h-4 w-4 text-amber-600" />,
  ads: <Megaphone className="h-4 w-4 text-red-600" />,
};

type Channel = keyof typeof channelIcons;

interface ChannelData {
  id: Channel;
  name: string;
  visitors: number;
  previousVisitors: number;
  engagements: number;
  previousEngagements: number;
  conversions: number;
  previousConversions: number;
  revenue: number;
  previousRevenue: number;
}

// Mock data for demonstration
const mockChannelData: ChannelData[] = [
  {
    id: 'website',
    name: 'Website',
    visitors: 12840,
    previousVisitors: 10532,
    engagements: 4327,
    previousEngagements: 3854,
    conversions: 365,
    previousConversions: 312,
    revenue: 28750,
    previousRevenue: 24200,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    visitors: 7620,
    previousVisitors: 6890,
    engagements: 3416,
    previousEngagements: 2785,
    conversions: 187,
    previousConversions: 156,
    revenue: 14320,
    previousRevenue: 12180,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    visitors: 5340,
    previousVisitors: 5780,
    engagements: 2150,
    previousEngagements: 2345,
    conversions: 112,
    previousConversions: 128,
    revenue: 8650,
    previousRevenue: 9840,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    visitors: 3210,
    previousVisitors: 2870,
    engagements: 1540,
    previousEngagements: 1320,
    conversions: 78,
    previousConversions: 64,
    revenue: 6240,
    previousRevenue: 5120,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    visitors: 2870,
    previousVisitors: 2310,
    engagements: 1280,
    previousEngagements: 1050,
    conversions: 96,
    previousConversions: 72,
    revenue: 9120,
    previousRevenue: 7220,
  },
  {
    id: 'email',
    name: 'Email',
    visitors: 8450,
    previousVisitors: 7280,
    engagements: 2910,
    previousEngagements: 2450,
    conversions: 342,
    previousConversions: 287,
    revenue: 24860,
    previousRevenue: 21520,
  },
  {
    id: 'ads',
    name: 'Paid Ads',
    visitors: 9120,
    previousVisitors: 7650,
    engagements: 3240,
    previousEngagements: 2780,
    conversions: 276,
    previousConversions: 234,
    revenue: 19850,
    previousRevenue: 16790,
  },
];

const timeFrameOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7days', label: '7 Days' },
  { value: '30days', label: '30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
];

interface CrossChannelDashboardProps {
  initialTimeFrame?: string;
  enableRealTime?: boolean;
}

export default function CrossChannelDashboard({
  initialTimeFrame = '7days',
  enableRealTime = false,
}: CrossChannelDashboardProps) {
  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<ChannelData[]>(mockChannelData);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate totals
  const totals = channelData.reduce(
    (acc, channel) => {
      return {
        visitors: acc.visitors + channel.visitors,
        previousVisitors: acc.previousVisitors + channel.previousVisitors,
        engagements: acc.engagements + channel.engagements,
        previousEngagements: acc.previousEngagements + channel.previousEngagements,
        conversions: acc.conversions + channel.conversions,
        previousConversions: acc.previousConversions + channel.previousConversions,
        revenue: acc.revenue + channel.revenue,
        previousRevenue: acc.previousRevenue + channel.previousRevenue,
      };
    },
    {
      visitors: 0,
      previousVisitors: 0,
      engagements: 0,
      previousEngagements: 0,
      conversions: 0,
      previousConversions: 0,
      revenue: 0,
      previousRevenue: 0,
    }
  );

  // Mock data fetch
  const refreshData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate data variation on each refresh
      const newData = mockChannelData.map(channel => ({
        ...channel,
        visitors: Math.floor(channel.visitors * (0.95 + Math.random() * 0.1)),
        engagements: Math.floor(channel.engagements * (0.95 + Math.random() * 0.1)),
        conversions: Math.floor(channel.conversions * (0.95 + Math.random() * 0.1)),
        revenue: Math.floor(channel.revenue * (0.95 + Math.random() * 0.1)),
      }));
      
      setChannelData(newData);
    } finally {
      setLoading(false);
    }
  };

  // Handle time frame change
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
    refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cross-Channel Analytics</h2>
          <p className="text-muted-foreground">
            Unified view of performance across all marketing channels
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              {timeFrameOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricsCard
          title="Total Visitors"
          metric={totals.visitors}
          previousMetric={totals.previousVisitors}
          updateInterval={60000}
          isLive={enableRealTime}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return totals.visitors * (0.98 + Math.random() * 0.04);
          }}
        />
        
        <RealTimeMetricsCard
          title="Total Engagements"
          metric={totals.engagements}
          previousMetric={totals.previousEngagements}
          updateInterval={60000}
          isLive={enableRealTime}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return totals.engagements * (0.98 + Math.random() * 0.04);
          }}
        />
        
        <RealTimeMetricsCard
          title="Conversions"
          metric={totals.conversions}
          previousMetric={totals.previousConversions}
          updateInterval={60000}
          isLive={enableRealTime}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return totals.conversions * (0.98 + Math.random() * 0.04);
          }}
        />
        
        <RealTimeMetricsCard
          title="Revenue"
          metric={totals.revenue}
          previousMetric={totals.previousRevenue}
          format="currency"
          prefix="$"
          precision={0}
          updateInterval={60000}
          isLive={enableRealTime}
          fetchData={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return totals.revenue * (0.98 + Math.random() * 0.04);
          }}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            By Channel
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="attribution" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            Attribution
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>
                Compare performance metrics across all marketing channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-4 py-3">Channel</th>
                        <th className="px-4 py-3 text-right">Visitors</th>
                        <th className="px-4 py-3 text-right">Engagements</th>
                        <th className="px-4 py-3 text-right">Conversions</th>
                        <th className="px-4 py-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelData.map((channel) => (
                        <tr key={channel.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium flex items-center">
                            <span className="mr-2">
                              {channelIcons[channel.id] || <Globe className="h-4 w-4" />}
                            </span>
                            {channel.name}
                          </td>
                          <td className="px-4 py-3 text-right">{channel.visitors.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{channel.engagements.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{channel.conversions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">${channel.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="font-semibold bg-muted/30">
                        <td className="px-4 py-3">TOTAL</td>
                        <td className="px-4 py-3 text-right">{totals.visitors.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{totals.engagements.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{totals.conversions.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">${totals.revenue.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Engagement Rate by Channel</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground mb-4">
                        Engagement rate = Engagements / Visitors
                      </div>
                      <div className="space-y-4">
                        {channelData.map((channel) => {
                          const engagementRate = (channel.engagements / channel.visitors) * 100;
                          return (
                            <div key={`engagement-${channel.id}`} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {channelIcons[channel.id] || <Globe className="h-4 w-4" />}
                                  </span>
                                  <span className="text-sm">{channel.name}</span>
                                </div>
                                <span className="text-sm font-medium">{engagementRate.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, engagementRate)}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Conversion Rate by Channel</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground mb-4">
                        Conversion rate = Conversions / Visitors
                      </div>
                      <div className="space-y-4">
                        {channelData.map((channel) => {
                          const conversionRate = (channel.conversions / channel.visitors) * 100;
                          return (
                            <div key={`conversion-${channel.id}`} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {channelIcons[channel.id] || <Globe className="h-4 w-4" />}
                                  </span>
                                  <span className="text-sm">{channel.name}</span>
                                </div>
                                <span className="text-sm font-medium">{conversionRate.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min(100, conversionRate * 10)}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channelData.map((channel) => (
              <Card key={channel.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <span className="mr-2">
                      {channelIcons[channel.id] || <Globe className="h-5 w-5" />}
                    </span>
                    {channel.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Visitors</div>
                      <div className="text-lg font-semibold">{channel.visitors.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Engagements</div>
                      <div className="text-lg font-semibold">{channel.engagements.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Conversions</div>
                      <div className="text-lg font-semibold">{channel.conversions.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Revenue</div>
                      <div className="text-lg font-semibold">${channel.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Engagement Rate</span>
                          <span>{((channel.engagements / channel.visitors) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (channel.engagements / channel.visitors) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Conversion Rate</span>
                          <span>{((channel.conversions / channel.visitors) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (channel.conversions / channel.visitors) * 100 * 5)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Avg. Revenue per Conversion</span>
                          <span>${(channel.revenue / channel.conversions).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Analysis</CardTitle>
              <CardDescription>
                This feature will display trends and forecasts based on historical data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border rounded-md bg-muted/30">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Trend Analysis Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Our data scientists are working on implementing this feature.
                    It will provide detailed trend analysis and AI-driven forecasts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attribution">
          <Card>
            <CardHeader>
              <CardTitle>Attribution Modeling</CardTitle>
              <CardDescription>
                This feature will show conversion attribution across channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border rounded-md bg-muted/30">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Attribution Models Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    We're working on implementing multiple attribution models including 
                    First Touch, Last Touch, Linear, Position Based, and Data-Driven models.
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