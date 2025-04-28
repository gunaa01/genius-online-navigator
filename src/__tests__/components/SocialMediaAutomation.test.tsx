import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/utils/test-utils';
import SocialMediaAutomation from '@/components/SocialMediaAutomation';
import { fetchPosts, fetchAccounts } from '@/store/slices/socialMediaSlice';

// Mock the store dispatch
jest.mock('@/store/slices/socialMediaSlice', () => ({
  ...jest.requireActual('@/store/slices/socialMediaSlice'),
  fetchPosts: jest.fn(),
  fetchAccounts: jest.fn(),
  createPost: jest.fn(),
  deletePost: jest.fn(),
  connectAccount: jest.fn(),
  disconnectAccount: jest.fn(),
}));

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('SocialMediaAutomation Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches data on mount', () => {
    renderWithProviders(<SocialMediaAutomation />);
    
    // Check if the component renders the main sections
    expect(screen.getByText('Social Media Automation')).toBeInTheDocument();
    
    // Check if fetchPosts and fetchAccounts were called
    expect(fetchPosts).toHaveBeenCalledTimes(1);
    expect(fetchAccounts).toHaveBeenCalledTimes(1);
  });
  
  it('displays posts when available in the store', () => {
    // Create a mock state with some posts
    const initialState = {
      socialMedia: {
        posts: [
          {
            id: '1',
            content: 'Test post content',
            platforms: ['twitter', 'facebook'],
            media: [],
            scheduledDate: '2025-05-01T10:00:00Z',
            publishedDate: null,
            status: 'scheduled',
            tags: ['test'],
            createdAt: '2025-04-20T10:00:00Z',
            updatedAt: '2025-04-20T10:00:00Z',
          },
        ],
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
          field: 'createdAt',
          direction: 'desc',
        },
      },
    };
    
    renderWithProviders(<SocialMediaAutomation />, { preloadedState: initialState });
    
    // Check if the post content is displayed
    expect(screen.getByText('Test post content')).toBeInTheDocument();
  });
  
  it('displays the create post form when "Create Post" button is clicked', async () => {
    renderWithProviders(<SocialMediaAutomation />);
    
    // Click the create post button
    const createButton = screen.getByRole('button', { name: /Create Post/i });
    await userEvent.click(createButton);
    
    // Check if the form is displayed
    expect(screen.getByText('Create New Post')).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByText('Select Platforms')).toBeInTheDocument();
  });
  
  it('displays accounts when available in the store', () => {
    // Create a mock state with some accounts
    const initialState = {
      socialMedia: {
        posts: [],
        accounts: [
          {
            id: '1',
            platform: 'twitter',
            name: 'Twitter Account',
            profileUrl: 'https://twitter.com/test',
            profileImage: 'https://example.com/image.jpg',
            isConnected: true,
            lastSynced: '2025-04-20T10:00:00Z',
          },
        ],
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
          field: 'createdAt',
          direction: 'desc',
        },
      },
    };
    
    renderWithProviders(<SocialMediaAutomation />, { preloadedState: initialState });
    
    // Navigate to the accounts tab
    const accountsTab = screen.getByRole('tab', { name: /Accounts/i });
    userEvent.click(accountsTab);
    
    // Check if the account is displayed
    waitFor(() => {
      expect(screen.getByText('Twitter Account')).toBeInTheDocument();
    });
  });
  
  it('displays error message when there is an error in the store', () => {
    // Create a mock state with an error
    const initialState = {
      socialMedia: {
        posts: [],
        accounts: [],
        selectedPost: null,
        isLoading: false,
        error: 'Failed to fetch posts',
        filters: {
          platform: null,
          status: null,
          dateRange: null,
          tags: [],
        },
        sort: {
          field: 'createdAt',
          direction: 'desc',
        },
      },
    };
    
    renderWithProviders(<SocialMediaAutomation />, { preloadedState: initialState });
    
    // The error should be displayed via toast.error
    // We can't directly test this since it's mocked, but we can check if the function was called
    expect(require('sonner').toast.error).toHaveBeenCalledWith('Failed to fetch posts');
  });
});
