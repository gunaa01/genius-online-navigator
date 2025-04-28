import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Campaign {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'google' | 'linkedin' | 'twitter' | 'tiktok';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  audience: {
    age: [number, number];
    gender: 'male' | 'female' | 'all';
    location: string[];
    interests: string[];
  };
  creatives: {
    id: string;
    type: 'image' | 'video' | 'carousel';
    url: string;
    title?: string;
    description?: string;
  }[];
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface AdCampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    platform: string | null;
    status: string | null;
    dateRange: [string, string] | null;
  };
  sort: {
    field: keyof Campaign | 'performance.roas' | 'performance.ctr';
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: AdCampaignState = {
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,
  filters: {
    platform: null,
    status: null,
    dateRange: null,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
};

// Mock data for development
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    platform: 'facebook',
    status: 'active',
    budget: 5000,
    spent: 2300,
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-06-30T23:59:59Z',
    audience: {
      age: [18, 35],
      gender: 'all',
      location: ['New York', 'Los Angeles', 'Chicago'],
      interests: ['Fashion', 'Shopping', 'Lifestyle'],
    },
    creatives: [
      {
        id: 'c1',
        type: 'image',
        url: 'https://example.com/images/summer-sale-1.jpg',
        title: 'Summer Sale - Up to 50% Off',
        description: 'Get the hottest deals this summer on all your favorite items!',
      },
      {
        id: 'c2',
        type: 'video',
        url: 'https://example.com/videos/summer-sale-promo.mp4',
        title: 'Summer Collection Preview',
      },
    ],
    performance: {
      impressions: 45000,
      clicks: 3200,
      conversions: 320,
      ctr: 7.11,
      cpc: 0.72,
      roas: 4.2,
    },
    createdAt: '2025-05-15T10:30:00Z',
    updatedAt: '2025-06-10T14:45:00Z',
  },
  {
    id: '2',
    name: 'New Product Launch',
    platform: 'instagram',
    status: 'active',
    budget: 8000,
    spent: 3500,
    startDate: '2025-05-15T00:00:00Z',
    endDate: '2025-07-15T23:59:59Z',
    audience: {
      age: [25, 45],
      gender: 'all',
      location: ['San Francisco', 'Seattle', 'Austin'],
      interests: ['Technology', 'Gadgets', 'Innovation'],
    },
    creatives: [
      {
        id: 'c3',
        type: 'carousel',
        url: 'https://example.com/images/product-launch-carousel.jpg',
        title: 'Introducing Our Revolutionary Product',
        description: 'Experience the future today with our latest innovation.',
      },
    ],
    performance: {
      impressions: 78000,
      clicks: 5600,
      conversions: 480,
      ctr: 7.18,
      cpc: 0.63,
      roas: 5.1,
    },
    createdAt: '2025-05-01T09:15:00Z',
    updatedAt: '2025-06-12T11:20:00Z',
  },
];

// Async thunks
export const fetchCampaigns = createAsyncThunk(
  'adCampaign/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/campaigns');
      
      // Simulated response with mock data
      const response = { data: mockCampaigns };
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch campaigns');
      }
      return rejectWithValue('Failed to fetch campaigns. Please try again.');
    }
  }
);

export const fetchCampaignById = createAsyncThunk(
  'adCampaign/fetchCampaignById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/campaigns/${id}`);
      
      // Simulated response with mock data
      const campaign = mockCampaigns.find(c => c.id === id);
      
      if (!campaign) {
        return rejectWithValue('Campaign not found');
      }
      
      return campaign;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch campaign');
      }
      return rejectWithValue('Failed to fetch campaign. Please try again.');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'adCampaign/createCampaign',
  async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'performance' | 'spent'>, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post('/api/campaigns', campaign);
      
      // Simulated response
      const newCampaign: Campaign = {
        ...campaign,
        id: Date.now().toString(),
        spent: 0,
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
          roas: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newCampaign;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to create campaign');
      }
      return rejectWithValue('Failed to create campaign. Please try again.');
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'adCampaign/updateCampaign',
  async ({ id, data }: { id: string; data: Partial<Campaign> }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/campaigns/${id}`, data);
      
      // Simulated response
      const updatedCampaign = {
        ...mockCampaigns.find(c => c.id === id),
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      if (!updatedCampaign) {
        return rejectWithValue('Campaign not found');
      }
      
      return updatedCampaign;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update campaign');
      }
      return rejectWithValue('Failed to update campaign. Please try again.');
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'adCampaign/deleteCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/campaigns/${id}`);
      
      // Simulated response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete campaign');
      }
      return rejectWithValue('Failed to delete campaign. Please try again.');
    }
  }
);

// Slice
const adCampaignSlice = createSlice({
  name: 'adCampaign',
  initialState,
  reducers: {
    setSelectedCampaign: (state, action: PayloadAction<Campaign | null>) => {
      state.selectedCampaign = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AdCampaignState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSort: (state, action: PayloadAction<AdCampaignState['sort']>) => {
      state.sort = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Campaign By Id
    builder
      .addCase(fetchCampaignById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Create Campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.push(action.payload);
        state.selectedCampaign = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Update Campaign
    builder
      .addCase(updateCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.selectedCampaign?.id === action.payload.id) {
          state.selectedCampaign = action.payload;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Delete Campaign
    builder
      .addCase(deleteCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
        if (state.selectedCampaign?.id === action.payload) {
          state.selectedCampaign = null;
        }
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCampaign, setFilters, resetFilters, setSort, resetError } = adCampaignSlice.actions;

export default adCampaignSlice.reducer;
