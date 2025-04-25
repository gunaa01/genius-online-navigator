import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/utils/test-utils';
import AIContentGenerator from '@/components/AIContentGenerator';
import { fetchTemplates, fetchGeneratedContents, generateContent } from '@/store/slices/aiContentSlice';

// Mock the store dispatch
jest.mock('@/store/slices/aiContentSlice', () => ({
  ...jest.requireActual('@/store/slices/aiContentSlice'),
  fetchTemplates: jest.fn(),
  fetchGeneratedContents: jest.fn(),
  generateContent: jest.fn().mockReturnValue({ unwrap: () => Promise.resolve({ content: 'Generated content' }) }),
  setSelectedTemplate: jest.fn(),
}));

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AIContentGenerator Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches data on mount', () => {
    renderWithProviders(<AIContentGenerator />);
    
    // Check if the component renders the main sections
    expect(screen.getByText('AI Content Generator')).toBeInTheDocument();
    
    // Check if fetchTemplates and fetchGeneratedContents were called
    expect(fetchTemplates).toHaveBeenCalledTimes(1);
    expect(fetchGeneratedContents).toHaveBeenCalledTimes(1);
  });
  
  it('displays templates when available in the store', () => {
    // Create a mock state with some templates
    const initialState = {
      aiContent: {
        templates: [
          {
            id: '1',
            name: 'Blog Post',
            description: 'Generate a blog post',
            type: 'blog',
            prompt: 'Write a blog post about [topic]',
            parameters: [],
            createdAt: '2025-04-20T10:00:00Z',
            updatedAt: '2025-04-20T10:00:00Z',
          },
        ],
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
      },
    };
    
    renderWithProviders(<AIContentGenerator />, { preloadedState: initialState });
    
    // Check if the template is displayed
    expect(screen.getByText('Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Generate a blog post')).toBeInTheDocument();
  });
  
  it('displays generated content history when available in the store', () => {
    // Create a mock state with some generated content
    const initialState = {
      aiContent: {
        templates: [],
        generatedContents: [
          {
            id: '1',
            templateId: '1',
            content: 'This is generated content',
            parameters: { prompt: 'Test prompt' },
            status: 'completed',
            createdAt: '2025-04-20T10:00:00Z',
            updatedAt: '2025-04-20T10:00:00Z',
          },
        ],
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
      },
    };
    
    renderWithProviders(<AIContentGenerator />, { preloadedState: initialState });
    
    // Navigate to the history tab
    const historyTab = screen.getByRole('tab', { name: /History/i });
    userEvent.click(historyTab);
    
    // Check if the generated content is displayed
    waitFor(() => {
      expect(screen.getByText('This is generated content')).toBeInTheDocument();
    });
  });
  
  it('handles content generation when form is submitted', async () => {
    // Create a mock state with a selected template
    const initialState = {
      aiContent: {
        templates: [
          {
            id: '1',
            name: 'Blog Post',
            description: 'Generate a blog post',
            type: 'blog',
            prompt: 'Write a blog post about [topic]',
            parameters: [],
            createdAt: '2025-04-20T10:00:00Z',
            updatedAt: '2025-04-20T10:00:00Z',
          },
        ],
        generatedContents: [],
        selectedTemplate: {
          id: '1',
          name: 'Blog Post',
          description: 'Generate a blog post',
          type: 'blog',
          prompt: 'Write a blog post about [topic]',
          parameters: [],
          createdAt: '2025-04-20T10:00:00Z',
          updatedAt: '2025-04-20T10:00:00Z',
        },
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
      },
    };
    
    renderWithProviders(<AIContentGenerator />, { preloadedState: initialState });
    
    // Fill in the prompt
    const promptInput = screen.getByLabelText(/Prompt/i);
    await userEvent.type(promptInput, 'Test prompt');
    
    // Click the generate button
    const generateButton = screen.getByRole('button', { name: /Generate Content/i });
    await userEvent.click(generateButton);
    
    // Check if generateContent was called with the correct parameters
    expect(generateContent).toHaveBeenCalledWith({
      templateId: '1',
      parameters: expect.objectContaining({
        prompt: 'Test prompt',
      }),
    });
    
    // Check if success toast was shown
    await waitFor(() => {
      expect(require('sonner').toast.success).toHaveBeenCalledWith('Content generated successfully');
    });
  });
  
  it('displays error message when there is an error in the store', () => {
    // Create a mock state with an error
    const initialState = {
      aiContent: {
        templates: [],
        generatedContents: [],
        selectedTemplate: null,
        selectedContent: null,
        isLoading: false,
        error: 'Failed to fetch templates',
        filters: {
          type: null,
          dateRange: null,
        },
        sort: {
          field: 'createdAt',
          direction: 'desc',
        },
      },
    };
    
    renderWithProviders(<AIContentGenerator />, { preloadedState: initialState });
    
    // The error should be displayed via toast.error
    expect(require('sonner').toast.error).toHaveBeenCalledWith('Failed to fetch templates');
  });
});
