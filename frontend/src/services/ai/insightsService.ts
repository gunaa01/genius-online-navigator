/**
 * AI Insights Service
 * 
 * This service provides AI-generated insights based on user feedback and platform usage data.
 * It leverages the feedback analysis service and model training service to generate
 * actionable recommendations and identify trends.
 */

import { apiClient } from '@/services/api/apiClient';
import { enhancedApiClient } from '@/services/api/enhancedApiClient';
import { FeedbackItem, FeedbackCategory } from '@/types/feedback';

// Types
export interface InsightTrend {
  id: string;
  name: string;
  description: string;
  confidence: number; // 0-1
  sentiment: number; // -1 to 1
  volume: number;
  change: number; // percentage change
  period: 'day' | 'week' | 'month';
  category: FeedbackCategory;
  keywords: string[];
  feedbackIds: string[]; // Related feedback IDs
}

export interface ActionableInsight {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: {
    userExperience: number; // 0-100
    retention: number; // 0-100
    engagement: number; // 0-100
  };
  effort: {
    development: number; // 0-100
    design: number; // 0-100
    testing: number; // 0-100
  };
  roi: number; // 0-100
  relatedTrends: string[]; // Trend IDs
  suggestedActions: string[];
  status: 'new' | 'in-progress' | 'implemented' | 'dismissed';
}

export interface SentimentAnalysis {
  overall: number; // -1 to 1
  byCategory: Record<FeedbackCategory, number>;
  byFeature: Record<string, number>;
  byTimeframe: {
    daily: Array<{ date: string; sentiment: number; volume: number }>;
    weekly: Array<{ date: string; sentiment: number; volume: number }>;
    monthly: Array<{ date: string; sentiment: number; volume: number }>;
  };
}

export interface KeywordAnalysis {
  topKeywords: Array<{ keyword: string; count: number; sentiment: number }>;
  risingKeywords: Array<{ keyword: string; count: number; change: number }>;
  keywordsByCategory: Record<FeedbackCategory, Array<{ keyword: string; count: number }>>;
}

export interface UserSegmentInsight {
  segmentId: string;
  segmentName: string;
  size: number; // Number of users in segment
  topFeedback: string[];
  sentiment: number;
  uniqueNeeds: string[];
  recommendedActions: string[];
}

export interface InsightsDashboardData {
  trends: InsightTrend[];
  actionableInsights: ActionableInsight[];
  sentimentAnalysis: SentimentAnalysis;
  keywordAnalysis: KeywordAnalysis;
  userSegments: UserSegmentInsight[];
  lastUpdated: string;
}

/**
 * AI Insights Service
 */
class InsightsService {
  /**
   * Get insights dashboard data
   * 
   * @param timeframe The timeframe to analyze
   * @returns Dashboard data
   */
  public async getInsightsDashboard(
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'week'
  ): Promise<InsightsDashboardData> {
    try {
      // Use enhanced API client with caching
      const response = await enhancedApiClient.get<InsightsDashboardData>(
        `/ai/insights/dashboard?timeframe=${timeframe}`,
        {
          cache: {
            enabled: true,
            ttl: 30 * 60 * 1000, // 30 minutes
            staleWhileRevalidate: true
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching insights dashboard:', error);
      // Return mock data if API fails
      return this.getMockInsightsDashboard(timeframe);
    }
  }

  /**
   * Get trending topics from user feedback
   * 
   * @param timeframe The timeframe to analyze
   * @param limit Maximum number of trends to return
   * @returns List of trending topics
   */
  public async getTrendingTopics(
    timeframe: 'day' | 'week' | 'month' = 'week',
    limit: number = 10
  ): Promise<InsightTrend[]> {
    try {
      const response = await apiClient.get<InsightTrend[]>(
        `/ai/insights/trends?timeframe=${timeframe}&limit=${limit}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      // Return mock data if API fails
      return this.getMockTrends(timeframe).slice(0, limit);
    }
  }

  /**
   * Get actionable insights based on feedback analysis
   * 
   * @param priority Filter by priority level
   * @param limit Maximum number of insights to return
   * @returns List of actionable insights
   */
  public async getActionableInsights(
    priority?: 'low' | 'medium' | 'high' | 'critical',
    limit: number = 5
  ): Promise<ActionableInsight[]> {
    try {
      let url = `/ai/insights/actionable?limit=${limit}`;
      if (priority) {
        url += `&priority=${priority}`;
      }
      
      const response = await apiClient.get<ActionableInsight[]>(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching actionable insights:', error);
      // Return mock data if API fails
      return this.getMockActionableInsights()
        .filter(insight => !priority || insight.priority === priority)
        .slice(0, limit);
    }
  }

  /**
   * Get sentiment analysis for user feedback
   * 
   * @param timeframe The timeframe to analyze
   * @returns Sentiment analysis data
   */
  public async getSentimentAnalysis(
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'month'
  ): Promise<SentimentAnalysis> {
    try {
      const response = await apiClient.get<SentimentAnalysis>(
        `/ai/insights/sentiment?timeframe=${timeframe}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
      // Return mock data if API fails
      return this.getMockSentimentAnalysis();
    }
  }

  /**
   * Get keyword analysis from user feedback
   * 
   * @param timeframe The timeframe to analyze
   * @returns Keyword analysis data
   */
  public async getKeywordAnalysis(
    timeframe: 'day' | 'week' | 'month' = 'month'
  ): Promise<KeywordAnalysis> {
    try {
      const response = await apiClient.get<KeywordAnalysis>(
        `/ai/insights/keywords?timeframe=${timeframe}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching keyword analysis:', error);
      // Return mock data if API fails
      return this.getMockKeywordAnalysis();
    }
  }

  /**
   * Get insights for specific user segments
   * 
   * @param segmentIds Optional segment IDs to filter by
   * @returns User segment insights
   */
  public async getUserSegmentInsights(
    segmentIds?: string[]
  ): Promise<UserSegmentInsight[]> {
    try {
      let url = '/ai/insights/user-segments';
      if (segmentIds && segmentIds.length > 0) {
        url += `?segments=${segmentIds.join(',')}`;
      }
      
      const response = await apiClient.get<UserSegmentInsight[]>(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user segment insights:', error);
      // Return mock data if API fails
      return this.getMockUserSegmentInsights();
    }
  }

  /**
   * Generate recommendations based on a specific insight
   * 
   * @param insightId The insight ID
   * @returns List of recommendations
   */
  public async generateRecommendations(
    insightId: string
  ): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        `/ai/insights/${insightId}/recommendations`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Return mock recommendations if API fails
      return [
        'Improve onboarding flow for new users',
        'Add more detailed documentation for advanced features',
        'Create video tutorials for complex workflows',
        'Simplify the user interface for common tasks'
      ];
    }
  }

  /**
   * Update the status of an actionable insight
   * 
   * @param insightId The insight ID
   * @param status The new status
   * @returns Updated insight
   */
  public async updateInsightStatus(
    insightId: string,
    status: 'new' | 'in-progress' | 'implemented' | 'dismissed'
  ): Promise<ActionableInsight> {
    try {
      const response = await apiClient.patch<ActionableInsight>(
        `/ai/insights/${insightId}/status`,
        { status }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating insight status:', error);
      throw error;
    }
  }

  /**
   * Get mock insights dashboard data for development
   * 
   * @param timeframe The timeframe to analyze
   * @returns Mock dashboard data
   */
  private getMockInsightsDashboard(
    timeframe: 'day' | 'week' | 'month' | 'quarter'
  ): InsightsDashboardData {
    return {
      trends: this.getMockTrends(timeframe),
      actionableInsights: this.getMockActionableInsights(),
      sentimentAnalysis: this.getMockSentimentAnalysis(),
      keywordAnalysis: this.getMockKeywordAnalysis(),
      userSegments: this.getMockUserSegmentInsights(),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get mock trends for development
   * 
   * @param timeframe The timeframe to analyze
   * @returns Mock trends
   */
  private getMockTrends(
    timeframe: 'day' | 'week' | 'month'
  ): InsightTrend[] {
    return [
      {
        id: 'trend-1',
        name: 'Navigation Confusion',
        description: 'Users are reporting difficulty finding key features in the navigation menu',
        confidence: 0.87,
        sentiment: -0.42,
        volume: 78,
        change: 15,
        period: timeframe,
        category: 'UX',
        keywords: ['navigation', 'menu', 'find', 'lost', 'confusing'],
        feedbackIds: ['feedback-123', 'feedback-124', 'feedback-125']
      },
      {
        id: 'trend-2',
        name: 'Positive Feedback on New Dashboard',
        description: 'Users are praising the redesigned dashboard layout and improved data visualization',
        confidence: 0.92,
        sentiment: 0.78,
        volume: 64,
        change: 32,
        period: timeframe,
        category: 'Feature',
        keywords: ['dashboard', 'visualization', 'charts', 'redesign', 'improved'],
        feedbackIds: ['feedback-126', 'feedback-127', 'feedback-128']
      },
      {
        id: 'trend-3',
        name: 'Export Functionality Issues',
        description: 'Users are experiencing problems when exporting data to CSV or PDF formats',
        confidence: 0.85,
        sentiment: -0.68,
        volume: 42,
        change: 23,
        period: timeframe,
        category: 'Bug',
        keywords: ['export', 'csv', 'pdf', 'download', 'error'],
        feedbackIds: ['feedback-129', 'feedback-130', 'feedback-131']
      },
      {
        id: 'trend-4',
        name: 'Mobile Responsiveness',
        description: 'Increasing feedback about the application not working well on mobile devices',
        confidence: 0.79,
        sentiment: -0.54,
        volume: 38,
        change: 45,
        period: timeframe,
        category: 'UX',
        keywords: ['mobile', 'responsive', 'phone', 'tablet', 'small screen'],
        feedbackIds: ['feedback-132', 'feedback-133', 'feedback-134']
      },
      {
        id: 'trend-5',
        name: 'AI Recommendations Quality',
        description: 'Users are noting improved quality in AI-generated recommendations',
        confidence: 0.83,
        sentiment: 0.62,
        volume: 35,
        change: 28,
        period: timeframe,
        category: 'Feature',
        keywords: ['ai', 'recommendations', 'suggestions', 'accurate', 'helpful'],
        feedbackIds: ['feedback-135', 'feedback-136', 'feedback-137']
      }
    ];
  }

  /**
   * Get mock actionable insights for development
   * 
   * @returns Mock actionable insights
   */
  private getMockActionableInsights(): ActionableInsight[] {
    return [
      {
        id: 'insight-1',
        title: 'Improve Navigation Menu Discoverability',
        description: 'Users are struggling to find important features in the current navigation structure. Redesigning the menu with clearer categories and improved visual hierarchy would significantly enhance user experience.',
        priority: 'high',
        impact: {
          userExperience: 85,
          retention: 65,
          engagement: 70
        },
        effort: {
          development: 40,
          design: 60,
          testing: 30
        },
        roi: 78,
        relatedTrends: ['trend-1'],
        suggestedActions: [
          'Conduct user testing with different navigation layouts',
          'Implement a more intuitive categorization of features',
          'Add search functionality to the navigation menu',
          'Create guided tours for new users'
        ],
        status: 'new'
      },
      {
        id: 'insight-2',
        title: 'Fix Export Functionality Issues',
        description: 'Multiple users are reporting errors when attempting to export data to CSV or PDF formats. This is causing frustration and reducing productivity.',
        priority: 'critical',
        impact: {
          userExperience: 90,
          retention: 75,
          engagement: 60
        },
        effort: {
          development: 50,
          design: 10,
          testing: 40
        },
        roi: 85,
        relatedTrends: ['trend-3'],
        suggestedActions: [
          'Debug export functionality across different browsers',
          'Implement better error handling and user feedback',
          'Add progress indicators for large exports',
          'Create automated tests for export functionality'
        ],
        status: 'in-progress'
      },
      {
        id: 'insight-3',
        title: 'Optimize Mobile Experience',
        description: 'With increasing mobile usage, improving the responsive design would capture a growing segment of users who prefer accessing the platform on their phones or tablets.',
        priority: 'medium',
        impact: {
          userExperience: 75,
          retention: 60,
          engagement: 80
        },
        effort: {
          development: 70,
          design: 65,
          testing: 55
        },
        roi: 65,
        relatedTrends: ['trend-4'],
        suggestedActions: [
          'Implement a mobile-first redesign of key screens',
          'Optimize touch interactions for small screens',
          'Simplify complex workflows for mobile users',
          'Add offline capabilities for mobile users'
        ],
        status: 'new'
      },
      {
        id: 'insight-4',
        title: 'Expand AI Recommendation Features',
        description: 'Users are responding positively to AI recommendations. Expanding these capabilities could further differentiate the platform and increase user engagement.',
        priority: 'medium',
        impact: {
          userExperience: 70,
          retention: 75,
          engagement: 85
        },
        effort: {
          development: 80,
          design: 40,
          testing: 60
        },
        roi: 72,
        relatedTrends: ['trend-5'],
        suggestedActions: [
          'Integrate more data sources for better recommendations',
          'Add personalization options for AI suggestions',
          'Create feedback mechanisms for improving AI accuracy',
          'Develop explanations for AI recommendations'
        ],
        status: 'new'
      },
      {
        id: 'insight-5',
        title: 'Enhance Data Visualization Options',
        description: 'Building on positive feedback about the dashboard, adding more visualization types and customization options would further improve user satisfaction.',
        priority: 'low',
        impact: {
          userExperience: 60,
          retention: 50,
          engagement: 70
        },
        effort: {
          development: 65,
          design: 70,
          testing: 45
        },
        roi: 55,
        relatedTrends: ['trend-2'],
        suggestedActions: [
          'Add new chart types (sankey, heatmaps, etc.)',
          'Implement customizable dashboards for different user roles',
          'Create templates for common visualization needs',
          'Add export options for visualizations'
        ],
        status: 'new'
      }
    ];
  }

  /**
   * Get mock sentiment analysis for development
   * 
   * @returns Mock sentiment analysis
   */
  private getMockSentimentAnalysis(): SentimentAnalysis {
    return {
      overall: 0.12, // Slightly positive
      byCategory: {
        'Bug': -0.65,
        'Feature': 0.72,
        'UX': -0.18,
        'Performance': -0.42,
        'Other': 0.05
      },
      byFeature: {
        'Dashboard': 0.68,
        'Reports': 0.45,
        'User Management': 0.22,
        'Data Export': -0.58,
        'Mobile App': -0.35,
        'Navigation': -0.42,
        'Search': 0.15,
        'AI Recommendations': 0.62
      },
      byTimeframe: {
        daily: [
          { date: '2025-04-15', sentiment: 0.05, volume: 42 },
          { date: '2025-04-16', sentiment: 0.08, volume: 38 },
          { date: '2025-04-17', sentiment: 0.12, volume: 45 },
          { date: '2025-04-18', sentiment: 0.15, volume: 52 },
          { date: '2025-04-19', sentiment: 0.10, volume: 48 },
          { date: '2025-04-20', sentiment: 0.18, volume: 56 },
          { date: '2025-04-21', sentiment: 0.22, volume: 62 }
        ],
        weekly: [
          { date: '2025-W15', sentiment: -0.05, volume: 245 },
          { date: '2025-W16', sentiment: 0.02, volume: 278 },
          { date: '2025-W17', sentiment: 0.08, volume: 312 },
          { date: '2025-W18', sentiment: 0.12, volume: 301 }
        ],
        monthly: [
          { date: '2025-01', sentiment: -0.15, volume: 1050 },
          { date: '2025-02', sentiment: -0.08, volume: 1120 },
          { date: '2025-03', sentiment: 0.05, volume: 1230 },
          { date: '2025-04', sentiment: 0.12, volume: 1180 }
        ]
      }
    };
  }

  /**
   * Get mock keyword analysis for development
   * 
   * @returns Mock keyword analysis
   */
  private getMockKeywordAnalysis(): KeywordAnalysis {
    return {
      topKeywords: [
        { keyword: 'dashboard', count: 145, sentiment: 0.68 },
        { keyword: 'export', count: 132, sentiment: -0.58 },
        { keyword: 'mobile', count: 118, sentiment: -0.35 },
        { keyword: 'navigation', count: 105, sentiment: -0.42 },
        { keyword: 'recommendations', count: 98, sentiment: 0.62 },
        { keyword: 'reports', count: 87, sentiment: 0.45 },
        { keyword: 'slow', count: 76, sentiment: -0.72 },
        { keyword: 'intuitive', count: 68, sentiment: 0.78 },
        { keyword: 'error', count: 65, sentiment: -0.85 },
        { keyword: 'visualization', count: 62, sentiment: 0.65 }
      ],
      risingKeywords: [
        { keyword: 'mobile', count: 118, change: 45 },
        { keyword: 'export', count: 132, change: 32 },
        { keyword: 'recommendations', count: 98, change: 28 },
        { keyword: 'error', count: 65, change: 25 },
        { keyword: 'navigation', count: 105, change: 18 }
      ],
      keywordsByCategory: {
        'Bug': [
          { keyword: 'error', count: 65 },
          { keyword: 'crash', count: 42 },
          { keyword: 'broken', count: 38 },
          { keyword: 'fail', count: 35 },
          { keyword: 'issue', count: 32 }
        ],
        'Feature': [
          { keyword: 'dashboard', count: 145 },
          { keyword: 'recommendations', count: 98 },
          { keyword: 'reports', count: 87 },
          { keyword: 'visualization', count: 62 },
          { keyword: 'filter', count: 58 }
        ],
        'UX': [
          { keyword: 'navigation', count: 105 },
          { keyword: 'intuitive', count: 68 },
          { keyword: 'confusing', count: 52 },
          { keyword: 'layout', count: 48 },
          { keyword: 'design', count: 45 }
        ],
        'Performance': [
          { keyword: 'slow', count: 76 },
          { keyword: 'fast', count: 42 },
          { keyword: 'loading', count: 38 },
          { keyword: 'responsive', count: 35 },
          { keyword: 'lag', count: 32 }
        ],
        'Other': [
          { keyword: 'helpful', count: 48 },
          { keyword: 'support', count: 42 },
          { keyword: 'documentation', count: 38 },
          { keyword: 'tutorial', count: 35 },
          { keyword: 'pricing', count: 28 }
        ]
      }
    };
  }

  /**
   * Get mock user segment insights for development
   * 
   * @returns Mock user segment insights
   */
  private getMockUserSegmentInsights(): UserSegmentInsight[] {
    return [
      {
        segmentId: 'segment-1',
        segmentName: 'Enterprise Users',
        size: 450,
        topFeedback: [
          'Need better team collaboration features',
          'Export functionality is critical for our workflow',
          'Would like more advanced security options',
          'Dashboard customization is very useful'
        ],
        sentiment: 0.25,
        uniqueNeeds: [
          'Advanced permission management',
          'Bulk data operations',
          'Custom reporting',
          'SSO integration'
        ],
        recommendedActions: [
          'Enhance export functionality with more formats',
          'Implement team workspace features',
          'Add enterprise-grade security options',
          'Create advanced dashboard customization'
        ]
      },
      {
        segmentId: 'segment-2',
        segmentName: 'Small Business Users',
        size: 1250,
        topFeedback: [
          'Pricing is a concern for our budget',
          'Need simpler workflows for non-technical users',
          'Mobile access is increasingly important',
          'Love the AI recommendations feature'
        ],
        sentiment: 0.18,
        uniqueNeeds: [
          'Cost-effective solutions',
          'Simplified workflows',
          'Quick setup and onboarding',
          'Basic reporting'
        ],
        recommendedActions: [
          'Create tiered pricing options',
          'Simplify core workflows',
          'Improve mobile experience',
          'Enhance guided setup process'
        ]
      },
      {
        segmentId: 'segment-3',
        segmentName: 'New Users (< 30 days)',
        size: 820,
        topFeedback: [
          'Onboarding process could be clearer',
          'Having trouble finding certain features',
          'Need more tutorials and examples',
          'Not sure how to interpret some of the data'
        ],
        sentiment: -0.15,
        uniqueNeeds: [
          'Better onboarding',
          'Clear navigation',
          'Educational content',
          'Simplified interface'
        ],
        recommendedActions: [
          'Revamp onboarding experience',
          'Create interactive tutorials',
          'Implement a help beacon for new users',
          'Simplify initial dashboard view'
        ]
      },
      {
        segmentId: 'segment-4',
        segmentName: 'Power Users',
        size: 580,
        topFeedback: [
          'Need more advanced filtering options',
          'Would like keyboard shortcuts',
          'API access would be valuable',
          'Performance could be better with large datasets'
        ],
        sentiment: 0.05,
        uniqueNeeds: [
          'Advanced features',
          'Customization options',
          'API access',
          'Performance optimization'
        ],
        recommendedActions: [
          'Implement advanced filtering and search',
          'Add keyboard shortcuts for common actions',
          'Create developer API documentation',
          'Optimize performance for large datasets'
        ]
      }
    ];
  }
}

/**
 * Get the complete insights dashboard data
 * @param timeframe Timeframe for the insights (e.g., '7d', '30d', '90d')
 * @returns Dashboard data including all insight sections
 */
export async function getInsightsDashboard(timeframe: string): Promise<InsightsDashboardData> {
  try {
    const response = await enhancedApiClient.get('/ai/insights/dashboard', {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching insights dashboard:', error);
    throw error;
  }
}

// Create and export a singleton instance
export const insightsService = new InsightsService();

// Export the class for testing or custom instances
export default InsightsService;
