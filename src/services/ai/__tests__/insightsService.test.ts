import { enhancedApiClient } from '../../apiClient';
import * as insightsService from '../insightsService';

// Mock the API client
jest.mock('../../apiClient', () => ({
  enhancedApiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn()
  }
}));

describe('insightsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInsightsDashboard', () => {
    it('fetches dashboard data with the correct timeframe', async () => {
      const mockResponse = {
        data: {
          trendingTopics: [],
          actionableInsights: [],
          sentimentAnalysis: {},
          keywordAnalysis: {},
          userSegments: []
        }
      };
      
      (enhancedApiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.getInsightsDashboard('30d');
      
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai/insights/dashboard', { params: { timeframe: '30d' } });
      expect(result).toEqual(mockResponse.data);
    });

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Network Error';
      (enhancedApiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      await expect(insightsService.getInsightsDashboard('30d')).rejects.toThrow(errorMessage);
    });
  });

  describe('getTrendingTopics', () => {
    it('fetches trending topics with correct parameters', async () => {
      const mockResponse = {
        data: [
          { name: 'Topic A', sentiment: 'positive', volume: 10 }
        ]
      };
      
      (enhancedApiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.getTrendingTopics({ timeframe: '30d', category: 'all' });
      
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai/insights/trending-topics', { 
        params: { timeframe: '30d', category: 'all' } 
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getActionableInsights', () => {
    it('fetches actionable insights with correct parameters', async () => {
      const mockResponse = {
        data: [
          { id: 1, title: 'Insight A', status: 'open' }
        ]
      };
      
      (enhancedApiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.getActionableInsights({ status: 'all', priority: 'high' });
      
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai/insights/actionable', { 
        params: { status: 'all', priority: 'high' } 
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateInsightStatus', () => {
    it('updates insight status correctly', async () => {
      const mockResponse = {
        data: { success: true }
      };
      
      (enhancedApiClient.put as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.updateInsightStatus(1, 'in-progress');
      
      expect(enhancedApiClient.put).toHaveBeenCalledWith('/ai/insights/actionable/1/status', { 
        status: 'in-progress' 
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSentimentAnalysis', () => {
    it('fetches sentiment analysis with correct timeframe', async () => {
      const mockResponse = {
        data: {
          timeseries: [],
          overall: 0.75
        }
      };
      
      (enhancedApiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.getSentimentAnalysis('90d');
      
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai/insights/sentiment', { 
        params: { timeframe: '90d' } 
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getKeywordAnalysis', () => {
    it('fetches keyword analysis with correct parameters', async () => {
      const mockResponse = {
        data: {
          topKeywords: [],
          risingKeywords: []
        }
      };
      
      (enhancedApiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.getKeywordAnalysis({ timeframe: '30d', sentiment: 'all' });
      
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai/insights/keywords', { 
        params: { timeframe: '30d', sentiment: 'all' } 
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getUserSegmentInsights', () => {
    it('fetches user segment insights correctly', async () => {
      const mockResponse = {
        data: [
          { segment: 'Power Users', count: 100 }
        ]
      };
      
      (enhancedApiClient.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await insightsService.getUserSegmentInsights();
      
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/ai/insights/user-segments');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
