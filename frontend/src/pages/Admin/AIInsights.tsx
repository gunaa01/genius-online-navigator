import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/layouts/AdminLayout';
import AIInsightsDashboard from '@/components/analytics/AIInsightsDashboard';
import { Button } from '@/components/ui/button';
import { Download, Share, FileText } from 'lucide-react';
import FeedbackWidget from '@/components/common/FeedbackWidget';
import ExportDialog from '@/components/analytics/insights/ExportDialog';
import SmartRecommendationsWidget from '@/components/analytics/insights/SmartRecommendationsWidget';
import * as insightsService from '@/services/ai/insightsService';
import * as recommendationsService from '@/services/ai/recommendationsService';
import { toast } from '@/components/ui/use-toast';

/**
 * AI Insights Admin Page
 * 
 * This page displays the AI Insights Dashboard within the admin layout
 */
const AIInsights: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);

  // Fetch dashboard data for export functionality
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await insightsService.getInsightsDashboard('30d');
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch smart recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsRecommendationsLoading(true);
        // In a production environment, this would call the API
        // For now, we'll use mock data
        const data = recommendationsService.getMockRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Handle implementing a recommendation
  const handleImplementRecommendation = async (id: string) => {
    try {
      // In a production environment, this would call the API
      // For now, we'll just update the local state
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === id ? { ...rec, implemented: true } : rec
        )
      );
      
      toast({
        title: "Recommendation implemented",
        description: "The recommendation has been marked as implemented.",
        variant: "default",
      });
      
      // In production:
      // await recommendationsService.implementRecommendation(id);
    } catch (error) {
      console.error('Error implementing recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to implement recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Prepare export columns for different sections
  const trendingTopicsColumns = [
    { header: 'Topic', dataKey: 'name' },
    { header: 'Description', dataKey: 'description' },
    { header: 'Sentiment', dataKey: 'sentiment' },
    { header: 'Volume', dataKey: 'volume' },
    { header: 'Category', dataKey: 'category' }
  ];

  const actionableInsightsColumns = [
    { header: 'Title', dataKey: 'title' },
    { header: 'Description', dataKey: 'description' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Priority', dataKey: 'priority' },
    { header: 'Impact', dataKey: 'impact' },
    { header: 'Recommended Action', dataKey: 'recommendedAction' }
  ];

  const userSegmentsColumns = [
    { header: 'Segment', dataKey: 'segmentName' },
    { header: 'Size', dataKey: 'size' },
    { header: 'Percentage', dataKey: 'percentage' },
    { header: 'Sentiment', dataKey: 'sentiment' },
    { header: 'Growth', dataKey: 'growth' }
  ];

  // Handle full report export
  const handleExportFullReport = () => {
    // This would typically generate a comprehensive PDF report
    // For now, we'll just log that this feature is coming soon
    console.log('Exporting full AI insights report - feature coming soon');
    toast({
      title: "Export initiated",
      description: "Your full report is being generated and will download shortly.",
      variant: "default",
    });
  };

  // Handle share insights
  const handleShareInsights = () => {
    // Implementation would open a sharing dialog
    console.log('Opening share dialog');
    toast({
      title: "Share options",
      description: "Sharing options will be available soon.",
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Insights | Genius Online Navigator</title>
        <meta name="description" content="AI-powered insights and analytics dashboard" />
      </Helmet>

      <AdminLayout
        title="AI Insights"
        description="AI-powered analysis of user feedback and platform usage"
        actions={
          <div className="flex space-x-2">
            {!isLoading && dashboardData && (
              <>
                <ExportDialog
                  data={dashboardData.trendingTopics || []}
                  columns={trendingTopicsColumns}
                  defaultFilename="trending_topics"
                  title="Export Trending Topics"
                  description="Export trending topics data in your preferred format"
                  trigger={
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Topics
                    </Button>
                  }
                />
                <ExportDialog
                  data={dashboardData.actionableInsights || []}
                  columns={actionableInsightsColumns}
                  defaultFilename="actionable_insights"
                  title="Export Actionable Insights"
                  description="Export actionable insights data in your preferred format"
                  trigger={
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Insights
                    </Button>
                  }
                />
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleExportFullReport}>
              <FileText className="h-4 w-4 mr-2" />
              Full Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareInsights}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        }
      >
        <div className="space-y-8">
          {!isRecommendationsLoading && recommendations.length > 0 && (
            <SmartRecommendationsWidget 
              recommendations={recommendations} 
              onImplement={handleImplementRecommendation} 
            />
          )}
          
          <AIInsightsDashboard />
          
          <div className="mt-8">
            <FeedbackWidget feedbackContext="AI Insights Dashboard" />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AIInsights;
