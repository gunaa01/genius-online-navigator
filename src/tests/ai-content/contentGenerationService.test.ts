import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('Content Generation Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getContentTemplates', () => {
    it('should fetch content templates successfully', async () => {
      // Mock API response
      const mockTemplates = [
        { id: '1', name: 'Template 1', description: 'Description 1', type: 'blog' },
        { id: '2', name: 'Template 2', description: 'Description 2', type: 'social' },
      ];
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockTemplates });

      // Call the service
      const result = await contentGenerationService.getContentTemplates();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/templates');
      expect(result).toEqual(mockTemplates);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentGenerationService.getContentTemplates();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/templates');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getContentTemplate', () => {
    it('should fetch a specific content template successfully', async () => {
      // Mock API response
      const mockTemplate = {
        id: '1',
        name: 'Template 1',
        description: 'Description 1',
        type: 'blog',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'keywords', type: 'tags', required: false },
        ],
      };
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockTemplate });

      // Call the service
      const result = await contentGenerationService.getContentTemplate('1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/templates/1');
      expect(result).toEqual(mockTemplate);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentGenerationService.getContentTemplate('1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/templates/1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('fields');
    });
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      // Mock API response
      const mockGeneratedContent = {
        id: 'gen-1',
        title: 'Generated Title',
        content: 'Generated content text',
        seoScore: 85,
        readabilityScore: 90,
        hashtags: ['#test', '#content'],
      };
      
      (enhancedApiClient.post as any).mockResolvedValueOnce({ data: mockGeneratedContent });

      // Call the service
      const params = {
        templateId: '1',
        inputs: { title: 'Test', keywords: 'test, content' },
        brandVoiceId: 'bv-1',
        toneAttributes: ['professional', 'friendly'],
        seoKeywords: ['test', 'content'],
      };
      
      const result = await contentGenerationService.generateContent(params);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/generate', params);
      expect(result).toEqual(mockGeneratedContent);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.post as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const params = {
        templateId: '1',
        inputs: { title: 'Test', keywords: 'test, content' },
        brandVoiceId: 'bv-1',
        toneAttributes: ['professional', 'friendly'],
        seoKeywords: ['test', 'content'],
      };
      
      const result = await contentGenerationService.generateContent(params);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/generate', params);
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('seoScore');
    });
  });

  describe('getBrandVoiceProfiles', () => {
    it('should fetch brand voice profiles successfully', async () => {
      // Mock API response
      const mockProfiles = [
        { 
          id: '1', 
          name: 'Profile 1', 
          description: 'Description 1',
          style: 'casual',
          toneAttributes: ['friendly', 'conversational'],
          values: ['authenticity', 'simplicity'],
          prohibitedWords: ['jargon', 'complex'],
          exampleContent: ['Example 1', 'Example 2'],
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];
      
      (enhancedApiClient.get as any).mockResolvedValueOnce({ data: mockProfiles });

      // Call the service
      const result = await contentGenerationService.getBrandVoiceProfiles();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/brand-voice');
      expect(result).toEqual(mockProfiles);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.get as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentGenerationService.getBrandVoiceProfiles();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai-content/brand-voice');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('toneAttributes');
    });
  });

  describe('createBrandVoiceProfile', () => {
    it('should create a brand voice profile successfully', async () => {
      // Mock profile data
      const profileData = {
        name: 'New Profile',
        description: 'New Description',
        style: 'professional',
        toneAttributes: ['authoritative', 'clear'],
        values: ['expertise', 'trust'],
        prohibitedWords: ['slang', 'jargon'],
        exampleContent: ['Example content'],
      };
      
      // Mock API response
      const mockCreatedProfile = {
        ...profileData,
        id: 'new-1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      
      (enhancedApiClient.post as any).mockResolvedValueOnce({ data: mockCreatedProfile });

      // Call the service
      const result = await contentGenerationService.createBrandVoiceProfile(profileData);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/brand-voice', profileData);
      expect(result).toEqual(mockCreatedProfile);
    });

    it('should return mock data when API fails', async () => {
      // Mock profile data
      const profileData = {
        name: 'New Profile',
        description: 'New Description',
        style: 'professional',
        toneAttributes: ['authoritative', 'clear'],
        values: ['expertise', 'trust'],
        prohibitedWords: ['slang', 'jargon'],
        exampleContent: ['Example content'],
      };
      
      // Mock API error
      (enhancedApiClient.post as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentGenerationService.createBrandVoiceProfile(profileData);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/brand-voice', profileData);
      expect(result).toHaveProperty('id');
      expect(result.name).toEqual(profileData.name);
      expect(result.description).toEqual(profileData.description);
    });
  });

  describe('analyzeBrandVoiceConsistency', () => {
    it('should analyze brand voice consistency successfully', async () => {
      // Mock API response
      const mockAnalysisResult = {
        score: 85,
        matchedAttributes: ['professional', 'clear'],
        unmatchedAttributes: ['friendly'],
        prohibitedWords: [{ word: 'jargon', index: 10 }],
        suggestions: ['Consider using more conversational language'],
      };
      
      (enhancedApiClient.post as any).mockResolvedValueOnce({ data: mockAnalysisResult });

      // Call the service
      const result = await contentGenerationService.analyzeBrandVoiceConsistency('Sample content', 'bv-1');

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/brand-voice/analyze', {
        content: 'Sample content',
        brandVoiceId: 'bv-1',
      });
      expect(result).toEqual(mockAnalysisResult);
    });

    it('should return mock data when API fails', async () => {
      // Mock API error
      (enhancedApiClient.post as any).mockRejectedValueOnce(new Error('API error'));

      // Call the service
      const result = await contentGenerationService.analyzeBrandVoiceConsistency('Sample content', 'bv-1');

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/ai-content/brand-voice/analyze', {
        content: 'Sample content',
        brandVoiceId: 'bv-1',
      });
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('matchedAttributes');
      expect(result).toHaveProperty('suggestions');
    });
  });
});
