import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AIInsightsDashboard from '@/components/analytics/AIInsightsDashboard';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Download, Share, FileText } from 'lucide-react';
import FeedbackWidget from '@/components/common/FeedbackWidget';
import ExportDialog from '@/components/analytics/insights/ExportDialog';
import SmartRecommendationsWidget from '@/components/analytics/insights/SmartRecommendationsWidget';
import * as insightsService from '@/services/ai/insightsService';
import * as recommendationsService from '@/services/ai/recommendationsService';
import { toast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { generateInsightsStructuredData } from '@/services/seo/seoService';

/**
 * AI Insights Dashboard Page with SSR
 * 
 * Server-side rendered for improved SEO and performance
 * Follows our global rules for accessibility and performance standards
 */
export default function InsightsPage({ initialData, recommendations }: {
  initialData: any;
  recommendations: any[];
}) {
  const router = useRouter();
  const { preferences } = useAccessibility();
  
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

  // Handle implementing a recommendation
  const handleImplementRecommendation = async (id: string) => {
    try {
      // In a production environment, this would call the API
      // For now, we'll just update the local state and navigate to refresh
      await recommendationsService.implementRecommendation(id);
      
      toast({
        title: "Recommendation implemented",
        description: "The recommendation has been marked as implemented.",
        variant: "default",
      });
      
      // Refresh the page to get updated data
      router.push(router.asPath);
    } catch (error) {
      console.error('Error implementing recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to implement recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle full report export
  const handleExportFullReport = () => {
    toast({
      title: "Export initiated",
      description: "Your full report is being generated and will download shortly.",
      variant: "default",
    });
  };

  // Handle share insights
  const handleShareInsights = () => {
    toast({
      title: "Share options",
      description: "Sharing options will be available soon.",
      variant: "default",
    });
  };

  // Generate structured data for SEO
  const structuredData = generateInsightsStructuredData(initialData);

  return (
    <>
      <Head>
        <title>AI Insights Dashboard | Genius Online Navigator</title>
        <meta name="description" content="AI-powered insights and analytics for your platform. Analyze trends, sentiment, and user segments." />
        <meta name="keywords" content="AI insights, analytics, dashboard, trends, sentiment analysis" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Insights Dashboard | Genius Online Navigator" />
        <meta property="og:description" content="AI-powered insights and analytics for your platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/insights`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Insights Dashboard | Genius Online Navigator" />
        <meta name="twitter:description" content="AI-powered insights and analytics for your platform." />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <AdminLayout
        title="AI Insights"
        description="AI-powered analysis of user feedback and platform usage"
        actions={
          <div id="export-buttons" className="flex space-x-2">
            {initialData && (
              <>
                <ExportDialog
                  data={initialData.trendingTopics || []}
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
                  data={initialData.actionableInsights || []}
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
          className={`space-y-8 ${preferences.largeText ? 'text-lg' : ''}`}
          role="main"
          aria-label="AI Insights Dashboard"
          tabIndex={-1}
        >
          {recommendations.length > 0 && (
            <SmartRecommendationsWidget 
              recommendations={recommendations} 
              onImplement={handleImplementRecommendation} 
            />
          )}
          
          <AIInsightsDashboard initialData={initialData} />
          
          <div className="mt-8">
            <FeedbackWidget feedbackContext="AI Insights Dashboard" />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

/**
 * Server-side data fetching for improved performance and SEO
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Get timeframe from query params or use default
    const timeframe = (context.query.timeframe as string) || '30d';
    
    // Fetch data on the server
    const initialData = await insightsService.getInsightsDashboard(timeframe);
    const recommendations = recommendationsService.getMockRecommendations();
    
    return {
      props: {
        initialData,
        recommendations,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data on error
    return {
      props: {
        initialData: null,
        recommendations: [],
      },
    };
  }
};
