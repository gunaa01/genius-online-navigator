import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as contentHistoryService from '@/services/ai-content/contentHistoryService';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';
import { enhancedApiClient } from '@/services/apiClient';

// Mock the API client
vi.mock('@/services/apiClient', () => ({
  enhancedApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  mockApiResponse: (data: any) => Promise.resolve(data),
}));

describe('Content History Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getContentHistory', () => {
    it('should fetch content history successfully', async () => {
      // Mock API response
      const mockResult = {
        items: [
          {
            id: 'content-1',
            title: 'Test Content',
            content: 'Test content body',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            type: 'blog',
            tags: ['test', 'blog'],
            status: 'published',
            metrics: {
              views: 100,
              engagement: 50,
              conversions: 10,
            },
            versions: [
              {
                id: 'version-1',
                content: 'Test content body',
                createdAt: '2025-01-01T00:00:00Z',
                createdBy: 'User',
                notes: 'Initial version',
              },
            ],
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockResult });

      // Call the service
      const result = await contentHistoryService.getContentHistory();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history', {
        params: {
          page: 1,
          limit: 10,
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('should apply filters correctly', async () => {
      // Mock filters
      const filters = {
        type: 'blog',
        status: 'published',
        search: 'test',
      };
      
      // Mock API response
      const mockResult = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockResult });

      // Call the service
      const result = await contentHistoryService.getContentHistory(filters, 2, 20);

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history', {
        params: {
          ...filters,
          page: 2,
          limit: 20,
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.getContentHistory();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history', {
        params: {
          page: 1,
          limit: 10,
        },
      });
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('totalPages');
    });
  });

  describe('getContentHistoryItem', () => {
    it('should fetch a specific content history item successfully', async () => {
      // Mock API response
      const mockItem = {
        id: 'content-1',
        title: 'Test Content',
        content: 'Test content body',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        type: 'blog',
        tags: ['test', 'blog'],
        status: 'published',
        metrics: {
          views: 100,
          engagement: 50,
          conversions: 10,
        },
        versions: [
          {
            id: 'version-1',
            content: 'Test content body',
            createdAt: '2025-01-01T00:00:00Z',
            createdBy: 'User',
            notes: 'Initial version',
          },
        ],
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockItem });

      // Call the service
      const result = await contentHistoryService.getContentHistoryItem('content-1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1');
      expect(result).toEqual(mockItem);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.getContentHistoryItem('content-1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('versions');
    });
  });

  describe('saveContentToHistory', () => {
    it('should save content to history successfully', async () => {
      // Mock content
      const content: contentGenerationService.GeneratedContent = {
        id: 'gen-1',
        title: 'Generated Title',
        content: 'Generated content text',
        seoScore: 85,
        readabilityScore: 90,
        hashtags: ['#test', '#content'],
      };
      
      // Mock API response
      const mockSavedItem = {
        id: 'content-1',
        title: 'Generated Title',
        content: 'Generated content text',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        type: 'blog',
        tags: ['test', 'content'],
        status: 'draft',
        versions: [
          {
            id: 'version-1',
            content: 'Generated content text',
            createdAt: '2025-01-01T00:00:00Z',
            createdBy: 'User',
            notes: 'Initial version',
          },
        ],
      };
      
      (enhancedApiClient.post as any).mockResolvedValueOnce({ data: mockSavedItem });

      // Call the service
      const result = await contentHistoryService.saveContentToHistory(
        content,
        'blog',
        'website',
        ['test']
      );

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/history', {
        title: 'Generated Title',
        content: 'Generated content text',
        type: 'blog',
        platform: 'website',
        tags: ['test', '#test', '#content'],
      });
      expect(result).toEqual(mockSavedItem);
    });

    it('should return mock data when API fails', async () => {
      // Mock content
      const content: contentGenerationService.GeneratedContent = {
        id: 'gen-1',
        title: 'Generated Title',
        content: 'Generated content text',
        seoScore: 85,
        readabilityScore: 90,
        hashtags: ['#test', '#content'],
      };
      
      // Mock API error
      (enhancedApiClient.post as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.saveContentToHistory(
        content,
        'blog'
      );

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/history', {
        title: 'Generated Title',
        content: 'Generated content text',
        type: 'blog',
        platform: undefined,
        tags: ['#test', '#content'],
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(result.title).toEqual('Generated Title');
    });
  });

  describe('updateContentHistoryItem', () => {
    it('should update content history item successfully', async () => {
      // Mock updates
      const updates = {
        title: 'Updated Title',
        content: 'Updated content text',
        tags: ['updated', 'test'],
        status: 'published' as const,
      };
      
      // Mock API response
      const mockUpdatedItem = {
        id: 'content-1',
        ...updates,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
        type: 'blog',
        versions: [
          {
            id: 'version-2',
            content: 'Updated content text',
            createdAt: '2025-01-02T00:00:00Z',
            createdBy: 'User',
            notes: 'Updated version',
          },
          {
            id: 'version-1',
            content: 'Original content text',
            createdAt: '2025-01-01T00:00:00Z',
            createdBy: 'User',
            notes: 'Initial version',
          },
        ],
      };
      
      (enhancedApiClient.put as any).mockResolvedValueOnce({ data: mockUpdatedItem });

      // Call the service
      const result = await contentHistoryService.updateContentHistoryItem(
        'content-1',
        updates,
        true,
        'Updated version'
      );

      // Assertions
      expect(enhancedApiClient.put).toHaveBeenCalledWith('/ai-content/history/content-1', {
        ...updates,
        createVersion: true,
        versionNotes: 'Updated version',
      });
      expect(result).toEqual(mockUpdatedItem);
    });

    it('should return mock data when API fails', async () => {
      // Mock updates
      const updates = {
        title: 'Updated Title',
        content: 'Updated content text',
      };
      
      // Mock API error
      (enhancedApiClient.put as any).mockRejectedValueOnce(new Error('API error'));
      
      // Mock getContentHistoryItem for fallback
      vi.spyOn(contentHistoryService, 'getContentHistoryItem').mockResolvedValueOnce({
        id: 'content-1',
        title: 'Original Title',
        content: 'Original content text',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        type: 'blog',
        tags: ['original', 'test'],
        status: 'draft',
        versions: [
          {
            id: 'version-1',
            content: 'Original content text',
            createdAt: '2025-01-01T00:00:00Z',
            createdBy: 'User',
            notes: 'Initial version',
          },
        ],
      });

      // Call the service
      const result = await contentHistoryService.updateContentHistoryItem(
        'content-1',
        updates,
        true
      );

      // Assertions
      expect(enhancedApiClient.put).toHaveBeenCalledWith('/ai-content/history/content-1', {
        ...updates,
        createVersion: true,
        versionNotes: undefined,
      });
      expect(result).toHaveProperty('id', 'content-1');
      expect(result).toHaveProperty('title', 'Updated Title');
      expect(result).toHaveProperty('content', 'Updated content text');
      expect(result.versions.length).toBeGreaterThan(1);
    });
  });

  describe('deleteContentHistoryItem', () => {
    it('should delete content history item successfully', async () => {
      // Mock API response
      const mockResult = { success: true };
      
      (enhancedApiClient.delete as any).mockResolvedValueOnce({ data: mockResult });

      // Call the service
      const result = await contentHistoryService.deleteContentHistoryItem('content-1');

      // Assertions
      expect(enhancedApiClient.delete).toHaveBeenCalledWith('/ai-content/history/content-1');
      expect(result).toEqual(mockResult);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.delete as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.deleteContentHistoryItem('content-1');

      // Assertions
      expect(enhancedApiClient.delete).toHaveBeenCalledWith('/ai-content/history/content-1');
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('exportContent', () => {
    it('should export content successfully', async () => {
      // Mock API response
      const mockResult = {
        url: 'https://example.com/exports/content-1.pdf',
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockResult });

      // Call the service
      const result = await contentHistoryService.exportContent('content-1', 'pdf');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1/export', {
        params: { format: 'pdf' },
      });
      expect(result).toEqual(mockResult);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.exportContent('content-1', 'markdown');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1/export', {
        params: { format: 'markdown' },
      });
      expect(result).toHaveProperty('data');
    });
  });

  describe('shareContent', () => {
    it('should share content successfully', async () => {
      // Mock API response
      const mockResult = {
        success: true,
        shares: [
          {
            platform: 'twitter',
            status: 'shared',
            url: 'https://twitter.com/post/123456',
          },
          {
            platform: 'linkedin',
            status: 'shared',
            url: 'https://linkedin.com/post/123456',
          },
        ],
      };
      
      (enhancedApiClient.post as any).mockResolvedValueOnce({ data: mockResult });

      // Call the service
      const result = await contentHistoryService.shareContent(
        'content-1',
        ['twitter', 'linkedin']
      );

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/history/content-1/share', {
        platforms: ['twitter', 'linkedin'],
        scheduledFor: undefined,
      });
      expect(result).toEqual(mockResult);
    });

    it('should schedule content sharing successfully', async () => {
      // Mock scheduled time
      const scheduledFor = '2025-01-02T12:00:00Z';
      
      // Mock API response
      const mockResult = {
        success: true,
        shares: [
          {
            platform: 'facebook',
            status: 'scheduled',
          },
        ],
      };
      
      (enhancedApiClient.post as any).mockResolvedValueOnce({ data: mockResult });

      // Call the service
      const result = await contentHistoryService.shareContent(
        'content-1',
        ['facebook'],
        scheduledFor
      );

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/history/content-1/share', {
        platforms: ['facebook'],
        scheduledFor,
      });
      expect(result).toEqual(mockResult);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.post as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.shareContent(
        'content-1',
        ['instagram']
      );

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/history/content-1/share', {
        platforms: ['instagram'],
        scheduledFor: undefined,
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('shares');
      expect(result.shares[0]).toHaveProperty('platform', 'instagram');
    });
  });

  describe('getContentPerformanceMetrics', () => {
    it('should fetch content performance metrics successfully', async () => {
      // Mock API response
      const mockMetrics = {
        views: [
          { date: '2025-01-01', count: 50 },
          { date: '2025-01-02', count: 75 },
        ],
        engagement: [
          { date: '2025-01-01', count: 20 },
          { date: '2025-01-02', count: 30 },
        ],
        conversions: [
          { date: '2025-01-01', count: 5 },
          { date: '2025-01-02', count: 10 },
        ],
        totalViews: 125,
        totalEngagement: 50,
        totalConversions: 15,
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockMetrics });

      // Call the service
      const result = await contentHistoryService.getContentPerformanceMetrics('content-1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1/metrics', {
        params: { dateRange: undefined },
      });
      expect(result).toEqual(mockMetrics);
    });

    it('should apply date range filter correctly', async () => {
      // Mock date range
      const dateRange = {
        start: '2025-01-01',
        end: '2025-01-07',
      };
      
      // Mock API response
      const mockMetrics = {
        views: [],
        engagement: [],
        conversions: [],
        totalViews: 0,
        totalEngagement: 0,
        totalConversions: 0,
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockMetrics });

      // Call the service
      const result = await contentHistoryService.getContentPerformanceMetrics('content-1', dateRange);

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1/metrics', {
        params: { dateRange },
      });
      expect(result).toEqual(mockMetrics);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentHistoryService.getContentPerformanceMetrics('content-1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/history/content-1/metrics', {
        params: { dateRange: undefined },
      });
      expect(result).toHaveProperty('views');
      expect(result).toHaveProperty('engagement');
      expect(result).toHaveProperty('conversions');
      expect(result).toHaveProperty('totalViews');
      expect(result).toHaveProperty('totalEngagement');
      expect(result).toHaveProperty('totalConversions');
    });
  });
});
