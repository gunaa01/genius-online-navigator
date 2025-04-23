import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContentHistoryList from '@/components/ai-content/ContentHistoryList';
import { ContentHistoryItem, ContentFilterOptions } from '@/services/ai-content/contentHistoryService';

// Mock data
const mockItems: ContentHistoryItem[] = [
  {
    id: 'content-1',
    title: 'Test Content 1',
    content: 'This is test content 1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    type: 'blog',
    tags: ['test', 'blog'],
    status: 'published',
    metrics: {
      views: 100,
      engagement: 50,
      conversions: 10,
    },
    versions: [
      {
        id: 'version-1-1',
        content: 'This is test content 1',
        createdAt: '2025-01-01T00:00:00Z',
        createdBy: 'User',
        notes: 'Initial version',
      },
    ],
  },
  {
    id: 'content-2',
    title: 'Test Content 2',
    content: 'This is test content 2',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    type: 'social',
    platform: 'twitter',
    tags: ['test', 'social'],
    status: 'draft',
    metrics: {
      views: 50,
      engagement: 20,
      conversions: 5,
    },
    versions: [
      {
        id: 'version-2-1',
        content: 'This is test content 2',
        createdAt: '2025-01-02T00:00:00Z',
        createdBy: 'User',
        notes: 'Initial version',
      },
    ],
  },
];

// Mock handlers
const mockHandlers = {
  onPageChange: vi.fn(),
  onFilterChange: vi.fn(),
  onViewItem: vi.fn(),
  onEditItem: vi.fn(),
  onDeleteItem: vi.fn(),
  onShareItem: vi.fn(),
  onExportItem: vi.fn(),
};

describe('ContentHistoryList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders content history items correctly', () => {
    render(
      <ContentHistoryList
        items={mockItems}
        total={mockItems.length}
        page={1}
        limit={10}
        totalPages={1}
        loading={false}
        filters={{}}
        {...mockHandlers}
      />
    );

    // Check if items are rendered
    expect(screen.getByText('Test Content 1')).toBeInTheDocument();
    expect(screen.getByText('Test Content 2')).toBeInTheDocument();
    
    // Check if types and statuses are rendered
    expect(screen.getByText('blog')).toBeInTheDocument();
    expect(screen.getByText('social')).toBeInTheDocument();
    expect(screen.getByText('published')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();
    
    // Check if metrics are rendered
    expect(screen.getByText('100')).toBeInTheDocument(); // Views for item 1
    expect(screen.getByText('50')).toBeInTheDocument(); // Engagement for item 1 and Views for item 2
  });

  it('shows loading state correctly', () => {
    render(
      <ContentHistoryList
        items={[]}
        total={0}
        page={1}
        limit={10}
        totalPages={0}
        loading={true}
        filters={{}}
        {...mockHandlers}
      />
    );

    // Check if loading indicator is shown
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state correctly', () => {
    render(
      <ContentHistoryList
        items={[]}
        total={0}
        page={1}
        limit={10}
        totalPages={0}
        loading={false}
        filters={{}}
        {...mockHandlers}
      />
    );

    // Check if empty state message is shown
    expect(screen.getByText('No content found')).toBeInTheDocument();
  });

  it('handles search correctly', async () => {
    render(
      <ContentHistoryList
        items={mockItems}
        total={mockItems.length}
        page={1}
        limit={10}
        totalPages={1}
        loading={false}
        filters={{}}
        {...mockHandlers}
      />
    );

    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search content...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Click search button
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    // Check if onFilterChange was called with correct params
    await waitFor(() => {
      expect(mockHandlers.onFilterChange).toHaveBeenCalledWith({
        search: 'test search',
      });
    });
  });

  it('handles filter changes correctly', async () => {
    render(
      <ContentHistoryList
        items={mockItems}
        total={mockItems.length}
        page={1}
        limit={10}
        totalPages={1}
        loading={false}
        filters={{}}
        {...mockHandlers}
      />
    );

    // Open type filter dropdown
    const typeFilter = screen.getByRole('combobox', { name: 'Content Type' });
    fireEvent.click(typeFilter);
    
    // Select 'blog' type
    const blogOption = screen.getByRole('option', { name: 'Blog' });
    fireEvent.click(blogOption);
    
    // Check if onFilterChange was called with correct params
    await waitFor(() => {
      expect(mockHandlers.onFilterChange).toHaveBeenCalledWith({
        type: 'blog',
      });
    });
  });

  it('handles item actions correctly', () => {
    render(
      <ContentHistoryList
        items={mockItems}
        total={mockItems.length}
        page={1}
        limit={10}
        totalPages={1}
        loading={false}
        filters={{}}
        {...mockHandlers}
      />
    );

    // Get action buttons for first item
    const viewButton = screen.getAllByLabelText(/View/)[0];
    const editButton = screen.getAllByLabelText(/Edit/)[0];
    const shareButton = screen.getAllByLabelText(/Share/)[0];
    const exportButton = screen.getAllByLabelText(/Export/)[0];
    const deleteButton = screen.getAllByLabelText(/Delete/)[0];
    
    // Click each button and check if corresponding handler was called
    fireEvent.click(viewButton);
    expect(mockHandlers.onViewItem).toHaveBeenCalledWith('content-1');
    
    fireEvent.click(editButton);
    expect(mockHandlers.onEditItem).toHaveBeenCalledWith('content-1');
    
    fireEvent.click(shareButton);
    expect(mockHandlers.onShareItem).toHaveBeenCalledWith('content-1');
    
    fireEvent.click(exportButton);
    expect(mockHandlers.onExportItem).toHaveBeenCalledWith('content-1');
    
    fireEvent.click(deleteButton);
    expect(mockHandlers.onDeleteItem).toHaveBeenCalledWith('content-1');
  });

  it('handles clear filters correctly', async () => {
    render(
      <ContentHistoryList
        items={mockItems}
        total={mockItems.length}
        page={1}
        limit={10}
        totalPages={1}
        loading={false}
        filters={{ type: 'blog', status: 'published' }}
        {...mockHandlers}
      />
    );

    // Click clear filters button
    const clearButton = screen.getByRole('button', { name: 'Clear Filters' });
    fireEvent.click(clearButton);
    
    // Check if onFilterChange was called with empty object
    await waitFor(() => {
      expect(mockHandlers.onFilterChange).toHaveBeenCalledWith({});
    });
  });
});
