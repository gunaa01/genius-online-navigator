import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { workflowService } from '@/services/automation/workflowService';
import { enhancedApiClient } from '@/lib/api-client';

// Mock the API client
vi.mock('@/lib/api-client', () => ({
  enhancedApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Workflow Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getWorkflows', () => {
    it('should fetch workflows successfully', async () => {
      // Mock data
      const mockWorkflows = [
        {
          id: 'workflow-1',
          name: 'Test Workflow 1',
          description: 'Test description',
          isActive: true,
          triggers: [{ id: 'trigger-1', type: 'schedule' }],
          actions: [{ id: 'action-1', type: 'social-media-post' }],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          stats: {
            runsTotal: 10,
            runsSuccess: 8,
            runsFailed: 2,
            lastRun: '2023-01-02T00:00:00Z',
          },
        },
      ];

      // Setup mock response
      (enhancedApiClient.get as any).mockResolvedValue({ data: mockWorkflows });

      // Call the service
      const result = await workflowService.getWorkflows();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/api/automation/workflows');
      expect(result).toEqual(mockWorkflows);
    });

    it('should handle errors when fetching workflows', async () => {
      // Setup mock error
      const error = new Error('Network error');
      (enhancedApiClient.get as any).mockRejectedValue(error);

      // Call and assert
      await expect(workflowService.getWorkflows()).rejects.toThrow('Network error');
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/api/automation/workflows');
    });
  });

  describe('getWorkflow', () => {
    it('should fetch a single workflow by ID', async () => {
      // Mock data
      const mockWorkflow = {
        id: 'workflow-1',
        name: 'Test Workflow 1',
        description: 'Test description',
        isActive: true,
        triggers: [{ id: 'trigger-1', type: 'schedule' }],
        actions: [{ id: 'action-1', type: 'social-media-post' }],
      };

      // Setup mock response
      (enhancedApiClient.get as any).mockResolvedValue({ data: mockWorkflow });

      // Call the service
      const result = await workflowService.getWorkflow('workflow-1');

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/api/automation/workflows/workflow-1');
      expect(result).toEqual(mockWorkflow);
    });
  });

  describe('createWorkflow', () => {
    it('should create a workflow successfully', async () => {
      // Mock data
      const newWorkflow = {
        name: 'New Workflow',
        description: 'New description',
        isActive: true,
        triggers: [{ type: 'schedule', name: 'Daily Schedule' }],
        actions: [{ type: 'social-media-post', name: 'Post to Twitter' }],
      };

      const createdWorkflow = {
        id: 'new-workflow-id',
        ...newWorkflow,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      // Setup mock response
      (enhancedApiClient.post as any).mockResolvedValue({ data: createdWorkflow });

      // Call the service
      const result = await workflowService.createWorkflow(newWorkflow);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith('/api/automation/workflows', newWorkflow);
      expect(result).toEqual(createdWorkflow);
    });
  });

  describe('updateWorkflow', () => {
    it('should update a workflow successfully', async () => {
      // Mock data
      const workflowId = 'workflow-1';
      const updateData = {
        name: 'Updated Workflow',
        isActive: false,
      };

      const updatedWorkflow = {
        id: workflowId,
        name: 'Updated Workflow',
        description: 'Test description',
        isActive: false,
        updatedAt: '2023-01-03T00:00:00Z',
      };

      // Setup mock response
      (enhancedApiClient.put as any).mockResolvedValue({ data: updatedWorkflow });

      // Call the service
      const result = await workflowService.updateWorkflow(workflowId, updateData);

      // Assertions
      expect(enhancedApiClient.put).toHaveBeenCalledWith(`/api/automation/workflows/${workflowId}`, updateData);
      expect(result).toEqual(updatedWorkflow);
    });
  });

  describe('deleteWorkflow', () => {
    it('should delete a workflow successfully', async () => {
      // Mock data
      const workflowId = 'workflow-1';

      // Setup mock response
      (enhancedApiClient.delete as any).mockResolvedValue({ data: { success: true } });

      // Call the service
      const result = await workflowService.deleteWorkflow(workflowId);

      // Assertions
      expect(enhancedApiClient.delete).toHaveBeenCalledWith(`/api/automation/workflows/${workflowId}`);
      expect(result).toEqual({ success: true });
    });
  });

  describe('runWorkflow', () => {
    it('should trigger a workflow run', async () => {
      // Mock data
      const workflowId = 'workflow-1';
      const runResponse = {
        runId: 'run-1',
        status: 'running',
        startTime: '2023-01-03T00:00:00Z',
      };

      // Setup mock response
      (enhancedApiClient.post as any).mockResolvedValue({ data: runResponse });

      // Call the service
      const result = await workflowService.runWorkflow(workflowId);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith(`/api/automation/workflows/${workflowId}/run`);
      expect(result).toEqual(runResponse);
    });
  });

  describe('getWorkflowRuns', () => {
    it('should fetch workflow runs', async () => {
      // Mock data
      const workflowId = 'workflow-1';
      const mockRuns = [
        {
          id: 'run-1',
          workflowId,
          status: 'success',
          startTime: '2023-01-01T00:00:00Z',
          endTime: '2023-01-01T00:01:00Z',
          triggeredBy: 'schedule',
        },
      ];

      // Setup mock response
      (enhancedApiClient.get as any).mockResolvedValue({ data: mockRuns });

      // Call the service
      const result = await workflowService.getWorkflowRuns(workflowId);

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith(`/api/automation/workflows/${workflowId}/runs`);
      expect(result).toEqual(mockRuns);
    });
  });

  describe('getWorkflowStats', () => {
    it('should fetch workflow statistics', async () => {
      // Mock data
      const days = 7;
      const mockStats = {
        totalWorkflows: 5,
        activeWorkflows: 3,
        totalRuns: 100,
        successRate: 85,
        runsByDay: [
          { date: '2023-01-01', runs: 10, successful: 8, failed: 2 },
        ],
      };

      // Setup mock response
      (enhancedApiClient.get as any).mockResolvedValue({ data: mockStats });

      // Call the service
      const result = await workflowService.getWorkflowStats(days);

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith(`/api/automation/stats?days=${days}`);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getWorkflowTemplates', () => {
    it('should fetch workflow templates', async () => {
      // Mock data
      const mockTemplates = [
        {
          id: 'template-1',
          name: 'Social Media Schedule',
          description: 'Template for scheduling social media posts',
          category: 'Social Media',
          tags: ['twitter', 'facebook'],
          createdAt: '2023-01-01T00:00:00Z',
        },
      ];

      // Setup mock response
      (enhancedApiClient.get as any).mockResolvedValue({ data: mockTemplates });

      // Call the service
      const result = await workflowService.getWorkflowTemplates();

      // Assertions
      expect(enhancedApiClient.get).toHaveBeenCalledWith('/api/automation/templates');
      expect(result).toEqual(mockTemplates);
    });
  });

  describe('duplicateWorkflow', () => {
    it('should duplicate a workflow', async () => {
      // Mock data
      const workflowId = 'workflow-1';
      const duplicatedWorkflow = {
        id: 'workflow-2',
        name: 'Test Workflow 1 (Copy)',
        description: 'Test description',
        isActive: false,
        createdAt: '2023-01-03T00:00:00Z',
      };

      // Setup mock response
      (enhancedApiClient.post as any).mockResolvedValue({ data: duplicatedWorkflow });

      // Call the service
      const result = await workflowService.duplicateWorkflow(workflowId);

      // Assertions
      expect(enhancedApiClient.post).toHaveBeenCalledWith(`/api/automation/workflows/${workflowId}/duplicate`);
      expect(result).toEqual(duplicatedWorkflow);
    });
  });
});
