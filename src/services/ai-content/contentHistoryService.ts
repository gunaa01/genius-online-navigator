import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

/**
 * Content History Item
 */
export interface ContentHistoryItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: 'social' | 'blog' | 'email' | 'ad' | 'other';
  platform?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  metrics?: {
    views?: number;
    engagement?: number;
    conversions?: number;
  };
  versions: ContentVersion[];
}

/**
 * Content Version
 */
export interface ContentVersion {
  id: string;
  content: string;
  createdAt: string;
  createdBy?: string;
  notes?: string;
}

/**
 * Content Filter Options
 */
export interface ContentFilterOptions {
  type?: 'social' | 'blog' | 'email' | 'ad' | 'other';
  platform?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

/**
 * Get content history
 * @param options Filter options
 * @param page Page number
 * @param limit Items per page
 * @returns Content history items and pagination info
 */
export const getContentHistory = async (
  options?: ContentFilterOptions,
  page: number = 1,
  limit: number = 10
): Promise<{
  items: ContentHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    const response = await enhancedApiClient.get('/ai-content/history', {
      params: {
        ...options,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content history:', error);
    
    // Return mock data for development
    const mockItems: ContentHistoryItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: `content-${i + 1}`,
      title: `Content ${i + 1}`,
      content: `This is sample content ${i + 1} for testing purposes. It demonstrates how the content would appear in the history.`,
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString(), // Each item 1 day apart
      updatedAt: new Date(Date.now() - (i * 86400000) + 3600000).toISOString(), // 1 hour after creation
      type: ['social', 'blog', 'email', 'ad', 'other'][Math.floor(Math.random() * 5)] as any,
      platform: ['twitter', 'linkedin', 'facebook', 'instagram', undefined][Math.floor(Math.random() * 5)],
      tags: ['marketing', 'product', 'announcement', 'promotion'].slice(0, Math.floor(Math.random() * 4) + 1),
      status: ['draft', 'published', 'archived'][Math.floor(Math.random() * 3)] as any,
      metrics: {
        views: Math.floor(Math.random() * 1000),
        engagement: Math.floor(Math.random() * 100),
        conversions: Math.floor(Math.random() * 50),
      },
      versions: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: `version-${i + 1}-${j + 1}`,
        content: `This is version ${j + 1} of content ${i + 1}. Each version may have different wording or structure.`,
        createdAt: new Date(Date.now() - (i * 86400000) + (j * 3600000)).toISOString(),
        createdBy: 'User',
        notes: j === 0 ? 'Initial version' : `Revision ${j}`,
      })),
    }));
    
    // Filter mock items based on options
    let filteredItems = [...mockItems];
    
    if (options) {
      if (options.type) {
        filteredItems = filteredItems.filter(item => item.type === options.type);
      }
      
      if (options.platform) {
        filteredItems = filteredItems.filter(item => item.platform === options.platform);
      }
      
      if (options.tags && options.tags.length > 0) {
        filteredItems = filteredItems.filter(item => 
          options.tags!.some(tag => item.tags.includes(tag))
        );
      }
      
      if (options.status) {
        filteredItems = filteredItems.filter(item => item.status === options.status);
      }
      
      if (options.dateRange) {
        const start = new Date(options.dateRange.start).getTime();
        const end = new Date(options.dateRange.end).getTime();
        
        filteredItems = filteredItems.filter(item => {
          const createdAt = new Date(item.createdAt).getTime();
          return createdAt >= start && createdAt <= end;
        });
      }
      
      if (options.search) {
        const search = options.search.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(search) || 
          item.content.toLowerCase().includes(search) ||
          item.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
    }
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    return mockApiResponse({
      items: paginatedItems,
      total: filteredItems.length,
      page,
      limit,
      totalPages: Math.ceil(filteredItems.length / limit),
    });
  }
};

/**
 * Get content history item by ID
 * @param id Content history item ID
 * @returns Content history item
 */
export const getContentHistoryItem = async (id: string): Promise<ContentHistoryItem> => {
  try {
    const response = await enhancedApiClient.get(`/ai-content/history/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content history item ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({
      id,
      title: `Content ${id}`,
      content: `This is sample content ${id} for testing purposes. It demonstrates how the content would appear in the history.`,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      type: 'blog',
      platform: 'website',
      tags: ['marketing', 'product', 'announcement'],
      status: 'published',
      metrics: {
        views: 500,
        engagement: 75,
        conversions: 25,
      },
      versions: Array.from({ length: 3 }, (_, i) => ({
        id: `version-${id}-${i + 1}`,
        content: `This is version ${i + 1} of content ${id}. Each version may have different wording or structure.`,
        createdAt: new Date(Date.now() - 86400000 + (i * 3600000)).toISOString(),
        createdBy: 'User',
        notes: i === 0 ? 'Initial version' : `Revision ${i}`,
      })),
    });
  }
};

/**
 * Save content to history
 * @param content Generated content
 * @param type Content type
 * @param platform Platform
 * @param tags Tags
 * @returns Saved content history item
 */
export const saveContentToHistory = async (
  content: contentGenerationService.GeneratedContent,
  type: 'social' | 'blog' | 'email' | 'ad' | 'other',
  platform?: string,
  tags: string[] = []
): Promise<ContentHistoryItem> => {
  try {
    const response = await enhancedApiClient.post('/ai-content/history', {
      title: content.title || 'Untitled Content',
      content: content.content,
      type,
      platform,
      tags: [...tags, ...(content.hashtags || [])],
    });
    return response.data;
  } catch (error) {
    console.error('Error saving content to history:', error);
    
    // Return mock data for development
    return mockApiResponse({
      id: `content-${Date.now()}`,
      title: content.title || 'Untitled Content',
      content: content.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type,
      platform,
      tags: [...tags, ...(content.hashtags || [])],
      status: 'draft',
      versions: [
        {
          id: `version-${Date.now()}-1`,
          content: content.content,
          createdAt: new Date().toISOString(),
          createdBy: 'User',
          notes: 'Initial version',
        },
      ],
    });
  }
};

/**
 * Update content history item
 * @param id Content history item ID
 * @param updates Updates to apply
 * @param createVersion Whether to create a new version
 * @param versionNotes Notes for the new version
 * @returns Updated content history item
 */
export const updateContentHistoryItem = async (
  id: string,
  updates: {
    title?: string;
    content?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
  },
  createVersion: boolean = true,
  versionNotes?: string
): Promise<ContentHistoryItem> => {
  try {
    const response = await enhancedApiClient.put(`/ai-content/history/${id}`, {
      ...updates,
      createVersion,
      versionNotes,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating content history item ${id}:`, error);
    
    // For mock data, fetch the item first
    const item = await getContentHistoryItem(id);
    
    // Apply updates
    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Create new version if needed
    if (createVersion && updates.content) {
      const newVersion = {
        id: `version-${id}-${item.versions.length + 1}`,
        content: updates.content,
        createdAt: new Date().toISOString(),
        createdBy: 'User',
        notes: versionNotes || `Revision ${item.versions.length}`,
      };
      
      updatedItem.versions = [newVersion, ...item.versions];
    }
    
    return mockApiResponse(updatedItem);
  }
};

/**
 * Delete content history item
 * @param id Content history item ID
 * @returns Success status
 */
export const deleteContentHistoryItem = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.delete(`/ai-content/history/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting content history item ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({ success: true });
  }
};

/**
 * Export content to various formats
 * @param id Content history item ID
 * @param format Export format
 * @returns Export URL or data
 */
export const exportContent = async (
  id: string,
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'plain'
): Promise<{ url?: string; data?: string }> => {
  try {
    const response = await enhancedApiClient.get(`/ai-content/history/${id}/export`, {
      params: { format },
    });
    return response.data;
  } catch (error) {
    console.error(`Error exporting content ${id} to ${format}:`, error);
    
    // Return mock data for development
    return mockApiResponse({
      url: format === 'pdf' || format === 'docx' 
        ? `https://example.com/exports/${id}.${format}` 
        : undefined,
      data: format === 'html' || format === 'markdown' || format === 'plain'
        ? `Sample exported content in ${format} format`
        : undefined,
    });
  }
};

/**
 * Get content performance metrics
 * @param id Content history item ID
 * @param dateRange Date range for metrics
 * @returns Performance metrics
 */
export const getContentPerformanceMetrics = async (
  id: string,
  dateRange?: { start: string; end: string }
): Promise<{
  views: { date: string; count: number }[];
  engagement: { date: string; count: number }[];
  conversions: { date: string; count: number }[];
  totalViews: number;
  totalEngagement: number;
  totalConversions: number;
}> => {
  try {
    const response = await enhancedApiClient.get(`/ai-content/history/${id}/metrics`, {
      params: { dateRange },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching metrics for content ${id}:`, error);
    
    // Return mock data for development
    const days = 14;
    const today = new Date();
    
    // Generate daily metrics for the past 14 days
    const metrics = Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - i));
      const dateString = date.toISOString().split('T')[0];
      
      return {
        date: dateString,
        views: Math.floor(Math.random() * 100),
        engagement: Math.floor(Math.random() * 30),
        conversions: Math.floor(Math.random() * 10),
      };
    });
    
    // Calculate totals
    const totalViews = metrics.reduce((sum, day) => sum + day.views, 0);
    const totalEngagement = metrics.reduce((sum, day) => sum + day.engagement, 0);
    const totalConversions = metrics.reduce((sum, day) => sum + day.conversions, 0);
    
    return mockApiResponse({
      views: metrics.map(m => ({ date: m.date, count: m.views })),
      engagement: metrics.map(m => ({ date: m.date, count: m.engagement })),
      conversions: metrics.map(m => ({ date: m.date, count: m.conversions })),
      totalViews,
      totalEngagement,
      totalConversions,
    });
  }
};

/**
 * Share content to social media or other platforms
 * @param id Content history item ID
 * @param platforms Platforms to share to
 * @param scheduledFor Optional scheduled time
 * @returns Share status
 */
export const shareContent = async (
  id: string,
  platforms: string[],
  scheduledFor?: string
): Promise<{
  success: boolean;
  shares: { platform: string; status: 'shared' | 'scheduled' | 'failed'; url?: string; error?: string }[];
}> => {
  try {
    const response = await enhancedApiClient.post(`/ai-content/history/${id}/share`, {
      platforms,
      scheduledFor,
    });
    return response.data;
  } catch (error) {
    console.error(`Error sharing content ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({
      success: true,
      shares: platforms.map(platform => ({
        platform,
        status: scheduledFor ? 'scheduled' : 'shared',
        url: scheduledFor ? undefined : `https://${platform}.com/post/123456`,
      })),
    });
  }
};
