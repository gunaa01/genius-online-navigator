import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface SocialPost {
  id: string;
  content: string;
  media: {
    id: string;
    type: 'image' | 'video' | 'carousel';
    url: string;
    altText?: string;
  }[];
  platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok')[];
  scheduledDate: string | null;
  publishedDate: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  performance?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    engagement: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
  name: string;
  profileUrl: string;
  profileImage: string;
  isConnected: boolean;
  lastSynced: string | null;
}

interface SocialMediaState {
  posts: SocialPost[];
  accounts: SocialAccount[];
  selectedPost: SocialPost | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    platform: string | null;
    status: string | null;
    dateRange: [string, string] | null;
    tags: string[];
  };
  sort: {
    field: keyof SocialPost | 'performance.engagement';
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: SocialMediaState = {
  posts: [],
  accounts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  filters: {
    platform: null,
    status: null,
    dateRange: null,
    tags: [],
  },
  sort: {
    field: 'scheduledDate',
    direction: 'desc',
  },
};

// Mock data for development
const mockPosts: SocialPost[] = [
  {
    id: '1',
    content: 'Check out our summer collection! 🌞 #SummerVibes #NewCollection',
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://example.com/images/summer-collection-1.jpg',
        altText: 'Model wearing summer dress',
      },
      {
        id: 'm2',
        type: 'image',
        url: 'https://example.com/images/summer-collection-2.jpg',
        altText: 'Model wearing summer hat',
      },
    ],
    platforms: ['instagram', 'facebook'],
    scheduledDate: '2025-06-15T10:00:00Z',
    publishedDate: null,
    status: 'scheduled',
    tags: ['summer', 'fashion', 'collection'],
    createdAt: '2025-06-10T14:30:00Z',
    updatedAt: '2025-06-10T15:45:00Z',
  },
  {
    id: '2',
    content: 'Our new product just launched! RT to win a free sample. #ProductLaunch',
    media: [
      {
        id: 'm3',
        type: 'video',
        url: 'https://example.com/videos/product-launch.mp4',
      },
    ],
    platforms: ['twitter', 'linkedin'],
    scheduledDate: '2025-06-01T08:00:00Z',
    publishedDate: '2025-06-01T08:00:00Z',
    status: 'published',
    performance: {
      likes: 245,
      comments: 42,
      shares: 78,
      reach: 5600,
      engagement: 6.5,
    },
    tags: ['product', 'launch', 'giveaway'],
    createdAt: '2025-05-25T11:20:00Z',
    updatedAt: '2025-06-01T08:00:00Z',
  },
];

const mockAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'facebook',
    name: 'Brand Official',
    profileUrl: 'https://facebook.com/brandofficial',
    profileImage: 'https://example.com/images/facebook-profile.jpg',
    isConnected: true,
    lastSynced: '2025-06-10T16:00:00Z',
  },
  {
    id: '2',
    platform: 'instagram',
    name: '@brandofficial',
    profileUrl: 'https://instagram.com/brandofficial',
    profileImage: 'https://example.com/images/instagram-profile.jpg',
    isConnected: true,
    lastSynced: '2025-06-10T16:00:00Z',
  },
  {
    id: '3',
    platform: 'twitter',
    name: '@brandofficial',
    profileUrl: 'https://twitter.com/brandofficial',
    profileImage: 'https://example.com/images/twitter-profile.jpg',
    isConnected: true,
    lastSynced: '2025-06-10T16:00:00Z',
  },
  {
    id: '4',
    platform: 'linkedin',
    name: 'Brand Official Inc.',
    profileUrl: 'https://linkedin.com/company/brandofficial',
    profileImage: 'https://example.com/images/linkedin-profile.jpg',
    isConnected: true,
    lastSynced: '2025-06-10T16:00:00Z',
  },
];

// Async thunks
export const fetchPosts = createAsyncThunk(
  'socialMedia/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/social/posts');
      
      // Simulated response with mock data
      const response = { data: mockPosts };
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch posts');
      }
      return rejectWithValue('Failed to fetch posts. Please try again.');
    }
  }
);

export const fetchAccounts = createAsyncThunk(
  'socialMedia/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/social/accounts');
      
      // Simulated response with mock data
      const response = { data: mockAccounts };
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch accounts');
      }
      return rejectWithValue('Failed to fetch accounts. Please try again.');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'socialMedia/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/social/posts/${id}`);
      
      // Simulated response with mock data
      const post = mockPosts.find(p => p.id === id);
      
      if (!post) {
        return rejectWithValue('Post not found');
      }
      
      return post;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch post');
      }
      return rejectWithValue('Failed to fetch post. Please try again.');
    }
  }
);

export const createPost = createAsyncThunk(
  'socialMedia/createPost',
  async (post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt' | 'performance'>, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post('/api/social/posts', post);
      
      // Simulated response
      const newPost: SocialPost = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newPost;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to create post');
      }
      return rejectWithValue('Failed to create post. Please try again.');
    }
  }
);

export const updatePost = createAsyncThunk(
  'socialMedia/updatePost',
  async ({ id, data }: { id: string; data: Partial<SocialPost> }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/social/posts/${id}`, data);
      
      // Simulated response
      const post = mockPosts.find(p => p.id === id);
      
      if (!post) {
        return rejectWithValue('Post not found');
      }
      
      const updatedPost = {
        ...post,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedPost;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update post');
      }
      return rejectWithValue('Failed to update post. Please try again.');
    }
  }
);

export const deletePost = createAsyncThunk(
  'socialMedia/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/social/posts/${id}`);
      
      // Simulated response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete post');
      }
      return rejectWithValue('Failed to delete post. Please try again.');
    }
  }
);

export const schedulePost = createAsyncThunk(
  'socialMedia/schedulePost',
  async ({ id, scheduledDate }: { id: string; scheduledDate: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/social/posts/${id}/schedule`, { scheduledDate });
      
      // Simulated response
      const post = mockPosts.find(p => p.id === id);
      
      if (!post) {
        return rejectWithValue('Post not found');
      }
      
      const updatedPost = {
        ...post,
        scheduledDate,
        status: 'scheduled' as const,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedPost;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to schedule post');
      }
      return rejectWithValue('Failed to schedule post. Please try again.');
    }
  }
);

export const publishPost = createAsyncThunk(
  'socialMedia/publishPost',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/social/posts/${id}/publish`);
      
      // Simulated response
      const post = mockPosts.find(p => p.id === id);
      
      if (!post) {
        return rejectWithValue('Post not found');
      }
      
      const now = new Date().toISOString();
      
      const updatedPost = {
        ...post,
        publishedDate: now,
        status: 'published' as const,
        updatedAt: now,
        performance: {
          likes: 0,
          comments: 0,
          shares: 0,
          reach: 0,
          engagement: 0,
        },
      };
      
      return updatedPost;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to publish post');
      }
      return rejectWithValue('Failed to publish post. Please try again.');
    }
  }
);

export const connectAccount = createAsyncThunk(
  'socialMedia/connectAccount',
  async (platform: SocialAccount['platform'], { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to initiate OAuth flow
      // const response = await axios.post('/api/social/accounts/connect', { platform });
      
      // Simulated response
      const account = mockAccounts.find(a => a.platform === platform);
      
      if (!account) {
        return rejectWithValue('Account not found');
      }
      
      const updatedAccount = {
        ...account,
        isConnected: true,
        lastSynced: new Date().toISOString(),
      };
      
      return updatedAccount;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to connect account');
      }
      return rejectWithValue('Failed to connect account. Please try again.');
    }
  }
);

export const disconnectAccount = createAsyncThunk(
  'socialMedia/disconnectAccount',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // await axios.post(`/api/social/accounts/${id}/disconnect`);
      
      // Simulated response
      const account = mockAccounts.find(a => a.id === id);
      
      if (!account) {
        return rejectWithValue('Account not found');
      }
      
      const updatedAccount = {
        ...account,
        isConnected: false,
        lastSynced: null,
      };
      
      return updatedAccount;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to disconnect account');
      }
      return rejectWithValue('Failed to disconnect account. Please try again.');
    }
  }
);

// Slice
const socialMediaSlice = createSlice({
  name: 'socialMedia',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<SocialPost | null>) => {
      state.selectedPost = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SocialMediaState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSort: (state, action: PayloadAction<SocialMediaState['sort']>) => {
      state.sort = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.filters.tags.includes(action.payload)) {
        state.filters.tags.push(action.payload);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.filters.tags = state.filters.tags.filter(tag => tag !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Post By Id
    builder
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Create Post
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.push(action.payload);
        state.selectedPost = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Update Post
    builder
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Delete Post
    builder
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(p => p.id !== action.payload);
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Schedule Post
    builder
      .addCase(schedulePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(schedulePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(schedulePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Publish Post
    builder
      .addCase(publishPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(publishPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Connect Account
    builder
      .addCase(connectAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.accounts.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(connectAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Disconnect Account
    builder
      .addCase(disconnectAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disconnectAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.accounts.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(disconnectAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedPost,
  setFilters,
  resetFilters,
  setSort,
  resetError,
  addTag,
  removeTag,
} = socialMediaSlice.actions;

export default socialMediaSlice.reducer;
