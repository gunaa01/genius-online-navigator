import { enhancedApiClient } from '@/services/apiClient';

// Types for smart recommendations
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
  aiConfidence: number;
  dataPoints: string[];
  implemented: boolean;
}

/**
 * Get smart recommendations based on insights data
 * @param params Optional parameters for filtering recommendations
 * @returns Array of smart recommendations
 */
export const getSmartRecommendations = async (params?: {
  category?: string;
  implemented?: boolean;
}): Promise<Recommendation[]> => {
  try {
    const response = await enhancedApiClient.get('/ai/recommendations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching smart recommendations:', error);
    throw error;
  }
};

/**
 * Mark a recommendation as implemented
 * @param id Recommendation ID
 * @returns Success response
 */
export const implementRecommendation = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.put(`/ai/recommendations/${id}/implement`);
    return response.data;
  } catch (error) {
    console.error('Error implementing recommendation:', error);
    throw error;
  }
};

/**
 * Get recommendation categories
 * @returns Array of recommendation categories
 */
export const getRecommendationCategories = async (): Promise<string[]> => {
  try {
    const response = await enhancedApiClient.get('/ai/recommendations/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendation categories:', error);
    throw error;
  }
};

/**
 * Get mock recommendations for development and testing
 * @returns Array of mock recommendations
 */
export const getMockRecommendations = (): Recommendation[] => {
  return [
    {
      id: '1',
      title: 'Improve mobile navigation',
      description: 'Add a simplified navigation menu for mobile users to reduce bounce rate.',
      impact: 'high',
      effort: 'medium',
      category: 'UX/UI',
      aiConfidence: 0.92,
      dataPoints: [
        'Mobile bounce rate is 45% higher than desktop',
        'User feedback mentions navigation difficulty on mobile',
        'Session duration on mobile is 35% shorter than desktop'
      ],
      implemented: false
    },
    {
      id: '2',
      title: 'Add dark mode support',
      description: 'Implement dark mode to improve user experience and reduce eye strain.',
      impact: 'medium',
      effort: 'medium',
      category: 'UX/UI',
      aiConfidence: 0.78,
      dataPoints: [
        '23% of user feedback requests dark mode',
        'Competitors have implemented dark mode with positive reception',
        'Evening usage accounts for 40% of total platform usage'
      ],
      implemented: false
    },
    {
      id: '3',
      title: 'Optimize image loading',
      description: 'Implement lazy loading and image optimization to improve page load times.',
      impact: 'high',
      effort: 'low',
      category: 'Performance',
      aiConfidence: 0.95,
      dataPoints: [
        'Image assets account for 65% of page weight',
        'Page load time exceeds 3 seconds on 3G connections',
        'Users on slower connections have 2.5x higher bounce rate'
      ],
      implemented: true
    },
    {
      id: '4',
      title: 'Enhance onboarding flow',
      description: 'Add interactive tutorials and tooltips to improve new user retention.',
      impact: 'high',
      effort: 'high',
      category: 'User Retention',
      aiConfidence: 0.88,
      dataPoints: [
        'New user churn rate is 35% in the first week',
        'Users who complete onboarding have 3x higher retention',
        'Feedback indicates confusion about platform features'
      ],
      implemented: false
    },
    {
      id: '5',
      title: 'Implement email notifications',
      description: 'Send personalized email notifications for important events and updates.',
      impact: 'medium',
      effort: 'medium',
      category: 'Engagement',
      aiConfidence: 0.82,
      dataPoints: [
        'Users with notifications enabled have 27% higher engagement',
        'Re-engagement from email campaigns shows 15% conversion',
        'Inactive users cite "forgetting about the platform" as a reason'
      ],
      implemented: false
    },
    {
      id: '6',
      title: 'Add social sharing options',
      description: 'Implement social sharing buttons to increase content virality and user acquisition.',
      impact: 'medium',
      effort: 'low',
      category: 'Growth',
      aiConfidence: 0.75,
      dataPoints: [
        'Content sharing on other platforms drives 18% of new user acquisition',
        'Users express desire to share content with colleagues',
        'Competitors with sharing features show higher viral growth'
      ],
      implemented: false
    },
    {
      id: '7',
      title: 'Optimize database queries',
      description: 'Refactor database queries to improve dashboard loading times.',
      impact: 'high',
      effort: 'high',
      category: 'Performance',
      aiConfidence: 0.91,
      dataPoints: [
        'Dashboard loading time exceeds 2 seconds on 50% of requests',
        'Database query time accounts for 70% of API response time',
        'Users report frustration with dashboard loading times'
      ],
      implemented: false
    },
    {
      id: '8',
      title: 'Implement A/B testing framework',
      description: 'Add infrastructure for A/B testing to optimize conversion rates.',
      impact: 'high',
      effort: 'high',
      category: 'Analytics',
      aiConfidence: 0.86,
      dataPoints: [
        'Current optimization relies on intuition rather than data',
        'Competitors using A/B testing show 15-20% higher conversion rates',
        'Multiple UI/UX hypotheses need validation'
      ],
      implemented: false
    }
  ];
};
