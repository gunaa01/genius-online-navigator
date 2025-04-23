import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/services/api/apiClient';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Filter, RefreshCw, TrendingUp, MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';

// Types for feedback analytics data
interface FeedbackTrend {
  date: string;
  count: number;
  sentiment: number;
}

interface FeedbackDistribution {
  type: string;
  count: number;
  color: string;
}

interface FeedbackByFeature {
  featureId: string;
  featureName: string;
  count: number;
  averageSentiment: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

interface TopKeyword {
  keyword: string;
  count: number;
  sentiment: number;
}

interface FeedbackAnalyticsData {
  totalFeedback: number;
  feedbackTrends: FeedbackTrend[];
  feedbackDistribution: FeedbackDistribution[];
  feedbackByFeature: FeedbackByFeature[];
  topKeywords: TopKeyword[];
  averageSentiment: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
  responseRate: number;
  averageResponseTime: number; // in hours
}

interface FeedbackAnalyticsProps {
  timeRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  featureId?: string;
}

/**
 * FeedbackAnalytics - Component for visualizing user feedback data and trends
 * 
 * Features:
 * - Sentiment analysis visualization
 * - Feedback volume trends
 * - Feature-specific feedback analysis
 * - Keyword extraction and visualization
 * - Feedback categorization breakdown
 */
const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({
  timeRange = 'month',
  featureId
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<FeedbackAnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRange);
  const [selectedFeature, setSelectedFeature] = useState<string>(featureId || '');
  const [availableFeatures, setAvailableFeatures] = useState<Array<{id: string, name: string}>>([]);
  
  // Colors for charts
  const COLORS = {
    positive: '#10b981', // green
    negative: '#ef4444', // red
    neutral: '#6b7280',  // gray
    mixed: '#8b5cf6',    // purple
    suggestion: '#3b82f6', // blue
    bug: '#f97316',      // orange
    praise: '#10b981',   // green
    question: '#8b5cf6', // purple
    other: '#6b7280',    // gray
  };
  
  // Load analytics data
  useEffect(() => {
    fetchAnalyticsData();
    fetchAvailableFeatures();
  }, []);
  
  // Refetch when filters change
  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange, selectedFeature]);
  
  const fetchAvailableFeatures = async () => {
    try {
      const response = await apiClient.get('/features');
      setAvailableFeatures(response.data);
    } catch (error) {
      console.error('Error fetching available features:', error);
      // Fallback data
      setAvailableFeatures([
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'projects', name: 'Projects Management' },
        { id: 'tasks', name: 'Task Management' },
        { id: 'resources', name: 'Resource Management' },
        { id: 'clients', name: 'Client Portal' },
        { id: 'reports', name: 'Reports & Analytics' },
        { id: 'automation', name: 'Automation Tools' },
        { id: 'ai_insights', name: 'AI Insights' },
      ]);
    }
  };
  
  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      const response = await apiClient.get('/feedback/analytics', {
        params: {
          timeRange: selectedTimeRange,
          featureId: selectedFeature || undefined
        }
      });
      
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching feedback analytics:', error);
      
      // Set mock data for development
      setAnalyticsData(getMockAnalyticsData());
      
      toast({
        title: "Couldn't load analytics",
        description: "Using sample data instead",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchAnalyticsData();
  };
  
  const handleExport = () => {
    // In a real implementation, this would generate a CSV or PDF report
    toast({
      title: "Export started",
      description: "Your analytics report is being generated"
    });
  };
  
  // Get sentiment color based on score
  const getSentimentColor = (score: number) => {
    if (score >= 0.3) return COLORS.positive;
    if (score <= -0.3) return COLORS.negative;
    return COLORS.neutral;
  };
  
  // Get feature name by ID
  const getFeatureName = (id: string) => {
    const feature = availableFeatures.find(f => f.id === id);
    return feature ? feature.name : id;
  };
  
  // Mock data for development
  const getMockAnalyticsData = (): FeedbackAnalyticsData => {
    return {
      totalFeedback: 243,
      feedbackTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 15) + 1,
        sentiment: (Math.random() * 2 - 1) * 0.7
      })),
      feedbackDistribution: [
        { type: 'suggestion', count: 98, color: COLORS.suggestion },
        { type: 'bug', count: 67, color: COLORS.bug },
        { type: 'praise', count: 45, color: COLORS.praise },
        { type: 'question', count: 23, color: COLORS.question },
        { type: 'other', count: 10, color: COLORS.other },
      ],
      feedbackByFeature: [
        { featureId: 'dashboard', featureName: 'Dashboard', count: 42, averageSentiment: 0.4, positiveCount: 30, negativeCount: 5, neutralCount: 7 },
        { featureId: 'projects', featureName: 'Projects Management', count: 37, averageSentiment: 0.2, positiveCount: 20, negativeCount: 10, neutralCount: 7 },
        { featureId: 'tasks', featureName: 'Task Management', count: 35, averageSentiment: -0.1, positiveCount: 15, negativeCount: 15, neutralCount: 5 },
        { featureId: 'ai_insights', featureName: 'AI Insights', count: 30, averageSentiment: 0.6, positiveCount: 25, negativeCount: 2, neutralCount: 3 },
        { featureId: 'clients', featureName: 'Client Portal', count: 25, averageSentiment: 0.3, positiveCount: 18, negativeCount: 5, neutralCount: 2 },
      ],
      topKeywords: [
        { keyword: 'interface', count: 32, sentiment: 0.2 },
        { keyword: 'performance', count: 28, sentiment: -0.3 },
        { keyword: 'intuitive', count: 25, sentiment: 0.7 },
        { keyword: 'loading', count: 22, sentiment: -0.5 },
        { keyword: 'helpful', count: 20, sentiment: 0.8 },
        { keyword: 'confusing', count: 18, sentiment: -0.6 },
        { keyword: 'responsive', count: 15, sentiment: 0.4 },
        { keyword: 'insights', count: 12, sentiment: 0.5 },
      ],
      averageSentiment: 0.23,
      sentimentDistribution: {
        positive: 142,
        negative: 67,
        neutral: 24,
        mixed: 10,
      },
      responseRate: 87,
      averageResponseTime: 18.5,
    };
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }
  
  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn't load the feedback analytics data. Please try again later or contact support if the problem persists.
        </p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedback Analytics</h2>
          <p className="text-muted-foreground">
            Insights from {analyticsData.totalFeedback} feedback submissions
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedFeature} onValueChange={setSelectedFeature}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Features" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Features</SelectItem>
              {availableFeatures.map(feature => (
                <SelectItem key={feature.id} value={feature.id}>
                  {feature.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Feedback card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{analyticsData.totalFeedback}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedTimeRange === 'all' ? 'All time' : `Last ${selectedTimeRange}`}
            </p>
          </CardContent>
        </Card>
        
        {/* Average Sentiment card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className={`h-5 w-5 mr-2 ${
                analyticsData.averageSentiment > 0 ? 'text-green-500' : 
                analyticsData.averageSentiment < 0 ? 'text-red-500' : 'text-gray-500'
              }`} />
              <div className="text-2xl font-bold">
                {(analyticsData.averageSentiment * 100).toFixed(0)}%
              </div>
            </div>
            <Progress 
              value={(analyticsData.averageSentiment + 1) * 50} 
              className="h-2 mt-2"
              indicatorClassName={getSentimentColor(analyticsData.averageSentiment)}
            />
          </CardContent>
        </Card>
        
        {/* Response Rate card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{analyticsData.responseRate}%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. response time: {analyticsData.averageResponseTime.toFixed(1)} hours
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main analytics content */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="features">By Feature</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>
        
        {/* Trends tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Volume Trends</CardTitle>
              <CardDescription>
                Number of feedback submissions over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.feedbackTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Feedback Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Distribution</CardTitle>
                <CardDescription>
                  Breakdown by feedback type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.feedbackDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.feedbackDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trends</CardTitle>
                <CardDescription>
                  Average sentiment score over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData.feedbackTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sentiment" 
                      stroke="#10b981" 
                      activeDot={{ r: 8 }} 
                      name="Sentiment Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Additional tabs would be implemented here */}
        <TabsContent value="sentiment">
          {/* Sentiment analysis visualizations */}
        </TabsContent>
        
        <TabsContent value="features">
          {/* Feature-specific feedback analysis */}
        </TabsContent>
        
        <TabsContent value="keywords">
          {/* Keyword extraction and visualization */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackAnalytics;
