import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

/**
 * Workflow
 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  stats?: {
    runsTotal: number;
    runsSuccess: number;
    runsFailure: number;
    lastRun: string | null;
  };
}

/**
 * Workflow Trigger
 */
export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'webhook' | 'manual';
  config: {
    schedule?: {
      frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
      time?: string;
      days?: string[];
      date?: string;
      cronExpression?: string;
    };
    event?: {
      source: 'social-media' | 'ai-content' | 'analytics' | 'system';
      name: string;
      parameters?: Record<string, any>;
    };
    webhook?: {
      url: string;
      method: 'GET' | 'POST';
      headers?: Record<string, string>;
    };
  };
}

/**
 * Workflow Condition
 */
export interface WorkflowCondition {
  id: string;
  type: 'comparison' | 'logical' | 'data-exists';
  config: {
    comparison?: {
      leftOperand: string;
      operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with';
      rightOperand: string | number | boolean;
    };
    logical?: {
      operator: 'and' | 'or';
      conditions: WorkflowCondition[];
    };
    dataExists?: {
      path: string;
    };
  };
}

/**
 * Workflow Action
 */
export interface WorkflowAction {
  id: string;
  type: 'social-media' | 'ai-content' | 'notification' | 'api-request' | 'data-transformation';
  name: string;
  config: {
    socialMedia?: {
      action: 'post' | 'schedule' | 'analyze';
      platform?: string[];
      content?: string;
      contentSource?: 'direct' | 'template' | 'ai-generated';
      contentTemplateId?: string;
      contentGenerationParams?: Record<string, any>;
      scheduledTime?: string;
    };
    aiContent?: {
      action: 'generate' | 'analyze' | 'save' | 'export';
      templateId?: string;
      inputs?: Record<string, any>;
      brandVoiceId?: string;
      outputFormat?: 'text' | 'html' | 'markdown' | 'json';
      saveToHistory?: boolean;
    };
    notification?: {
      channels: ('email' | 'push' | 'in-app')[];
      recipients: string[];
      subject: string;
      message: string;
      priority: 'low' | 'normal' | 'high';
    };
    apiRequest?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: string | Record<string, any>;
      authentication?: {
        type: 'none' | 'basic' | 'bearer' | 'api-key';
        username?: string;
        password?: string;
        token?: string;
        apiKey?: string;
        apiKeyName?: string;
      };
    };
    dataTransformation?: {
      transformations: {
        type: 'map' | 'filter' | 'sort' | 'group' | 'aggregate';
        source: string;
        destination: string;
        config: Record<string, any>;
      }[];
    };
  };
  order: number;
  dependsOn?: string[];
}

/**
 * Workflow Template
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'social-media' | 'content-creation' | 'analytics' | 'integration' | 'other';
  triggers: Omit<WorkflowTrigger, 'id'>[];
  actions: Omit<WorkflowAction, 'id'>[];
  conditions: Omit<WorkflowCondition, 'id'>[];
}

/**
 * Workflow Run
 */
export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  trigger: {
    id: string;
    type: string;
  };
  actionResults: {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime?: string;
    endTime?: string;
    output?: any;
    error?: string;
  }[];
  error?: string;
}

/**
 * Get workflows
 * @returns List of workflows
 */
export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    const response = await enhancedApiClient.get('/automation/workflows');
    return response.data;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'workflow-1',
        name: 'Social Media Content Schedule',
        description: 'Automatically generate and schedule social media posts on a weekly basis',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        triggers: [
          {
            id: 'trigger-1',
            type: 'schedule',
            config: {
              schedule: {
                frequency: 'weekly',
                days: ['Monday'],
                time: '09:00',
              },
            },
          },
        ],
        actions: [
          {
            id: 'action-1',
            type: 'ai-content',
            name: 'Generate Social Media Content',
            config: {
              aiContent: {
                action: 'generate',
                templateId: 'template-social-media',
                inputs: {
                  topic: 'Latest industry news',
                  tone: 'professional',
                },
                brandVoiceId: 'brand-voice-1',
                saveToHistory: true,
              },
            },
            order: 1,
          },
          {
            id: 'action-2',
            type: 'social-media',
            name: 'Schedule Posts',
            config: {
              socialMedia: {
                action: 'schedule',
                platform: ['twitter', 'linkedin'],
                contentSource: 'ai-generated',
                scheduledTime: '{{formatDate(addDays(now(), 1), "YYYY-MM-DD")}T12:00:00Z',
              },
            },
            order: 2,
            dependsOn: ['action-1'],
          },
          {
            id: 'action-3',
            type: 'notification',
            name: 'Send Notification',
            config: {
              notification: {
                channels: ['email'],
                recipients: ['user@example.com'],
                subject: 'Social Media Posts Scheduled',
                message: 'Your social media posts have been generated and scheduled for tomorrow.',
                priority: 'normal',
              },
            },
            order: 3,
            dependsOn: ['action-2'],
          },
        ],
        conditions: [],
        stats: {
          runsTotal: 12,
          runsSuccess: 10,
          runsFailure: 2,
          lastRun: '2025-01-15T09:00:00Z',
        },
      },
      {
        id: 'workflow-2',
        name: 'Content Performance Monitor',
        description: 'Monitor content performance and send weekly reports',
        isActive: true,
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z',
        triggers: [
          {
            id: 'trigger-2',
            type: 'schedule',
            config: {
              schedule: {
                frequency: 'weekly',
                days: ['Friday'],
                time: '16:00',
              },
            },
          },
        ],
        actions: [
          {
            id: 'action-4',
            type: 'data-transformation',
            name: 'Aggregate Performance Data',
            config: {
              dataTransformation: {
                transformations: [
                  {
                    type: 'aggregate',
                    source: 'content.performance',
                    destination: 'performance.summary',
                    config: {
                      groupBy: 'contentType',
                      metrics: ['views', 'engagement', 'conversions'],
                      operations: ['sum', 'avg'],
                    },
                  },
                ],
              },
            },
            order: 1,
          },
          {
            id: 'action-5',
            type: 'notification',
            name: 'Send Performance Report',
            config: {
              notification: {
                channels: ['email', 'in-app'],
                recipients: ['user@example.com'],
                subject: 'Weekly Content Performance Report',
                message: 'Your weekly content performance report is ready. See attached for details.',
                priority: 'normal',
              },
            },
            order: 2,
            dependsOn: ['action-4'],
          },
        ],
        conditions: [],
        stats: {
          runsTotal: 8,
          runsSuccess: 8,
          runsFailure: 0,
          lastRun: '2025-01-12T16:00:00Z',
        },
      },
    ]);
  }
};

/**
 * Get workflow by ID
 * @param id Workflow ID
 * @returns Workflow
 */
export const getWorkflow = async (id: string): Promise<Workflow> => {
  try {
    const response = await enhancedApiClient.get(`/automation/workflows/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    
    // Return mock data for development
    const workflows = await getWorkflows();
    const workflow = workflows.find(w => w.id === id);
    
    if (workflow) {
      return mockApiResponse(workflow);
    }
    
    throw new Error(`Workflow with ID ${id} not found`);
  }
};

/**
 * Create workflow
 * @param workflow Workflow data
 * @returns Created workflow
 */
export const createWorkflow = async (
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'stats'>
): Promise<Workflow> => {
  try {
    const response = await enhancedApiClient.post('/automation/workflows', workflow);
    return response.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    
    // Return mock data for development
    return mockApiResponse({
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        runsTotal: 0,
        runsSuccess: 0,
        runsFailure: 0,
        lastRun: null,
      },
    });
  }
};

/**
 * Update workflow
 * @param id Workflow ID
 * @param workflow Workflow data
 * @returns Updated workflow
 */
export const updateWorkflow = async (
  id: string,
  workflow: Partial<Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'stats'>>
): Promise<Workflow> => {
  try {
    const response = await enhancedApiClient.put(`/automation/workflows/${id}`, workflow);
    return response.data;
  } catch (error) {
    console.error(`Error updating workflow ${id}:`, error);
    
    // Return mock data for development
    const existingWorkflow = await getWorkflow(id);
    
    return mockApiResponse({
      ...existingWorkflow,
      ...workflow,
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * Delete workflow
 * @param id Workflow ID
 * @returns Success status
 */
export const deleteWorkflow = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.delete(`/automation/workflows/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting workflow ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({ success: true });
  }
};

/**
 * Toggle workflow active status
 * @param id Workflow ID
 * @param isActive Active status
 * @returns Updated workflow
 */
export const toggleWorkflowActive = async (id: string, isActive: boolean): Promise<Workflow> => {
  try {
    const response = await enhancedApiClient.patch(`/automation/workflows/${id}/toggle`, { isActive });
    return response.data;
  } catch (error) {
    console.error(`Error toggling workflow ${id} active status:`, error);
    
    // Return mock data for development
    const existingWorkflow = await getWorkflow(id);
    
    return mockApiResponse({
      ...existingWorkflow,
      isActive,
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * Run workflow manually
 * @param id Workflow ID
 * @returns Workflow run
 */
export const runWorkflow = async (id: string): Promise<WorkflowRun> => {
  try {
    const response = await enhancedApiClient.post(`/automation/workflows/${id}/run`);
    return response.data;
  } catch (error) {
    console.error(`Error running workflow ${id}:`, error);
    
    // Return mock data for development
    const workflow = await getWorkflow(id);
    
    return mockApiResponse({
      id: `run-${Date.now()}`,
      workflowId: id,
      workflowName: workflow.name,
      status: 'running',
      startTime: new Date().toISOString(),
      trigger: {
        id: 'manual-trigger',
        type: 'manual',
      },
      actionResults: workflow.actions.map(action => ({
        id: action.id,
        status: 'pending',
      })),
    });
  }
};

/**
 * Get workflow runs
 * @param workflowId Workflow ID (optional, if not provided returns runs for all workflows)
 * @param limit Maximum number of runs to return
 * @param page Page number
 * @returns Workflow runs
 */
export const getWorkflowRuns = async (
  workflowId?: string,
  limit: number = 10,
  page: number = 1
): Promise<{
  runs: WorkflowRun[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    const response = await enhancedApiClient.get('/automation/runs', {
      params: {
        workflowId,
        limit,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    
    // Return mock data for development
    const mockRuns: WorkflowRun[] = [];
    
    // If workflowId is provided, get the workflow to use its name
    let workflowName = 'Unknown Workflow';
    if (workflowId) {
      try {
        const workflow = await getWorkflow(workflowId);
        workflowName = workflow.name;
      } catch (e) {
        // Ignore error
      }
    }
    
    // Generate mock runs
    for (let i = 0; i < Math.min(limit, 10); i++) {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - i);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 5);
      
      const status = Math.random() > 0.2 ? 'completed' : 'failed';
      
      mockRuns.push({
        id: `run-${Date.now()}-${i}`,
        workflowId: workflowId || `workflow-${i + 1}`,
        workflowName: workflowId ? workflowName : `Workflow ${i + 1}`,
        status,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        trigger: {
          id: `trigger-${i + 1}`,
          type: Math.random() > 0.5 ? 'schedule' : 'manual',
        },
        actionResults: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
          id: `action-${j + 1}`,
          status: status === 'completed' ? 'completed' : j === 0 ? 'completed' : 'failed',
          startTime: new Date(startTime.getTime() + j * 60000).toISOString(),
          endTime: new Date(startTime.getTime() + (j + 1) * 60000).toISOString(),
          output: status === 'completed' ? { success: true } : undefined,
          error: status === 'failed' && j > 0 ? 'Action execution failed' : undefined,
        })),
        error: status === 'failed' ? 'Workflow execution failed' : undefined,
      });
    }
    
    return mockApiResponse({
      runs: mockRuns,
      total: 25,
      page,
      limit,
      totalPages: Math.ceil(25 / limit),
    });
  }
};

/**
 * Get workflow run by ID
 * @param id Run ID
 * @returns Workflow run
 */
export const getWorkflowRun = async (id: string): Promise<WorkflowRun> => {
  try {
    const response = await enhancedApiClient.get(`/automation/runs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workflow run ${id}:`, error);
    
    // Return mock data for development
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 1);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 5);
    
    const status = Math.random() > 0.2 ? 'completed' : 'failed';
    
    return mockApiResponse({
      id,
      workflowId: 'workflow-1',
      workflowName: 'Social Media Content Schedule',
      status,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      trigger: {
        id: 'trigger-1',
        type: 'schedule',
      },
      actionResults: [
        {
          id: 'action-1',
          status: 'completed',
          startTime: startTime.toISOString(),
          endTime: new Date(startTime.getTime() + 60000).toISOString(),
          output: { contentId: 'content-123' },
        },
        {
          id: 'action-2',
          status: status === 'completed' ? 'completed' : 'failed',
          startTime: new Date(startTime.getTime() + 60000).toISOString(),
          endTime: new Date(startTime.getTime() + 120000).toISOString(),
          output: status === 'completed' ? { scheduled: true } : undefined,
          error: status === 'failed' ? 'Failed to schedule posts' : undefined,
        },
        {
          id: 'action-3',
          status: status === 'completed' ? 'completed' : 'skipped',
          startTime: status === 'completed' ? new Date(startTime.getTime() + 120000).toISOString() : undefined,
          endTime: status === 'completed' ? new Date(startTime.getTime() + 180000).toISOString() : undefined,
          output: status === 'completed' ? { notificationSent: true } : undefined,
        },
      ],
      error: status === 'failed' ? 'Workflow execution failed at action-2' : undefined,
    });
  }
};

/**
 * Get workflow templates
 * @returns List of workflow templates
 */
export const getWorkflowTemplates = async (): Promise<WorkflowTemplate[]> => {
  try {
    const response = await enhancedApiClient.get('/automation/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching workflow templates:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'template-1',
        name: 'Social Media Weekly Schedule',
        description: 'Generate and schedule social media posts on a weekly basis',
        category: 'social-media',
        triggers: [
          {
            type: 'schedule',
            config: {
              schedule: {
                frequency: 'weekly',
                days: ['Monday'],
                time: '09:00',
              },
            },
          },
        ],
        actions: [
          {
            type: 'ai-content',
            name: 'Generate Social Media Content',
            config: {
              aiContent: {
                action: 'generate',
                templateId: 'template-social-media',
                inputs: {
                  topic: 'Latest industry news',
                  tone: 'professional',
                },
                brandVoiceId: 'brand-voice-1',
                saveToHistory: true,
              },
            },
            order: 1,
          },
          {
            type: 'social-media',
            name: 'Schedule Posts',
            config: {
              socialMedia: {
                action: 'schedule',
                platform: ['twitter', 'linkedin'],
                contentSource: 'ai-generated',
                scheduledTime: '{{formatDate(addDays(now(), 1), "YYYY-MM-DD")}T12:00:00Z',
              },
            },
            order: 2,
            dependsOn: ['action-1'],
          },
          {
            type: 'notification',
            name: 'Send Notification',
            config: {
              notification: {
                channels: ['email'],
                recipients: ['user@example.com'],
                subject: 'Social Media Posts Scheduled',
                message: 'Your social media posts have been generated and scheduled for tomorrow.',
                priority: 'normal',
              },
            },
            order: 3,
            dependsOn: ['action-2'],
          },
        ],
        conditions: [],
      },
      {
        id: 'template-2',
        name: 'Content Performance Reporter',
        description: 'Monitor content performance and send weekly reports',
        category: 'analytics',
        triggers: [
          {
            type: 'schedule',
            config: {
              schedule: {
                frequency: 'weekly',
                days: ['Friday'],
                time: '16:00',
              },
            },
          },
        ],
        actions: [
          {
            type: 'data-transformation',
            name: 'Aggregate Performance Data',
            config: {
              dataTransformation: {
                transformations: [
                  {
                    type: 'aggregate',
                    source: 'content.performance',
                    destination: 'performance.summary',
                    config: {
                      groupBy: 'contentType',
                      metrics: ['views', 'engagement', 'conversions'],
                      operations: ['sum', 'avg'],
                    },
                  },
                ],
              },
            },
            order: 1,
          },
          {
            type: 'notification',
            name: 'Send Performance Report',
            config: {
              notification: {
                channels: ['email', 'in-app'],
                recipients: ['user@example.com'],
                subject: 'Weekly Content Performance Report',
                message: 'Your weekly content performance report is ready. See attached for details.',
                priority: 'normal',
              },
            },
            order: 2,
            dependsOn: ['action-1'],
          },
        ],
        conditions: [],
      },
      {
        id: 'template-3',
        name: 'Content Engagement Monitor',
        description: 'Monitor content engagement and generate follow-up content for high-performing posts',
        category: 'content-creation',
        triggers: [
          {
            type: 'event',
            config: {
              event: {
                source: 'analytics',
                name: 'high-engagement-detected',
                parameters: {
                  threshold: 100,
                },
              },
            },
          },
        ],
        actions: [
          {
            type: 'ai-content',
            name: 'Generate Follow-up Content',
            config: {
              aiContent: {
                action: 'generate',
                templateId: 'template-follow-up',
                inputs: {
                  originalContentId: '{{event.contentId}}',
                  engagementMetrics: '{{event.metrics}}',
                },
                brandVoiceId: 'brand-voice-1',
                saveToHistory: true,
              },
            },
            order: 1,
          },
          {
            type: 'notification',
            name: 'Notify Content Team',
            config: {
              notification: {
                channels: ['email', 'in-app'],
                recipients: ['content-team@example.com'],
                subject: 'High Engagement Content - Follow-up Generated',
                message: 'A piece of content has received high engagement. A follow-up has been generated for your review.',
                priority: 'high',
              },
            },
            order: 2,
            dependsOn: ['action-1'],
          },
        ],
        conditions: [],
      },
    ]);
  }
};

/**
 * Create workflow from template
 * @param templateId Template ID
 * @param customizations Customizations to apply to the template
 * @returns Created workflow
 */
export const createWorkflowFromTemplate = async (
  templateId: string,
  customizations: {
    name?: string;
    description?: string;
    triggerCustomizations?: Record<string, any>;
    actionCustomizations?: Record<string, any>;
  }
): Promise<Workflow> => {
  try {
    const response = await enhancedApiClient.post('/automation/workflows/from-template', {
      templateId,
      customizations,
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating workflow from template ${templateId}:`, error);
    
    // Return mock data for development
    const templates = await getWorkflowTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Apply customizations
    const name = customizations.name || template.name;
    const description = customizations.description || template.description;
    
    // Generate IDs for triggers, actions, and conditions
    const triggers = template.triggers.map((trigger, index) => ({
      ...trigger,
      id: `trigger-${Date.now()}-${index}`,
    }));
    
    const actions = template.actions.map((action, index) => ({
      ...action,
      id: `action-${Date.now()}-${index}`,
    }));
    
    const conditions = template.conditions.map((condition, index) => ({
      ...condition,
      id: `condition-${Date.now()}-${index}`,
    }));
    
    return mockApiResponse({
      id: `workflow-${Date.now()}`,
      name,
      description,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers,
      actions,
      conditions,
      stats: {
        runsTotal: 0,
        runsSuccess: 0,
        runsFailure: 0,
        lastRun: null,
      },
    });
  }
};
