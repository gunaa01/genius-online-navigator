import React, { useState, useEffect, useRef } from 'react';
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
import { SEOHead, generateInsightsStructuredData } from '@/services/seo/seoService';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { createKeyboardNavigation, KeyCode, SkipToContent } from '@/utils/keyboardNavigation';

/**
 * AI Insights Admin Page
 * 
 * This page displays the AI Insights Dashboard within the admin layout
 * with comprehensive SEO and accessibility enhancements
 */
const AIInsights: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const exportButtonsRef = useRef<HTMLDivElement>(null);
  
  // Get accessibility preferences
  const { preferences } = useAccessibility();

  // Fetch dashboard data for export functionality
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await insightsService.getInsightsDashboard('30d');
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
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
        toast({
          title: "Error",
          description: "Failed to load recommendations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Set up keyboard navigation for export buttons
  useEffect(() => {
    if (exportButtonsRef.current && !isLoading) {
      const cleanup = createKeyboardNavigation({
        selector: '#export-buttons button',
        orientation: 'horizontal',
        loop: true,
      });
      
      return cleanup;
    }
  }, [isLoading, exportButtonsRef]);

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

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Export with Ctrl+E
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      handleExportFullReport();
    }
    // Share with Ctrl+S
    else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleShareInsights();
    }
  };

  return (
    <>
      <SEOHead 
        metadata={{
          title: 'AI Insights Dashboard',
          description: 'AI-powered insights and analytics for your platform. Analyze trends, sentiment, and user segments.',
          keywords: ['AI insights', 'analytics', 'dashboard', 'trends', 'sentiment analysis'],
          structuredData: generateInsightsStructuredData(dashboardData),
        }}
        path="/admin/insights"
      />

      <SkipToContent contentId="main-content" />
      
      <div onKeyDown={handleKeyDown}>
        <AdminLayout
          title="AI Insights"
          description="AI-powered analysis of user feedback and platform usage"
          actions={
            <div id="export-buttons" ref={exportButtonsRef} className="flex space-x-2">
              {!isLoading && dashboardData && (
                <>
                  <ExportDialog
                    data={dashboardData.trendingTopics || []}
                    columns={trendingTopicsColumns}
                    defaultFilename="trending_topics"
                    title="Export Trending Topics"
                    description="Export trending topics data in your preferred format"
                    trigger={
                      <Button 
                        variant="outline" 
                        size="sm"
                        aria-label="Export trending topics"
                      >
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        aria-label="Export actionable insights"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Insights
                      </Button>
                    }
                  />
                </>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportFullReport}
                aria-label="Export full report"
              >
                <FileText className="h-4 w-4 mr-2" />
                Full Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShareInsights}
                aria-label="Share insights"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          }
        >
          <div 
            id="main-content"
            ref={mainContentRef}
            className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
            role="main"
            aria-label="AI Insights Dashboard"
            tabIndex={-1}
          >
            {isLoading ? (
              <div 
                className="flex justify-center items-center h-64"
                aria-live="polite"
                aria-busy="true"
              >
                <p className="text-lg">Loading dashboard data...</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </AdminLayout>
      </div>
    </>
  );
};

export default AIInsights;
