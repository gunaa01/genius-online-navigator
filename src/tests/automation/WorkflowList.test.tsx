import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import WorkflowList from '@/components/automation/WorkflowList';
import { format } from 'date-fns';

// Mock router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock date-fns format function
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    format: vi.fn().mockImplementation(() => 'Jan 1, 2023'),
    parseISO: vi.fn().mockImplementation((date) => new Date(date)),
  };
});

describe('WorkflowList Component', () => {
  // Mock props
  const mockWorkflows = [
    {
      id: 'workflow-1',
      name: 'Social Media Scheduler',
      description: 'Automatically schedule social media posts',
      isActive: true,
      triggers: [
        { id: 'trigger-1', type: 'schedule', config: { schedule: { frequency: 'daily', time: '09:00' } } },
      ],
      actions: [
        { id: 'action-1', type: 'social-media-post', name: 'Post to Twitter' },
      ],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      stats: {
        runsTotal: 10,
        runsSuccess: 8,
        runsFailed: 2,
        lastRun: '2023-01-02T00:00:00Z',
      },
    },
    {
      id: 'workflow-2',
      name: 'Content Generator',
      description: 'Generate content using AI',
      isActive: false,
      triggers: [
        { id: 'trigger-2', type: 'manual', config: {} },
      ],
      actions: [
        { id: 'action-2', type: 'ai-content-generation', name: 'Generate Blog Post' },
      ],
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
      stats: {
        runsTotal: 5,
        runsSuccess: 5,
        runsFailed: 0,
        lastRun: '2023-01-03T00:00:00Z',
      },
    },
  ];

  const mockProps = {
    workflows: mockWorkflows,
    loading: false,
    onCreateWorkflow: vi.fn(),
    onEditWorkflow: vi.fn(),
    onDuplicateWorkflow: vi.fn(),
    onDeleteWorkflow: vi.fn(),
    onToggleActive: vi.fn(),
    onRunWorkflow: vi.fn(),
    onViewRuns: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders workflows correctly', () => {
    render(<WorkflowList {...mockProps} />);
    
    // Check if workflows are rendered
    expect(screen.getByText('Social Media Scheduler')).toBeInTheDocument();
    expect(screen.getByText('Content Generator')).toBeInTheDocument();
    
    // Check if descriptions are rendered
    expect(screen.getByText('Automatically schedule social media posts')).toBeInTheDocument();
    expect(screen.getByText('Generate content using AI')).toBeInTheDocument();
    
    // Check if status badges are rendered
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders trigger types correctly', () => {
    render(<WorkflowList {...mockProps} />);
    
    // Check if trigger types are rendered
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<WorkflowList {...mockProps} loading={true} />);
    
    // Check if loading spinner is rendered
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state when no workflows are available', () => {
    render(<WorkflowList {...mockProps} workflows={[]} />);
    
    // Check if empty state is rendered
    expect(screen.getByText('No workflows found')).toBeInTheDocument();
    expect(screen.getByText("Get started by creating your first workflow")).toBeInTheDocument();
  });

  it('calls onCreateWorkflow when create button is clicked', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Click create button
    const createButton = screen.getByRole('button', { name: /create workflow/i });
    await userEvent.click(createButton);
    
    // Check if onCreateWorkflow is called
    expect(mockProps.onCreateWorkflow).toHaveBeenCalledTimes(1);
  });

  it('calls onEditWorkflow when edit button is clicked', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Find and click edit button for first workflow
    const editButtons = screen.getAllByRole('button', { name: /edit workflow/i });
    await userEvent.click(editButtons[0]);
    
    // Check if onEditWorkflow is called with correct ID
    expect(mockProps.onEditWorkflow).toHaveBeenCalledWith('workflow-1');
  });

  it('calls onToggleActive when toggle button is clicked', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Find and click toggle button for first workflow (which is active)
    const toggleButtons = screen.getAllByRole('button', { name: /deactivate workflow/i });
    await userEvent.click(toggleButtons[0]);
    
    // Check if onToggleActive is called with correct params
    expect(mockProps.onToggleActive).toHaveBeenCalledWith('workflow-1', false);
  });

  it('filters workflows by search term', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search workflows...');
    await userEvent.type(searchInput, 'Social');
    
    // Check if only matching workflow is visible
    expect(screen.getByText('Social Media Scheduler')).toBeInTheDocument();
    expect(screen.queryByText('Content Generator')).not.toBeInTheDocument();
  });

  it('filters workflows by trigger type', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Open trigger type dropdown
    const triggerSelect = screen.getByRole('combobox', { name: /filter by trigger/i });
    await userEvent.click(triggerSelect);
    
    // Select "Schedule" option
    const scheduleOption = screen.getByRole('option', { name: /schedule/i });
    await userEvent.click(scheduleOption);
    
    // Check if only matching workflow is visible
    expect(screen.getByText('Social Media Scheduler')).toBeInTheDocument();
    expect(screen.queryByText('Content Generator')).not.toBeInTheDocument();
  });

  it('filters workflows by status', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Open status dropdown
    const statusSelect = screen.getByRole('combobox', { name: /filter by status/i });
    await userEvent.click(statusSelect);
    
    // Select "Active" option
    const activeOption = screen.getByRole('option', { name: /active/i });
    await userEvent.click(activeOption);
    
    // Check if only matching workflow is visible
    expect(screen.getByText('Social Media Scheduler')).toBeInTheDocument();
    expect(screen.queryByText('Content Generator')).not.toBeInTheDocument();
  });

  it('clears filters when clear button is clicked', async () => {
    render(<WorkflowList {...mockProps} />);
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search workflows...');
    await userEvent.type(searchInput, 'Social');
    
    // Check if only matching workflow is visible
    expect(screen.getByText('Social Media Scheduler')).toBeInTheDocument();
    expect(screen.queryByText('Content Generator')).not.toBeInTheDocument();
    
    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(clearButton);
    
    // Check if all workflows are visible again
    expect(screen.getByText('Social Media Scheduler')).toBeInTheDocument();
    expect(screen.getByText('Content Generator')).toBeInTheDocument();
  });
});
