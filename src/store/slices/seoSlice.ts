import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface MetaTag {
  id?: string;
  url: string;
  title: string;
  description: string;
  keywords?: string;
}

export interface SchemaMarkup {
  id?: string;
  url: string;
  type: string;
  data: Record<string, any>;
}

export interface SitemapConfig {
  id?: string;
  url: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export interface KeywordData {
  id?: string;
  keyword: string;
  volume: number;
  difficulty: number;
  position?: number;
  change?: number;
}

interface SeoState {
  metaTags: MetaTag[];
  schemaMarkups: SchemaMarkup[];
  sitemapConfig: SitemapConfig[];
  keywords: KeywordData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SeoState = {
  metaTags: [],
  schemaMarkups: [],
  sitemapConfig: [],
  keywords: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchMetaTags = createAsyncThunk(
  'seo/fetchMetaTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/seo/meta-tags');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meta tags');
    }
  }
);

export const saveMetaTag = createAsyncThunk(
  'seo/saveMetaTag',
  async (metaTag: MetaTag, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/seo/meta-tags', metaTag);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save meta tag');
    }
  }
);

export const generateSitemap = createAsyncThunk(
  'seo/generateSitemap',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/seo/generate-sitemap');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate sitemap');
    }
  }
);

export const saveSchemaMarkup = createAsyncThunk(
  'seo/saveSchemaMarkup',
  async (schema: SchemaMarkup, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/seo/schema-markup', schema);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save schema markup');
    }
  }
);

export const fetchKeywords = createAsyncThunk(
  'seo/fetchKeywords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/seo/keywords');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch keywords');
    }
  }
);

// Slice
const seoSlice = createSlice({
  name: 'seo',
  initialState,
  reducers: {
    setMetaTags: (state, action: PayloadAction<MetaTag[]>) => {
      state.metaTags = action.payload;
    },
    setSchemaMarkups: (state, action: PayloadAction<SchemaMarkup[]>) => {
      state.schemaMarkups = action.payload;
    },
    setSitemapConfig: (state, action: PayloadAction<SitemapConfig[]>) => {
      state.sitemapConfig = action.payload;
    },
    setKeywords: (state, action: PayloadAction<KeywordData[]>) => {
      state.keywords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMetaTags
      .addCase(fetchMetaTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMetaTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metaTags = action.payload;
      })
      .addCase(fetchMetaTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // saveMetaTag
      .addCase(saveMetaTag.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveMetaTag.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.metaTags.findIndex(tag => tag.url === action.payload.url);
        if (index !== -1) {
          state.metaTags[index] = action.payload;
        } else {
          state.metaTags.push(action.payload);
        }
      })
      .addCase(saveMetaTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // generateSitemap
      .addCase(generateSitemap.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateSitemap.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(generateSitemap.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // saveSchemaMarkup
      .addCase(saveSchemaMarkup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSchemaMarkup.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.schemaMarkups.findIndex(schema => schema.url === action.payload.url);
        if (index !== -1) {
          state.schemaMarkups[index] = action.payload;
        } else {
          state.schemaMarkups.push(action.payload);
        }
      })
      .addCase(saveSchemaMarkup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchKeywords
      .addCase(fetchKeywords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.keywords = action.payload;
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMetaTags, setSchemaMarkups, setSitemapConfig, setKeywords } = seoSlice.actions;
export default seoSlice.reducer;