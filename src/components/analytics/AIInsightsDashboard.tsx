import React, { useState, useEffect } from 'react';
import { insightsService, InsightsDashboardData } from '@/services/ai/insightsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Download, Filter } from 'lucide-react';
import TrendingTopicsSection from './insights/TrendingTopicsSection';
import ActionableInsightsSection from './insights/ActionableInsightsSection';
import SentimentAnalysisSection from './insights/SentimentAnalysisSection';
import KeywordAnalysisSection from './insights/KeywordAnalysisSection';
import UserSegmentSection from './insights/UserSegmentSection';
import * as insightsService from '@/services/ai/insightsService';
import { usePerformanceMonitoring } from '@/utils/performance';

/**
 * AI Insights Dashboard Component
 * 
 * Displays AI-generated insights based on user feedback and platform usage data
 */
const AIInsightsDashboard: React.FC = () => {
  // State
  const [dashboardData, setDashboardData] = useState<InsightsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [activeTab, setActiveTab] = useState<string>('trends');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Initialize performance monitoring
  const performance = usePerformanceMonitoring('AIInsightsDashboard');

  // Load dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    const metricId = performance.trackAction('fetchDashboardData');
    setIsLoading(true);
    setError(null);

    try {
      const data = await insightsService.getInsightsDashboard(timeframe);
      setDashboardData(data);
      setLastUpdated(new Date().toLocaleString());
      performance.endTracking(metricId, true);
    } catch (err) {
      setError('Failed to load insights dashboard. Please try again later.');
      console.error('Error loading insights dashboard:', err);
      performance.endTracking(metricId, false, err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    const metricId = performance.trackAction('timeframeChange');
    setTimeframe(value as 'day' | 'week' | 'month' | 'quarter');
    performance.endTracking(metricId);
  };

  // Handle refresh
  const handleRefresh = () => {
    const metricId = performance.trackAction('refresh');
    fetchDashboardData();
    performance.endTracking(metricId);
  };

  // Handle export
  const handleExport = () => {
    if (!dashboardData) return;

    // Create export data
    const exportData = {
      generatedAt: new Date().toISOString(),
      timeframe,
      data: dashboardData
    };

    // Convert to JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-insights-${timeframe}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    const metricId = performance.trackAction('tabChange');
    setActiveTab(value);
    performance.endTracking(metricId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights Dashboard</h1>
          <p className="text-gray-500 mt-1">
            AI-powered analysis of user feedback and platform usage
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>

          <Button variant="outline" onClick={handleExport} disabled={isLoading || !dashboardData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && !dashboardData ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading insights...</span>
        </div>
      ) : (
        dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overall Sentiment</CardTitle>
                  <CardDescription>User feedback sentiment score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-24">
                    <SentimentIndicator 
                      value={dashboardData.sentimentAnalysis.overall} 
                      size="large" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Trending Topic</CardTitle>
                  <CardDescription>Highest volume feedback topic</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.trends.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">{dashboardData.trends[0].name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {dashboardData.trends[0].description}
                      </p>
                      <div className="flex items-center text-sm">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          dashboardData.trends[0].sentiment > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-gray-600">
                          {dashboardData.trends[0].volume} mentions
                        </span>
                        <span className="mx-2">•</span>
                        <span className={`${
                          dashboardData.trends[0].change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {dashboardData.trends[0].change > 0 ? '+' : ''}
                          {dashboardData.trends[0].change}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Critical Actions</CardTitle>
                  <CardDescription>High priority recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dashboardData.actionableInsights
                      .filter(insight => insight.priority === 'critical')
                      .slice(0, 1)
                      .map(insight => (
                        <div key={insight.id} className="space-y-1">
                          <h3 className="font-medium">{insight.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {insight.description}
                          </p>
                          <div className="flex items-center text-sm">
                            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                              Critical Priority
                            </span>
                            <span className="ml-2 text-gray-600">
                              ROI: {insight.roi}%
                            </span>
                          </div>
                        </div>
                      ))}
                    {dashboardData.actionableInsights.filter(insight => insight.priority === 'critical').length === 0 && (
                      <p className="text-sm text-gray-500">No critical actions at this time</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="trends" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="trends">Trending Topics</TabsTrigger>
                <TabsTrigger value="actionable">Actionable Insights</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
                <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
                <TabsTrigger value="segments">User Segments</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <TrendingTopicsSection trends={dashboardData.trends} />
              </TabsContent>

              <TabsContent value="actionable" className="space-y-4">
                <ActionableInsightsSection insights={dashboardData.actionableInsights} />
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-4">
                <SentimentAnalysisSection sentimentData={dashboardData.sentimentAnalysis} timeframe={timeframe} />
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <KeywordAnalysisSection keywordData={dashboardData.keywordAnalysis} />
              </TabsContent>

              <TabsContent value="segments" className="space-y-4">
                <UserSegmentSection segments={dashboardData.userSegments} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-right text-sm text-gray-500">
              Last updated: {lastUpdated}
            </div>
          </>
        )
      )}
    </div>
  );
};

// Sentiment indicator component
interface SentimentIndicatorProps {
  value: number; // -1 to 1
  size?: 'small' | 'medium' | 'large';
}

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ value, size = 'medium' }) => {
  // Normalize value to 0-100 scale
  const normalizedValue = Math.round((value + 1) * 50);
  
  // Determine color based on sentiment
  const getColor = () => {
    if (value < -0.5) return 'text-red-600';
    if (value < -0.2) return 'text-orange-500';
    if (value < 0.2) return 'text-yellow-500';
    if (value < 0.5) return 'text-green-500';
    return 'text-green-600';
  };

  // Determine size
  const getSize = () => {
    switch (size) {
      case 'small': return 'text-2xl';
      case 'large': return 'text-5xl';
      default: return 'text-3xl';
    }
  };

  // Determine label
  const getLabel = () => {
    if (value < -0.5) return 'Very Negative';
    if (value < -0.2) return 'Negative';
    if (value < 0.2) return 'Neutral';
    if (value < 0.5) return 'Positive';
    return 'Very Positive';
  };

  return (
    <div className="flex flex-col items-center">
      <span className={`font-bold ${getSize()} ${getColor()}`}>
        {normalizedValue}
      </span>
      <span className={`text-sm ${getColor()} mt-1`}>{getLabel()}</span>
    </div>
  );
};

export default AIInsightsDashboard;
