import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface ContentItem {
  id?: string;
  title: string;
  body: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: string;
  author: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface Tag {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface MediaItem {
  id?: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  description?: string;
  altText?: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  createdAt?: string;
  updatedAt?: string;
}

interface ContentState {
  items: ContentItem[];
  categories: Category[];
  tags: Tag[];
  media: MediaItem[];
  selectedItem: ContentItem | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  categories: [],
  tags: [],
  media: [],
  selectedItem: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/content');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'content/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/content/categories');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchTags = createAsyncThunk(
  'content/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/content/tags');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tags');
    }
  }
);

export const fetchMedia = createAsyncThunk(
  'content/fetchMedia',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/content/media');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch media');
    }
  }
);

export const createContent = createAsyncThunk(
  'content/createContent',
  async (content: Omit<ContentItem, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/content', content);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create content');
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async (content: ContentItem, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/content/${content.id}`, content);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update content');
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/content/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete content');
    }
  }
);

export const uploadMedia = createAsyncThunk(
  'content/uploadMedia',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/content/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload media');
    }
  }
);

// Slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addContent: (state, action: PayloadAction<ContentItem>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchContent
      .addCase(fetchContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchTags
      .addCase(fetchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchMedia
      .addCase(fetchMedia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createContent
      .addCase(createContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateContent
      .addCase(updateContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?.id === action.payload.id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // deleteContent
      .addCase(deleteContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // uploadMedia
      .addCase(uploadMedia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media.push(action.payload);
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedItem, clearError, addContent } = contentSlice.actions;
export default contentSlice.reducer;