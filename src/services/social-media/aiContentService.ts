import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

/**
 * Content Suggestion
 */
export interface ContentSuggestion {
  id: string;
  content: string;
  type: 'title' | 'body' | 'hashtags';
  platform: string;
  confidenceScore: number;
}

/**
 * Content Analysis Result
 */
export interface ContentAnalysisResult {
  score: number;
  readability: {
    score: number;
    level: 'elementary' | 'intermediate' | 'college' | 'professional';
    suggestions: string[];
  };
  sentiment: {
    score: number;
    type: 'positive' | 'neutral' | 'negative';
    suggestions: string[];
  };
  engagement: {
    score: number;
    suggestions: string[];
  };
  seo: {
    score: number;
    suggestions: string[];
  };
  grammar: {
    score: number;
    issues: {
      text: string;
      suggestion: string;
      type: 'grammar' | 'spelling' | 'punctuation';
    }[];
  };
}

/**
 * Content Optimization Suggestion
 */
export interface ContentOptimizationSuggestion {
  id: string;
  original: string;
  optimized: string;
  improvementAreas: string[];
  confidenceScore: number;
}

/**
 * Hashtag Suggestion
 */
export interface HashtagSuggestion {
  tag: string;
  popularity: number;
  relevance: number;
  recentTrend: 'rising' | 'stable' | 'falling';
}

/**
 * Get content suggestions based on topic and platform
 * @param topic Topic for content
 * @param platform Target platform
 * @param type Type of content
 * @returns List of content suggestions
 */
export const getContentSuggestions = async (
  topic: string,
  platform?: string,
  type: 'title' | 'body' | 'hashtags' = 'body'
): Promise<ContentSuggestion[]> => {
  try {
    const response = await enhancedApiClient.get('/social-media/ai/suggestions', {
      params: { topic, platform, type },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content suggestions:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: '1',
        content: `Check out our latest feature that helps you save time and boost productivity! #ProductivityTips #TimeManagement`,
        type,
        platform: platform || 'twitter',
        confidenceScore: 0.92,
      },
      {
        id: '2',
        content: `We're excited to announce our newest update that makes your workflow smoother than ever. Here's how it can transform your daily tasks.`,
        type,
        platform: platform || 'linkedin',
        confidenceScore: 0.89,
      },
      {
        id: '3',
        content: `🚀 New feature alert! Discover how our latest innovation can help you achieve more in less time. Tell us what you think in the comments below!`,
        type,
        platform: platform || 'instagram',
        confidenceScore: 0.85,
      },
      {
        id: '4',
        content: `Just released: Our game-changing feature that our customers have been asking for. See the difference it can make for your business.`,
        type,
        platform: platform || 'facebook',
        confidenceScore: 0.82,
      },
      {
        id: '5',
        content: `How our latest update is helping businesses increase efficiency by 30%. Real results from real customers.`,
        type,
        platform: platform || 'linkedin',
        confidenceScore: 0.78,
      },
    ]);
  }
};

/**
 * Analyze content for quality, readability, and engagement
 * @param content Content to analyze
 * @param platform Target platform
 * @returns Content analysis results
 */
export const analyzeContent = async (
  content: string,
  platform?: string
): Promise<ContentAnalysisResult> => {
  try {
    const response = await enhancedApiClient.post('/social-media/ai/analyze', {
      content,
      platform,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing content:', error);
    
    // Return mock data for development
    return mockApiResponse({
      score: 78,
      readability: {
        score: 82,
        level: 'intermediate',
        suggestions: [
          'Consider breaking longer sentences into shorter ones',
          'Use more active voice for clarity',
        ],
      },
      sentiment: {
        score: 75,
        type: 'positive',
        suggestions: [
          'Add more positive emotional words to enhance engagement',
          'Consider addressing pain points more directly',
        ],
      },
      engagement: {
        score: 68,
        suggestions: [
          'Add a question to encourage comments',
          'Include a clear call-to-action',
          'Consider adding relevant hashtags',
        ],
      },
      seo: {
        score: 85,
        suggestions: [
          'Include more industry-specific keywords',
          'Add a relevant link to your website',
        ],
      },
      grammar: {
        score: 95,
        issues: [
          {
            text: 'their',
            suggestion: 'there',
            type: 'spelling',
          },
          {
            text: 'its important',
            suggestion: 'it\'s important',
            type: 'grammar',
          },
        ],
      },
    });
  }
};

/**
 * Get optimization suggestions for content
 * @param content Original content
 * @param platform Target platform
 * @param goals Optimization goals
 * @returns Optimized content suggestions
 */
export const getOptimizationSuggestions = async (
  content: string,
  platform?: string,
  goals: ('engagement' | 'conversion' | 'reach' | 'clarity')[] = ['engagement']
): Promise<ContentOptimizationSuggestion[]> => {
  try {
    const response = await enhancedApiClient.post('/social-media/ai/optimize', {
      content,
      platform,
      goals,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: '1',
        original: content,
        optimized: `🚀 ${content} What do you think? Let us know in the comments below! #Innovation #ProductivityTips`,
        improvementAreas: ['Added emoji for attention', 'Added question for engagement', 'Added call-to-action', 'Added relevant hashtags'],
        confidenceScore: 0.88,
      },
      {
        id: '2',
        original: content,
        optimized: `JUST ANNOUNCED: ${content} Click the link in bio to learn more and start your free trial today!`,
        improvementAreas: ['Added urgency', 'Added clear call-to-action', 'Improved conversion focus'],
        confidenceScore: 0.85,
      },
      {
        id: '3',
        original: content,
        optimized: `Did you know? ${content} Tag someone who needs to see this! 👇`,
        improvementAreas: ['Added question hook', 'Added tagging prompt for reach', 'Added emoji for visual appeal'],
        confidenceScore: 0.82,
      },
    ]);
  }
};

/**
 * Get hashtag suggestions for content
 * @param content Content to generate hashtags for
 * @param platform Target platform
 * @param count Number of hashtags to generate
 * @returns Hashtag suggestions
 */
export const getHashtagSuggestions = async (
  content: string,
  platform?: string,
  count: number = 5
): Promise<HashtagSuggestion[]> => {
  try {
    const response = await enhancedApiClient.post('/social-media/ai/hashtags', {
      content,
      platform,
      count,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting hashtag suggestions:', error);
    
    // Return mock data for development
    return mockApiResponse([
      { tag: 'ProductivityTips', popularity: 85, relevance: 92, recentTrend: 'rising' },
      { tag: 'Innovation', popularity: 90, relevance: 88, recentTrend: 'stable' },
      { tag: 'BusinessGrowth', popularity: 82, relevance: 85, recentTrend: 'rising' },
      { tag: 'WorkSmarter', popularity: 78, relevance: 83, recentTrend: 'rising' },
      { tag: 'DigitalTransformation', popularity: 88, relevance: 80, recentTrend: 'stable' },
      { tag: 'FutureOfWork', popularity: 86, relevance: 78, recentTrend: 'rising' },
      { tag: 'TechTrends', popularity: 84, relevance: 75, recentTrend: 'stable' },
    ]);
  }
};

/**
 * Generate AI content based on parameters
 * @param topic Content topic
 * @param platform Target platform
 * @param tone Content tone
 * @param length Content length
 * @returns Generated content
 */
export const generateContent = async (
  topic: string,
  platform?: string,
  tone: 'professional' | 'casual' | 'enthusiastic' | 'informative' = 'professional',
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<string> => {
  try {
    const response = await enhancedApiClient.post('/social-media/ai/generate', {
      topic,
      platform,
      tone,
      length,
    });
    return response.data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return mock data for development
    const shortContent = `Check out our latest feature that helps you save time! #ProductivityTips`;
    
    const mediumContent = `We're excited to announce our newest feature that helps you save time and boost productivity! Try it today and let us know what you think. #ProductivityTips #Innovation`;
    
    const longContent = `We're thrilled to unveil our latest innovation: a game-changing feature designed to streamline your workflow and boost productivity!

After months of development and customer feedback, this new capability helps you accomplish more in less time by automating repetitive tasks and providing intelligent suggestions.

Have you tried it yet? We'd love to hear your thoughts in the comments below!

#ProductivityTips #Innovation #WorkSmarter #DigitalTransformation`;

    // Return different lengths based on parameter
    switch (length) {
      case 'short':
        return shortContent;
      case 'long':
        return longContent;
      case 'medium':
      default:
        return mediumContent;
    }
  }
};

/**
 * Get content performance prediction
 * @param content Content to analyze
 * @param platform Target platform
 * @returns Performance prediction
 */
export const predictContentPerformance = async (
  content: string,
  platform?: string
): Promise<{
  engagementScore: number;
  reachScore: number;
  conversionScore: number;
  bestTimeToPost: { day: string; hour: number };
  audienceMatch: number;
  improvementSuggestions: string[];
}> => {
  try {
    const response = await enhancedApiClient.post('/social-media/ai/predict', {
      content,
      platform,
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting content performance:', error);
    
    // Return mock data for development
    return mockApiResponse({
      engagementScore: 78,
      reachScore: 72,
      conversionScore: 65,
      bestTimeToPost: { day: 'Tuesday', hour: 10 },
      audienceMatch: 82,
      improvementSuggestions: [
        'Add a question to encourage comments',
        'Include a clear call-to-action',
        'Add relevant hashtags to increase reach',
        'Consider adding an image or video for higher engagement',
      ],
    });
  }
};
