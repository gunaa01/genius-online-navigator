import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'blog' | 'social' | 'email' | 'ad' | 'product' | 'custom';
  prompt: string;
  parameters: {
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'select' | 'boolean';
    required: boolean;
    options?: string[];
    default?: string | number | boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedContent {
  id: string;
  templateId: string;
  content: string;
  parameters: Record<string, string | number | boolean>;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
  updatedAt: string;
}

interface AiContentState {
  templates: ContentTemplate[];
  generatedContents: GeneratedContent[];
  selectedTemplate: ContentTemplate | null;
  selectedContent: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type: string | null;
    dateRange: [string, string] | null;
  };
  sort: {
    field: keyof ContentTemplate | keyof GeneratedContent;
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: AiContentState = {
  templates: [],
  generatedContents: [],
  selectedTemplate: null,
  selectedContent: null,
  isLoading: false,
  error: null,
  filters: {
    type: null,
    dateRange: null,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
};

// Mock data for development
const mockTemplates: ContentTemplate[] = [
  {
    id: '1',
    name: 'Blog Post - How-To Guide',
    description: 'Generate a comprehensive how-to guide for your blog',
    type: 'blog',
    prompt: 'Create a detailed how-to guide about {topic}. Include {numSteps} steps, each with a clear explanation. The tone should be {tone} and the target audience is {audience}.',
    parameters: [
      {
        id: 'p1',
        name: 'topic',
        description: 'The main topic of the how-to guide',
        type: 'text',
        required: true,
      },
      {
        id: 'p2',
        name: 'numSteps',
        description: 'Number of steps to include',
        type: 'number',
        required: true,
        default: 5,
      },
      {
        id: 'p3',
        name: 'tone',
        description: 'The tone of the content',
        type: 'select',
        options: ['professional', 'casual', 'humorous', 'educational'],
        required: true,
        default: 'professional',
      },
      {
        id: 'p4',
        name: 'audience',
        description: 'The target audience',
        type: 'text',
        required: true,
        default: 'beginners',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Social Media Post - Product Promotion',
    description: 'Generate engaging social media posts to promote your products',
    type: 'social',
    prompt: 'Create a {platform} post promoting {productName}. Highlight the following features: {features}. Include {hashtags} hashtags related to the product. The post should be {tone} in tone.',
    parameters: [
      {
        id: 'p1',
        name: 'platform',
        description: 'Social media platform',
        type: 'select',
        options: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
        required: true,
        default: 'Instagram',
      },
      {
        id: 'p2',
        name: 'productName',
        description: 'Name of the product',
        type: 'text',
        required: true,
      },
      {
        id: 'p3',
        name: 'features',
        description: 'Key features to highlight',
        type: 'text',
        required: true,
      },
      {
        id: 'p4',
        name: 'hashtags',
        description: 'Number of hashtags to include',
        type: 'number',
        required: true,
        default: 5,
      },
      {
        id: 'p5',
        name: 'tone',
        description: 'Tone of the post',
        type: 'select',
        options: ['excited', 'professional', 'casual', 'urgent'],
        required: true,
        default: 'excited',
      },
    ],
    createdAt: '2025-02-20T14:30:00Z',
    updatedAt: '2025-02-20T14:30:00Z',
  },
];

const mockGeneratedContents: GeneratedContent[] = [
  {
    id: '1',
    templateId: '1',
    content: `# How to Master Digital Photography: A Beginner's Guide\n\nDigital photography can seem overwhelming at first, but with the right guidance, you'll be taking stunning photos in no time. This guide will walk you through the essential steps to master digital photography as a beginner.\n\n## Step 1: Understand Your Camera\nBefore you start shooting, take time to familiarize yourself with your camera. Read the manual, learn about the basic settings like aperture, shutter speed, and ISO. Understanding these fundamentals will give you more control over your images.\n\n## Step 2: Learn the Exposure Triangle\nThe exposure triangle consists of aperture, shutter speed, and ISO. These three elements work together to create a properly exposed image. Experiment with different combinations to see how they affect your photos.\n\n## Step 3: Practice Composition Techniques\nGood composition can transform an ordinary scene into a compelling photograph. Study the rule of thirds, leading lines, framing, and symmetry. These techniques will help you create more balanced and interesting images.\n\n## Step 4: Master Lighting\nLighting is perhaps the most crucial aspect of photography. Learn to recognize good natural light and how to work with it. Practice shooting during the golden hour (shortly after sunrise or before sunset) when the light is soft and warm.\n\n## Step 5: Post-Processing\nDevelop basic editing skills using software like Adobe Lightroom or free alternatives. Learn how to adjust exposure, contrast, and colors to enhance your images without overdoing it.\n\nRemember, becoming proficient in photography takes time and practice. Don't be discouraged by initial results – keep shooting, analyzing your work, and learning from each experience. With dedication and patience, you'll see significant improvement in your photography skills.`,
    parameters: {
      topic: 'digital photography for beginners',
      numSteps: 5,
      tone: 'educational',
      audience: 'beginners',
    },
    status: 'completed',
    createdAt: '2025-06-01T09:45:00Z',
    updatedAt: '2025-06-01T09:46:30Z',
  },
  {
    id: '2',
    templateId: '2',
    content: `✨ Introducing our NEW UltraGlow Serum! ✨\n\nThis game-changing formula is packed with hyaluronic acid, vitamin C, and niacinamide to transform your skin overnight!\n\n🌟 Deeply hydrates\n🌟 Brightens dull complexion\n🌟 Reduces fine lines\n🌟 Non-greasy formula\n🌟 Suitable for all skin types\n\nYour skin deserves the best - treat yourself today! Limited launch offer: 15% off with code GLOW15 🔥\n\n#UltraGlowSerum #SkincareMagic #GlowingSkin #SkinTransformation #CleanBeauty`,
    parameters: {
      platform: 'Instagram',
      productName: 'UltraGlow Serum',
      features: 'hydrating, brightening, anti-aging, lightweight, universal',
      hashtags: 5,
      tone: 'excited',
    },
    status: 'completed',
    createdAt: '2025-06-05T16:20:00Z',
    updatedAt: '2025-06-05T16:21:15Z',
  },
];

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'aiContent/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/ai/templates');
      
      // Simulated response with mock data
      const response = { data: mockTemplates };
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch templates');
      }
      return rejectWithValue('Failed to fetch templates. Please try again.');
    }
  }
);

export const fetchGeneratedContents = createAsyncThunk(
  'aiContent/fetchGeneratedContents',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/ai/contents');
      
      // Simulated response with mock data
      const response = { data: mockGeneratedContents };
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch generated contents');
      }
      return rejectWithValue('Failed to fetch generated contents. Please try again.');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'aiContent/fetchTemplateById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/ai/templates/${id}`);
      
      // Simulated response with mock data
      const template = mockTemplates.find(t => t.id === id);
      
      if (!template) {
        return rejectWithValue('Template not found');
      }
      
      return template;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch template');
      }
      return rejectWithValue('Failed to fetch template. Please try again.');
    }
  }
);

export const fetchContentById = createAsyncThunk(
  'aiContent/fetchContentById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/ai/contents/${id}`);
      
      // Simulated response with mock data
      const content = mockGeneratedContents.find(c => c.id === id);
      
      if (!content) {
        return rejectWithValue('Content not found');
      }
      
      return content;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch content');
      }
      return rejectWithValue('Failed to fetch content. Please try again.');
    }
  }
);

export const createTemplate = createAsyncThunk(
  'aiContent/createTemplate',
  async (template: Omit<ContentTemplate, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post('/api/ai/templates', template);
      
      // Simulated response
      const newTemplate: ContentTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newTemplate;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to create template');
      }
      return rejectWithValue('Failed to create template. Please try again.');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'aiContent/updateTemplate',
  async ({ id, data }: { id: string; data: Partial<ContentTemplate> }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.put(`/api/ai/templates/${id}`, data);
      
      // Simulated response
      const template = mockTemplates.find(t => t.id === id);
      
      if (!template) {
        return rejectWithValue('Template not found');
      }
      
      const updatedTemplate = {
        ...template,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedTemplate;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update template');
      }
      return rejectWithValue('Failed to update template. Please try again.');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'aiContent/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/ai/templates/${id}`);
      
      // Simulated response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete template');
      }
      return rejectWithValue('Failed to delete template. Please try again.');
    }
  }
);

export const generateContent = createAsyncThunk(
  'aiContent/generateContent',
  async (
    { templateId, parameters }: { templateId: string; parameters: Record<string, string | number | boolean> },
    { rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.post('/api/ai/generate', { templateId, parameters });
      
      // Simulated response
      const template = mockTemplates.find(t => t.id === templateId);
      
      if (!template) {
        return rejectWithValue('Template not found');
      }
      
      // Simulate content generation (in a real app, this would be done by the AI service)
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        templateId,
        content: 'Generated content would appear here based on the template and parameters...',
        parameters,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newContent;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to generate content');
      }
      return rejectWithValue('Failed to generate content. Please try again.');
    }
  }
);

export const deleteContent = createAsyncThunk(
  'aiContent/deleteContent',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/ai/contents/${id}`);
      
      // Simulated response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete content');
      }
      return rejectWithValue('Failed to delete content. Please try again.');
    }
  }
);

// Slice
const aiContentSlice = createSlice({
  name: 'aiContent',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<ContentTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    setSelectedContent: (state, action: PayloadAction<GeneratedContent | null>) => {
      state.selectedContent = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AiContentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSort: (state, action: PayloadAction<AiContentState['sort']>) => {
      state.sort = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Templates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Generated Contents
    builder
      .addCase(fetchGeneratedContents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneratedContents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedContents = action.payload;
      })
      .addCase(fetchGeneratedContents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Template By Id
    builder
      .addCase(fetchTemplateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Content By Id
    builder
      .addCase(fetchContentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedContent = action.payload;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Create Template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates.push(action.payload);
        state.selectedTemplate = action.payload;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Update Template
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.selectedTemplate?.id === action.payload.id) {
          state.selectedTemplate = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Delete Template
    builder
      .addCase(deleteTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = state.templates.filter(t => t.id !== action.payload);
        if (state.selectedTemplate?.id === action.payload) {
          state.selectedTemplate = null;
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Generate Content
    builder
      .addCase(generateContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedContents.push(action.payload);
        state.selectedContent = action.payload;
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Delete Content
    builder
      .addCase(deleteContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedContents = state.generatedContents.filter(c => c.id !== action.payload);
        if (state.selectedContent?.id === action.payload) {
          state.selectedContent = null;
        }
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTemplate,
  setSelectedContent,
  setFilters,
  resetFilters,
  setSort,
  resetError,
} = aiContentSlice.actions;

export default aiContentSlice.reducer;
