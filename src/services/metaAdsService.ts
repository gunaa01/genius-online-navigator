
/**
 * Meta Ads Service
 * Manages Facebook and Instagram ad campaigns through the Meta API
 */

import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

// Campaign Status Types
export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED' | 'DRAFT';

// Ad Set Status Types
export type AdSetStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED' | 'DRAFT';

// Ad Status Types
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED' | 'DRAFT';

// Campaign Interface
export interface MetaCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  objective: string;
  spendCap?: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startDate: string;
  endDate?: string;
  insights?: CampaignInsights;
}

// Ad Set Interface
export interface MetaAdSet {
  id: string;
  campaignId: string;
  name: string;
  status: AdSetStatus;
  targetingSpec: {
    age_min?: number;
    age_max?: number;
    genders?: number[];
    geo_locations?: {
      countries?: string[];
      cities?: { key: string; radius: number; distance_unit: string }[];
    };
    interests?: { id: string; name: string }[];
    behaviors?: { id: string; name: string }[];
    excluded_interests?: { id: string; name: string }[];
  };
  bidStrategy: 'LOWEST_COST' | 'TARGET_COST';
  billingEvent: 'IMPRESSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS' | 'POST_ENGAGEMENT';
  optimization_goal: 'REACH' | 'CLICKS' | 'CONVERSIONS' | 'APP_INSTALLS';
  budget?: number;
  insights?: AdSetInsights;
}

// Ad Interface
export interface MetaAd {
  id: string;
  adSetId: string;
  name: string;
  status: AdStatus;
  creative: {
    title?: string;
    body?: string;
    imageUrl?: string;
    videoUrl?: string;
    callToAction?: string;
    linkUrl?: string;
  };
  insights?: AdInsights;
}

// Campaign Insights
export interface CampaignInsights {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  reach: number;
  frequency: number;
  costPerResult: number;
}

// Ad Set Insights
export interface AdSetInsights {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

// Ad Insights
export interface AdInsights {
  impressions: number;
  clicks: number;
  ctr: number;
  costPerClick: number;
  reach: number;
  engagements: number;
}

/**
 * Meta Ads Service Implementation
 */
export class MetaAdsService {
  private static instance: MetaAdsService;
  private accessToken: string | null = null;
  private adAccountId: string | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): MetaAdsService {
    if (!MetaAdsService.instance) {
      MetaAdsService.instance = new MetaAdsService();
    }
    return MetaAdsService.instance;
  }

  /**
   * Initialize with access token and ad account ID
   */
  public init(accessToken: string, adAccountId: string): void {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;
    console.log('Meta Ads Service initialized');
  }

  /**
   * Get all campaigns for the ad account
   */
  public async getCampaigns(
    status?: CampaignStatus | CampaignStatus[]
  ): Promise<MetaCampaign[]> {
    try {
      // In a real implementation, this would call the Meta Ads API
      const response = await enhancedApiClient.get('/meta-ads/campaigns', {
        params: { status, access_token: this.accessToken, ad_account_id: this.adAccountId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Meta campaigns:', error);
      
      // Return mock data for development
      return mockApiResponse([
        {
          id: 'camp_123456789',
          name: 'Spring Sale 2025',
          status: 'ACTIVE',
          objective: 'CONVERSIONS',
          dailyBudget: 100,
          startDate: '2025-03-15',
          endDate: '2025-04-15',
          insights: {
            spend: 850.25,
            impressions: 125000,
            clicks: 3250,
            ctr: 2.6,
            cpc: 0.26,
            reach: 85000,
            frequency: 1.47,
            costPerResult: 12.5
          }
        },
        {
          id: 'camp_987654321',
          name: 'Product Launch',
          status: 'ACTIVE',
          objective: 'BRAND_AWARENESS',
          lifetimeBudget: 5000,
          startDate: '2025-05-01',
          endDate: '2025-06-01',
          insights: {
            spend: 1200.75,
            impressions: 240000,
            clicks: 5100,
            ctr: 2.125,
            cpc: 0.235,
            reach: 180000,
            frequency: 1.33,
            costPerResult: 0.06
          }
        },
        {
          id: 'camp_456789123',
          name: 'Retargeting Campaign',
          status: 'PAUSED',
          objective: 'LINK_CLICKS',
          dailyBudget: 50,
          startDate: '2025-02-01',
          insights: {
            spend: 320.50,
            impressions: 45000,
            clicks: 1850,
            ctr: 4.11,
            cpc: 0.17,
            reach: 22000,
            frequency: 2.04,
            costPerResult: 0.17
          }
        }
      ]);
    }
  }

  /**
   * Create a new campaign
   */
  public async createCampaign(campaign: Omit<MetaCampaign, 'id'>): Promise<MetaCampaign> {
    try {
      const response = await enhancedApiClient.post('/meta-ads/campaigns', {
        ...campaign,
        access_token: this.accessToken,
        ad_account_id: this.adAccountId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Meta campaign:', error);
      throw error;
    }
  }

  /**
   * Update a campaign
   */
  public async updateCampaign(
    campaignId: string,
    campaignData: Partial<Omit<MetaCampaign, 'id'>>
  ): Promise<MetaCampaign> {
    try {
      const response = await enhancedApiClient.put(`/meta-ads/campaigns/${campaignId}`, {
        ...campaignData,
        access_token: this.accessToken,
        ad_account_id: this.adAccountId
      });
      return response.data;
    } catch (error) {
      console.error('Error updating Meta campaign:', error);
      throw error;
    }
  }

  /**
   * Get ad sets for a campaign
   */
  public async getAdSets(campaignId: string): Promise<MetaAdSet[]> {
    try {
      const response = await enhancedApiClient.get(`/meta-ads/campaigns/${campaignId}/adsets`, {
        params: { access_token: this.accessToken, ad_account_id: this.adAccountId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Meta ad sets:', error);
      
      // Return mock data for development
      return mockApiResponse([
        {
          id: 'adset_123456',
          campaignId: campaignId,
          name: 'US Adults 25-45',
          status: 'ACTIVE',
          targetingSpec: {
            age_min: 25,
            age_max: 45,
            genders: [1, 2],
            geo_locations: {
              countries: ['US']
            },
            interests: [
              { id: '6003139266461', name: 'Online shopping' },
              { id: '6003139268461', name: 'E-commerce' }
            ]
          },
          bidStrategy: 'LOWEST_COST',
          billingEvent: 'LINK_CLICKS',
          optimization_goal: 'CONVERSIONS',
          budget: 50,
          insights: {
            spend: 320.50,
            impressions: 45000,
            clicks: 1850,
            ctr: 4.11,
            cpc: 0.17
          }
        },
        {
          id: 'adset_654321',
          campaignId: campaignId,
          name: 'UK Fashion Enthusiasts',
          status: 'ACTIVE',
          targetingSpec: {
            age_min: 18,
            age_max: 35,
            genders: [2],
            geo_locations: {
              countries: ['GB']
            },
            interests: [
              { id: '6003107836461', name: 'Fashion' },
              { id: '6003107296461', name: 'Shopping' }
            ]
          },
          bidStrategy: 'LOWEST_COST',
          billingEvent: 'IMPRESSIONS',
          optimization_goal: 'REACH',
          budget: 30,
          insights: {
            spend: 180.25,
            impressions: 65000,
            clicks: 950,
            ctr: 1.46,
            cpc: 0.19
          }
        }
      ]);
    }
  }

  /**
   * Get ads for an ad set
   */
  public async getAds(adSetId: string): Promise<MetaAd[]> {
    try {
      const response = await enhancedApiClient.get(`/meta-ads/adsets/${adSetId}/ads`, {
        params: { access_token: this.accessToken, ad_account_id: this.adAccountId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Meta ads:', error);
      
      // Return mock data for development
      return mockApiResponse([
        {
          id: 'ad_123456',
          adSetId: adSetId,
          name: 'Summer Sale Banner',
          status: 'ACTIVE',
          creative: {
            title: 'Summer Sale - Up to 70% Off!',
            body: 'Don\'t miss our biggest sale of the season. Limited time only!',
            imageUrl: 'https://via.placeholder.com/600x400',
            callToAction: 'Shop Now',
            linkUrl: 'https://example.com/summer-sale'
          },
          insights: {
            impressions: 28500,
            clicks: 950,
            ctr: 3.33,
            costPerClick: 0.18,
            reach: 18000,
            engagements: 1200
          }
        },
        {
          id: 'ad_654321',
          adSetId: adSetId,
          name: 'Product Showcase Video',
          status: 'ACTIVE',
          creative: {
            title: 'Introducing Our Latest Collection',
            body: 'Designed for comfort and style. See what makes our products special.',
            videoUrl: 'https://example.com/videos/product-showcase.mp4',
            callToAction: 'Learn More',
            linkUrl: 'https://example.com/collection'
          },
          insights: {
            impressions: 18200,
            clicks: 620,
            ctr: 3.41,
            costPerClick: 0.22,
            reach: 12500,
            engagements: 850
          }
        }
      ]);
    }
  }

  /**
   * Get campaign insights/analytics
   */
  public async getCampaignInsights(
    campaignId: string,
    datePreset: 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'last_30_days' | 'last_90_days'
  ): Promise<CampaignInsights> {
    try {
      const response = await enhancedApiClient.get(`/meta-ads/campaigns/${campaignId}/insights`, {
        params: { 
          date_preset: datePreset,
          access_token: this.accessToken,
          ad_account_id: this.adAccountId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Meta campaign insights:', error);
      
      // Return mock data for development
      return mockApiResponse({
        spend: 1250.75,
        impressions: 220000,
        clicks: 4850,
        ctr: 2.2,
        cpc: 0.26,
        reach: 165000,
        frequency: 1.33,
        costPerResult: 0.68
      });
    }
  }
}

export default MetaAdsService;
