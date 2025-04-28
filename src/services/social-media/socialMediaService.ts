import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

/**
 * Social Media Platform
 */
export interface SocialMediaPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
  followers: number;
  engagement: number;
  lastUpdated: string;
}

/**
 * Social Media Post
 */
export interface SocialMediaPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  imageUrl?: string;
  videoUrl?: string;
  scheduledFor?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

/**
 * Social Media Analytics
 */
export interface SocialMediaAnalytics {
  followers: {
    total: number;
    growth: number;
    byPlatform: { platform: string; count: number; growth: number }[];
  };
  engagement: {
    rate: number;
    change: number;
    byPlatform: { platform: string; rate: number; change: number }[];
  };
  reach: {
    total: number;
    change: number;
    byPlatform: { platform: string; count: number; change: number }[];
  };
  impressions: {
    total: number;
    change: number;
    byPlatform: { platform: string; count: number; change: number }[];
  };
  topPosts: SocialMediaPost[];
}

/**
 * Social Media Audience
 */
export interface SocialMediaAudience {
  demographics: {
    age: { range: string; percentage: number }[];
    gender: { type: string; percentage: number }[];
    location: { country: string; percentage: number }[];
  };
  interests: { name: string; percentage: number }[];
  activeHours: { hour: number; activity: number }[];
  growth: { date: string; followers: number }[];
}

/**
 * Get connected social media platforms
 * @returns List of connected platforms
 */
export const getPlatforms = async (): Promise<SocialMediaPlatform[]> => {
  try {
    const response = await enhancedApiClient.get('/social-media/platforms');
    return response.data;
  } catch (error) {
    console.error('Error fetching social media platforms:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'twitter',
        connected: true,
        username: '@geniusnavigator',
        followers: 12500,
        engagement: 2.8,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'facebook',
        connected: true,
        username: 'Genius Online Navigator',
        followers: 8700,
        engagement: 1.9,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: 'instagram',
        connected: true,
        username: '@geniusnavigator',
        followers: 3200,
        engagement: 4.7,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'linkedin',
        connected: true,
        username: 'Genius Online Navigator',
        followers: 1100,
        engagement: 3.2,
        lastUpdated: new Date().toISOString(),
      },
    ]);
  }
};

/**
 * Get social media posts
 * @param status Filter by status
 * @param platform Filter by platform
 * @returns List of posts
 */
export const getPosts = async (
  status?: 'draft' | 'scheduled' | 'published' | 'failed',
  platform?: string
): Promise<SocialMediaPost[]> => {
  try {
    const response = await enhancedApiClient.get('/social-media/posts', {
      params: { status, platform },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching social media posts:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: '1',
        title: 'Product Launch',
        content: 'We\'re excited to announce the launch of our new product!',
        platform: 'twitter',
        imageUrl: 'https://via.placeholder.com/500',
        publishedAt: '2025-04-20T10:00:00Z',
        status: 'published',
        engagement: {
          likes: 1200,
          comments: 342,
          shares: 89,
        },
      },
      {
        id: '2',
        title: 'Customer Testimonial',
        content: 'Hear what our customers are saying about us!',
        platform: 'linkedin',
        imageUrl: 'https://via.placeholder.com/500',
        publishedAt: '2025-04-21T14:30:00Z',
        status: 'published',
        engagement: {
          likes: 780,
          comments: 156,
          shares: 45,
        },
      },
      {
        id: '3',
        title: 'Feature Highlight',
        content: 'Check out our latest feature that helps you save time!',
        platform: 'instagram',
        imageUrl: 'https://via.placeholder.com/500',
        publishedAt: '2025-04-22T09:15:00Z',
        status: 'published',
        engagement: {
          likes: 950,
          comments: 210,
          shares: 32,
        },
      },
      {
        id: '4',
        title: 'Product Update',
        content: 'We\'ve made some improvements to our platform!',
        platform: 'twitter',
        scheduledFor: '2025-04-23T15:00:00Z',
        status: 'scheduled',
      },
      {
        id: '5',
        title: 'Customer Story',
        content: 'Learn how our platform helped this customer grow their business!',
        platform: 'linkedin',
        scheduledFor: '2025-04-24T10:00:00Z',
        status: 'scheduled',
      },
      {
        id: '6',
        title: 'Behind the Scenes',
        content: 'A draft post about our team working on new features.',
        platform: 'instagram',
        status: 'draft',
      },
    ]);
  }
};

/**
 * Create a new social media post
 * @param post Post data
 * @returns Created post
 */
export const createPost = async (post: Omit<SocialMediaPost, 'id'>): Promise<SocialMediaPost> => {
  try {
    const response = await enhancedApiClient.post('/social-media/posts', post);
    return response.data;
  } catch (error) {
    console.error('Error creating social media post:', error);
    throw error;
  }
};

/**
 * Update an existing social media post
 * @param id Post ID
 * @param post Updated post data
 * @returns Updated post
 */
export const updatePost = async (
  id: string,
  post: Partial<SocialMediaPost>
): Promise<SocialMediaPost> => {
  try {
    const response = await enhancedApiClient.put(`/social-media/posts/${id}`, post);
    return response.data;
  } catch (error) {
    console.error('Error updating social media post:', error);
    throw error;
  }
};

/**
 * Delete a social media post
 * @param id Post ID
 * @returns Success status
 */
export const deletePost = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.delete(`/social-media/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting social media post:', error);
    throw error;
  }
};

/**
 * Get social media analytics
 * @param timeframe Timeframe for analytics
 * @returns Analytics data
 */
export const getAnalytics = async (
  timeframe: '7d' | '30d' | '90d' | '180d' | '365d' = '30d'
): Promise<SocialMediaAnalytics> => {
  try {
    const response = await enhancedApiClient.get('/social-media/analytics', {
      params: { timeframe },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching social media analytics:', error);
    
    // Return mock data for development
    return mockApiResponse({
      followers: {
        total: 25500,
        growth: 12,
        byPlatform: [
          { platform: 'twitter', count: 12500, growth: 8 },
          { platform: 'facebook', count: 8700, growth: 5 },
          { platform: 'instagram', count: 3200, growth: 15 },
          { platform: 'linkedin', count: 1100, growth: 10 },
        ],
      },
      engagement: {
        rate: 3.2,
        change: 0.8,
        byPlatform: [
          { platform: 'twitter', rate: 2.8, change: 0.5 },
          { platform: 'facebook', rate: 1.9, change: 0.2 },
          { platform: 'instagram', rate: 4.7, change: 1.2 },
          { platform: 'linkedin', rate: 3.2, change: 0.7 },
        ],
      },
      reach: {
        total: 125000,
        change: 15,
        byPlatform: [
          { platform: 'twitter', count: 65000, change: 12 },
          { platform: 'facebook', count: 35000, change: 8 },
          { platform: 'instagram', count: 18000, change: 22 },
          { platform: 'linkedin', count: 7000, change: 18 },
        ],
      },
      impressions: {
        total: 250000,
        change: 18,
        byPlatform: [
          { platform: 'twitter', count: 120000, change: 15 },
          { platform: 'facebook', count: 80000, change: 10 },
          { platform: 'instagram', count: 40000, change: 25 },
          { platform: 'linkedin', count: 10000, change: 20 },
        ],
      },
      topPosts: [
        {
          id: '1',
          title: 'Product Launch',
          content: 'We\'re excited to announce the launch of our new product!',
          platform: 'twitter',
          imageUrl: 'https://via.placeholder.com/500',
          publishedAt: '2025-04-20T10:00:00Z',
          status: 'published',
          engagement: {
            likes: 1200,
            comments: 342,
            shares: 89,
          },
        },
        {
          id: '2',
          title: 'Customer Testimonial',
          content: 'Hear what our customers are saying about us!',
          platform: 'linkedin',
          imageUrl: 'https://via.placeholder.com/500',
          publishedAt: '2025-04-21T14:30:00Z',
          status: 'published',
          engagement: {
            likes: 780,
            comments: 156,
            shares: 45,
          },
        },
        {
          id: '3',
          title: 'Feature Highlight',
          content: 'Check out our latest feature that helps you save time!',
          platform: 'instagram',
          imageUrl: 'https://via.placeholder.com/500',
          publishedAt: '2025-04-22T09:15:00Z',
          status: 'published',
          engagement: {
            likes: 950,
            comments: 210,
            shares: 32,
          },
        },
      ],
    });
  }
};

/**
 * Get audience insights
 * @param platform Filter by platform
 * @returns Audience data
 */
export const getAudienceInsights = async (
  platform?: string
): Promise<SocialMediaAudience> => {
  try {
    const response = await enhancedApiClient.get('/social-media/audience', {
      params: { platform },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching audience insights:', error);
    
    // Return mock data for development
    return mockApiResponse({
      demographics: {
        age: [
          { range: '18-24', percentage: 15 },
          { range: '25-34', percentage: 35 },
          { range: '35-44', percentage: 25 },
          { range: '45-54', percentage: 15 },
          { range: '55+', percentage: 10 },
        ],
        gender: [
          { type: 'Male', percentage: 55 },
          { type: 'Female', percentage: 45 },
        ],
        location: [
          { country: 'United States', percentage: 45 },
          { country: 'United Kingdom', percentage: 15 },
          { country: 'Canada', percentage: 10 },
          { country: 'Australia', percentage: 8 },
          { country: 'Germany', percentage: 5 },
          { country: 'Other', percentage: 17 },
        ],
      },
      interests: [
        { name: 'Technology', percentage: 65 },
        { name: 'Business', percentage: 55 },
        { name: 'Marketing', percentage: 45 },
        { name: 'Entrepreneurship', percentage: 40 },
        { name: 'Design', percentage: 35 },
        { name: 'Finance', percentage: 30 },
      ],
      activeHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.floor(Math.random() * 100),
      })),
      growth: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          followers: 24000 + Math.floor(Math.random() * 100) + (i * 50),
        };
      }),
    });
  }
};

/**
 * Get best time to post
 * @param platform Platform to get best time for
 * @returns Best times to post
 */
export const getBestTimeToPost = async (
  platform?: string
): Promise<{ day: string; hour: number; score: number }[]> => {
  try {
    const response = await enhancedApiClient.get('/social-media/best-time', {
      params: { platform },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching best time to post:', error);
    
    // Return mock data for development
    return mockApiResponse([
      { day: 'Monday', hour: 9, score: 85 },
      { day: 'Monday', hour: 15, score: 78 },
      { day: 'Tuesday', hour: 10, score: 92 },
      { day: 'Tuesday', hour: 16, score: 88 },
      { day: 'Wednesday', hour: 11, score: 90 },
      { day: 'Wednesday', hour: 14, score: 82 },
      { day: 'Thursday', hour: 9, score: 87 },
      { day: 'Thursday', hour: 17, score: 84 },
      { day: 'Friday', hour: 10, score: 89 },
      { day: 'Friday', hour: 13, score: 81 },
      { day: 'Saturday', hour: 12, score: 75 },
      { day: 'Sunday', hour: 18, score: 72 },
    ]);
  }
};

/**
 * Connect a social media platform
 * @param platform Platform to connect
 * @param credentials Connection credentials
 * @returns Connected platform
 */
export const connectPlatform = async (
  platform: string,
  credentials: any
): Promise<SocialMediaPlatform> => {
  try {
    const response = await enhancedApiClient.post(`/social-media/connect/${platform}`, credentials);
    return response.data;
  } catch (error) {
    console.error(`Error connecting ${platform}:`, error);
    throw error;
  }
};

/**
 * Disconnect a social media platform
 * @param platform Platform to disconnect
 * @returns Success status
 */
export const disconnectPlatform = async (
  platform: string
): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.post(`/social-media/disconnect/${platform}`);
    return response.data;
  } catch (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    throw error;
  }
};
