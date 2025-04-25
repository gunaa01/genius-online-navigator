import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface AnalyticsData {
  id: string;
  dateRange: {
    start: string;
    end: string;
  };
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
  };
  trafficSources: {
    source: string;
    visitors: number;
    percentage: number;
  }[];
  pagePerformance: {
    path: string;
    pageViews: number;
    uniquePageViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
  }[];
  deviceData: {
    device: 'desktop' | 'mobile' | 'tablet';
    sessions: number;
    percentage: number;
  }[];
  geographicData: {
    country: string;
    visitors: number;
    percentage: number;
  }[];
  conversionData: {
    goal: string;
    completions: number;
    conversionRate: number;
    value: number;
  }[];
  socialMediaPerformance: {
    platform: string;
    followers: number;
    engagement: number;
    clicks: number;
    impressions: number;
  }[];
  adPerformance: {
    campaign: string;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    cost: number;
    cpc: number;
    roas: number;
  }[];
  createdAt: string;
}

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  activeDateRange: '7d' | '30d' | '90d' | 'custom';
  customDateRange: {
    start: string | null;
    end: string | null;
  };
  activeMetrics: string[];
  comparisonMode: boolean;
  comparisonData: AnalyticsData | null;
  isLoadingComparison: boolean;
}

// Initial state
const initialState: AnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
  activeDateRange: '30d',
  customDateRange: {
    start: null,
    end: null,
  },
  activeMetrics: ['visitors', 'pageViews', 'conversionRate', 'bounceRate'],
  comparisonMode: false,
  comparisonData: null,
  isLoadingComparison: false,
};

// Mock data for development
const generateMockAnalyticsData = (dateRange: { start: string; end: string }): AnalyticsData => {
  return {
    id: Date.now().toString(),
    dateRange,
    overview: {
      totalVisitors: Math.floor(Math.random() * 50000) + 10000,
      uniqueVisitors: Math.floor(Math.random() * 40000) + 8000,
      pageViews: Math.floor(Math.random() * 150000) + 30000,
      bounceRate: Math.random() * 70 + 20,
      avgSessionDuration: Math.floor(Math.random() * 180) + 60,
      conversionRate: Math.random() * 10 + 1,
    },
    trafficSources: [
      {
        source: 'Organic Search',
        visitors: Math.floor(Math.random() * 20000) + 5000,
        percentage: Math.random() * 50 + 20,
      },
      {
        source: 'Direct',
        visitors: Math.floor(Math.random() * 15000) + 3000,
        percentage: Math.random() * 30 + 10,
      },
      {
        source: 'Social',
        visitors: Math.floor(Math.random() * 10000) + 2000,
        percentage: Math.random() * 20 + 5,
      },
      {
        source: 'Referral',
        visitors: Math.floor(Math.random() * 8000) + 1000,
        percentage: Math.random() * 15 + 5,
      },
      {
        source: 'Paid Search',
        visitors: Math.floor(Math.random() * 5000) + 1000,
        percentage: Math.random() * 10 + 2,
      },
    ],
    pagePerformance: [
      {
        path: '/',
        pageViews: Math.floor(Math.random() * 30000) + 10000,
        uniquePageViews: Math.floor(Math.random() * 25000) + 8000,
        avgTimeOnPage: Math.floor(Math.random() * 120) + 30,
        bounceRate: Math.random() * 60 + 20,
        exitRate: Math.random() * 50 + 10,
      },
      {
        path: '/products',
        pageViews: Math.floor(Math.random() * 20000) + 5000,
        uniquePageViews: Math.floor(Math.random() * 18000) + 4000,
        avgTimeOnPage: Math.floor(Math.random() * 180) + 60,
        bounceRate: Math.random() * 40 + 10,
        exitRate: Math.random() * 30 + 5,
      },
      {
        path: '/blog',
        pageViews: Math.floor(Math.random() * 15000) + 3000,
        uniquePageViews: Math.floor(Math.random() * 12000) + 2500,
        avgTimeOnPage: Math.floor(Math.random() * 240) + 120,
        bounceRate: Math.random() * 30 + 5,
        exitRate: Math.random() * 20 + 5,
      },
      {
        path: '/contact',
        pageViews: Math.floor(Math.random() * 8000) + 2000,
        uniquePageViews: Math.floor(Math.random() * 7000) + 1800,
        avgTimeOnPage: Math.floor(Math.random() * 90) + 30,
        bounceRate: Math.random() * 70 + 20,
        exitRate: Math.random() * 60 + 30,
      },
      {
        path: '/about',
        pageViews: Math.floor(Math.random() * 6000) + 1500,
        uniquePageViews: Math.floor(Math.random() * 5500) + 1200,
        avgTimeOnPage: Math.floor(Math.random() * 150) + 60,
        bounceRate: Math.random() * 50 + 15,
        exitRate: Math.random() * 40 + 10,
      },
    ],
    deviceData: [
      {
        device: 'desktop',
        sessions: Math.floor(Math.random() * 30000) + 10000,
        percentage: Math.random() * 60 + 30,
      },
      {
        device: 'mobile',
        sessions: Math.floor(Math.random() * 25000) + 8000,
        percentage: Math.random() * 50 + 20,
      },
      {
        device: 'tablet',
        sessions: Math.floor(Math.random() * 5000) + 1000,
        percentage: Math.random() * 15 + 5,
      },
    ],
    geographicData: [
      {
        country: 'United States',
        visitors: Math.floor(Math.random() * 20000) + 5000,
        percentage: Math.random() * 40 + 20,
      },
      {
        country: 'United Kingdom',
        visitors: Math.floor(Math.random() * 8000) + 2000,
        percentage: Math.random() * 15 + 5,
      },
      {
        country: 'Canada',
        visitors: Math.floor(Math.random() * 6000) + 1500,
        percentage: Math.random() * 12 + 3,
      },
      {
        country: 'Australia',
        visitors: Math.floor(Math.random() * 5000) + 1000,
        percentage: Math.random() * 10 + 2,
      },
      {
        country: 'Germany',
        visitors: Math.floor(Math.random() * 4000) + 800,
        percentage: Math.random() * 8 + 1,
      },
    ],
    conversionData: [
      {
        goal: 'Purchase',
        completions: Math.floor(Math.random() * 2000) + 500,
        conversionRate: Math.random() * 5 + 1,
        value: Math.floor(Math.random() * 50000) + 10000,
      },
      {
        goal: 'Email Signup',
        completions: Math.floor(Math.random() * 5000) + 1000,
        conversionRate: Math.random() * 10 + 2,
        value: Math.floor(Math.random() * 10000) + 2000,
      },
      {
        goal: 'Contact Form',
        completions: Math.floor(Math.random() * 1500) + 300,
        conversionRate: Math.random() * 3 + 0.5,
        value: Math.floor(Math.random() * 7500) + 1500,
      },
    ],
    socialMediaPerformance: [
      {
        platform: 'Facebook',
        followers: Math.floor(Math.random() * 50000) + 10000,
        engagement: Math.random() * 5 + 1,
        clicks: Math.floor(Math.random() * 8000) + 2000,
        impressions: Math.floor(Math.random() * 100000) + 20000,
      },
      {
        platform: 'Instagram',
        followers: Math.floor(Math.random() * 40000) + 8000,
        engagement: Math.random() * 8 + 2,
        clicks: Math.floor(Math.random() * 6000) + 1500,
        impressions: Math.floor(Math.random() * 80000) + 15000,
      },
      {
        platform: 'Twitter',
        followers: Math.floor(Math.random() * 30000) + 5000,
        engagement: Math.random() * 3 + 0.5,
        clicks: Math.floor(Math.random() * 4000) + 1000,
        impressions: Math.floor(Math.random() * 60000) + 10000,
      },
      {
        platform: 'LinkedIn',
        followers: Math.floor(Math.random() * 20000) + 3000,
        engagement: Math.random() * 2 + 0.5,
        clicks: Math.floor(Math.random() * 3000) + 800,
        impressions: Math.floor(Math.random() * 40000) + 8000,
      },
    ],
    adPerformance: [
      {
        campaign: 'Summer Sale',
        impressions: Math.floor(Math.random() * 100000) + 20000,
        clicks: Math.floor(Math.random() * 8000) + 2000,
        ctr: Math.random() * 8 + 2,
        conversions: Math.floor(Math.random() * 1000) + 200,
        cost: Math.floor(Math.random() * 5000) + 1000,
        cpc: Math.random() * 2 + 0.5,
        roas: Math.random() * 8 + 2,
      },
      {
        campaign: 'New Product Launch',
        impressions: Math.floor(Math.random() * 80000) + 15000,
        clicks: Math.floor(Math.random() * 6000) + 1500,
        ctr: Math.random() * 10 + 3,
        conversions: Math.floor(Math.random() * 800) + 150,
        cost: Math.floor(Math.random() * 4000) + 800,
        cpc: Math.random() * 1.5 + 0.3,
        roas: Math.random() * 10 + 3,
      },
      {
        campaign: 'Brand Awareness',
        impressions: Math.floor(Math.random() * 150000) + 30000,
        clicks: Math.floor(Math.random() * 7000) + 1800,
        ctr: Math.random() * 5 + 1,
        conversions: Math.floor(Math.random() * 500) + 100,
        cost: Math.floor(Math.random() * 3000) + 600,
        cpc: Math.random() * 1 + 0.2,
        roas: Math.random() * 5 + 1,
      },
    ],
    createdAt: new Date().toISOString(),
  };
};

// Async thunks
export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async (
    { dateRange, comparison = false }: { dateRange: '7d' | '30d' | '90d' | 'custom'; comparison?: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      // Get the current state
      const state = getState() as { analytics: AnalyticsState };
      
      // Calculate date range
      let start: string;
      let end: string = new Date().toISOString();
      
      if (dateRange === 'custom' && state.analytics.customDateRange.start && state.analytics.customDateRange.end) {
        start = state.analytics.customDateRange.start;
        end = state.analytics.customDateRange.end;
      } else {
        const now = new Date();
        let daysAgo: number;
        
        switch (dateRange) {
          case '7d':
            daysAgo = 7;
            break;
          case '90d':
            daysAgo = 90;
            break;
          case '30d':
          default:
            daysAgo = 30;
            break;
        }
        
        const startDate = new Date();
        startDate.setDate(now.getDate() - daysAgo);
        start = startDate.toISOString();
      }
      
      // In a real app, this would be an API call
      // const response = await axios.get('/api/analytics', {
      //   params: { start, end },
      // });
      
      // Simulated response with mock data
      const mockData = generateMockAnalyticsData({ start, end });
      
      return { data: mockData, comparison };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch analytics data');
      }
      return rejectWithValue('Failed to fetch analytics data. Please try again.');
    }
  }
);

// Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setActiveDateRange: (state, action: PayloadAction<'7d' | '30d' | '90d' | 'custom'>) => {
      state.activeDateRange = action.payload;
    },
    setCustomDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.customDateRange = action.payload;
    },
    toggleComparisonMode: (state) => {
      state.comparisonMode = !state.comparisonMode;
      if (!state.comparisonMode) {
        state.comparisonData = null;
      }
    },
    setActiveMetrics: (state, action: PayloadAction<string[]>) => {
      state.activeMetrics = action.payload;
    },
    addActiveMetric: (state, action: PayloadAction<string>) => {
      if (!state.activeMetrics.includes(action.payload)) {
        state.activeMetrics.push(action.payload);
      }
    },
    removeActiveMetric: (state, action: PayloadAction<string>) => {
      state.activeMetrics = state.activeMetrics.filter(metric => metric !== action.payload);
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Analytics Data
    builder
      .addCase(fetchAnalyticsData.pending, (state, action) => {
        const { comparison } = action.meta.arg;
        if (comparison) {
          state.isLoadingComparison = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        const { data, comparison } = action.payload;
        if (comparison) {
          state.isLoadingComparison = false;
          state.comparisonData = data;
        } else {
          state.isLoading = false;
          state.data = data;
        }
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        const { comparison } = action.meta.arg;
        if (comparison) {
          state.isLoadingComparison = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveDateRange,
  setCustomDateRange,
  toggleComparisonMode,
  setActiveMetrics,
  addActiveMetric,
  removeActiveMetric,
  resetError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
