
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import { FileText, BarChart2, TrendingUp, PieChart as PieChartIcon, Download, Filter, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for demonstration
const sampleContentData = {
  engagement: [
    { name: 'Blog Posts', views: 1240, shares: 350, comments: 210, likes: 840 },
    { name: 'Social Media', views: 2180, shares: 890, comments: 560, likes: 1250 },
    { name: 'Email Campaigns', views: 980, shares: 120, comments: 90, likes: 320 },
    { name: 'Landing Pages', views: 1560, shares: 210, comments: 110, likes: 430 },
  ],
  performance: [
    { date: '2023-01', blog: 42, social: 63, email: 28 },
    { date: '2023-02', blog: 51, social: 70, email: 34 },
    { date: '2023-03', blog: 48, social: 68, email: 42 },
    { date: '2023-04', blog: 61, social: 75, email: 45 },
    { date: '2023-05', blog: 65, social: 80, email: 56 },
    { date: '2023-06', blog: 72, social: 85, email: 61 },
  ],
  distribution: [
    { name: 'Blog Posts', value: 35 },
    { name: 'Social Media', value: 45 },
    { name: 'Email Campaigns', value: 20 },
  ]
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ContentAnalyzerProps {
  data?: typeof sampleContentData;
}

const ContentAnalyzer: React.FC<ContentAnalyzerProps> = ({ data = sampleContentData }) => {
  const [timeRange, setTimeRange] = useState<string>('6months');
  const [activeTab, setActiveTab] = useState<string>('engagement');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Refreshing data",
      description: "Your content analytics are being updated.",
    });
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data refreshed",
        description: "Your content analytics have been updated.",
      });
    }, 1500);
  };

  const handleDownload = () => {
    toast({
      title: "Report downloaded",
      description: "Your content analytics report has been downloaded.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Content Analytics
            </CardTitle>
            <CardDescription>
              Analyze engagement and performance across your content
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="engagement">
              <BarChart2 className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="performance">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Distribution
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="engagement" className="mt-0">
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.engagement || []} // Handle case when data is undefined
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#0088FE" name="Views" />
                <Bar dataKey="shares" fill="#00C49F" name="Shares" />
                <Bar dataKey="comments" fill="#FFBB28" name="Comments" />
                <Bar dataKey="likes" fill="#FF8042" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data?.engagement?.[0] && Object.keys(data.engagement[0])
              .filter(key => key !== 'name')
              .map((key, index) => {
                const total = data.engagement.reduce((sum, item) => sum + item[key as keyof typeof item], 0);
                return (
                  <div key={key} className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-2xl font-bold">{total.toLocaleString()}</div>
                  </div>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-0">
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data?.performance || []} // Handle case when data is undefined
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="blog" stroke="#0088FE" name="Blog Posts" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="social" stroke="#00C49F" name="Social Media" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="email" stroke="#FFBB28" name="Email Campaigns" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                Blog Posts
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Social Media
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                Email Campaigns
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-0">
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.distribution || []} // Handle case when data is undefined
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data?.distribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentAnalyzer;
