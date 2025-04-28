import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

/**
 * Action Type
 */
export interface ActionType {
  id: string;
  type: 'social-media' | 'ai-content' | 'notification' | 'api-request' | 'data-transformation';
  name: string;
  description: string;
  category: 'content' | 'communication' | 'data' | 'integration';
  configSchema: {
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
      enum?: string[];
      default?: any;
    }>;
    required: string[];
  };
}

/**
 * Action Template
 */
export interface ActionTemplate {
  id: string;
  actionTypeId: string;
  name: string;
  description: string;
  config: Record<string, any>;
  category: 'content' | 'communication' | 'data' | 'integration';
}

/**
 * Get available action types
 * @returns List of available action types
 */
export const getActionTypes = async (): Promise<ActionType[]> => {
  try {
    const response = await enhancedApiClient.get('/automation/actions/types');
    return response.data;
  } catch (error) {
    console.error('Error fetching action types:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'action-type-1',
        type: 'social-media',
        name: 'Social Media Post',
        description: 'Post or schedule content to social media platforms',
        category: 'content',
        configSchema: {
          properties: {
            action: {
              type: 'string',
              description: 'Action to perform',
              required: true,
              enum: ['post', 'schedule', 'analyze'],
            },
            platform: {
              type: 'array',
              description: 'Social media platforms',
              required: true,
              items: {
                type: 'string',
                enum: ['twitter', 'linkedin', 'facebook', 'instagram'],
              },
            },
            content: {
              type: 'string',
              description: 'Content to post',
              required: false,
            },
            contentSource: {
              type: 'string',
              description: 'Source of content',
              required: true,
              enum: ['direct', 'template', 'ai-generated'],
              default: 'direct',
            },
            contentTemplateId: {
              type: 'string',
              description: 'ID of content template',
              required: false,
            },
            contentGenerationParams: {
              type: 'object',
              description: 'Parameters for AI content generation',
              required: false,
            },
            scheduledTime: {
              type: 'string',
              description: 'Scheduled time for posting',
              required: false,
            },
          },
          required: ['action', 'platform', 'contentSource'],
        },
      },
      {
        id: 'action-type-2',
        type: 'ai-content',
        name: 'AI Content Generation',
        description: 'Generate content using AI',
        category: 'content',
        configSchema: {
          properties: {
            action: {
              type: 'string',
              description: 'Action to perform',
              required: true,
              enum: ['generate', 'analyze', 'save', 'export'],
            },
            templateId: {
              type: 'string',
              description: 'ID of content template',
              required: false,
            },
            inputs: {
              type: 'object',
              description: 'Input parameters for content generation',
              required: false,
            },
            brandVoiceId: {
              type: 'string',
              description: 'ID of brand voice profile',
              required: false,
            },
            outputFormat: {
              type: 'string',
              description: 'Format of output content',
              required: false,
              enum: ['text', 'html', 'markdown', 'json'],
              default: 'text',
            },
            saveToHistory: {
              type: 'boolean',
              description: 'Whether to save generated content to history',
              required: false,
              default: true,
            },
          },
          required: ['action'],
        },
      },
      {
        id: 'action-type-3',
        type: 'notification',
        name: 'Send Notification',
        description: 'Send notifications via various channels',
        category: 'communication',
        configSchema: {
          properties: {
            channels: {
              type: 'array',
              description: 'Notification channels',
              required: true,
              items: {
                type: 'string',
                enum: ['email', 'push', 'in-app'],
              },
            },
            recipients: {
              type: 'array',
              description: 'Notification recipients',
              required: true,
              items: {
                type: 'string',
              },
            },
            subject: {
              type: 'string',
              description: 'Notification subject',
              required: true,
            },
            message: {
              type: 'string',
              description: 'Notification message',
              required: true,
            },
            priority: {
              type: 'string',
              description: 'Notification priority',
              required: false,
              enum: ['low', 'normal', 'high'],
              default: 'normal',
            },
          },
          required: ['channels', 'recipients', 'subject', 'message'],
        },
      },
      {
        id: 'action-type-4',
        type: 'api-request',
        name: 'API Request',
        description: 'Make HTTP requests to external APIs',
        category: 'integration',
        configSchema: {
          properties: {
            url: {
              type: 'string',
              description: 'API endpoint URL',
              required: true,
            },
            method: {
              type: 'string',
              description: 'HTTP method',
              required: true,
              enum: ['GET', 'POST', 'PUT', 'DELETE'],
              default: 'GET',
            },
            headers: {
              type: 'object',
              description: 'HTTP headers',
              required: false,
            },
            body: {
              type: 'object',
              description: 'Request body',
              required: false,
            },
            authentication: {
              type: 'object',
              description: 'Authentication details',
              required: false,
              properties: {
                type: {
                  type: 'string',
                  enum: ['none', 'basic', 'bearer', 'api-key'],
                  default: 'none',
                },
                username: {
                  type: 'string',
                  required: false,
                },
                password: {
                  type: 'string',
                  required: false,
                },
                token: {
                  type: 'string',
                  required: false,
                },
                apiKey: {
                  type: 'string',
                  required: false,
                },
                apiKeyName: {
                  type: 'string',
                  required: false,
                },
              },
            },
          },
          required: ['url', 'method'],
        },
      },
      {
        id: 'action-type-5',
        type: 'data-transformation',
        name: 'Data Transformation',
        description: 'Transform data between workflow steps',
        category: 'data',
        configSchema: {
          properties: {
            transformations: {
              type: 'array',
              description: 'List of transformations to apply',
              required: true,
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['map', 'filter', 'sort', 'group', 'aggregate'],
                    required: true,
                  },
                  source: {
                    type: 'string',
                    description: 'Source data path',
                    required: true,
                  },
                  destination: {
                    type: 'string',
                    description: 'Destination data path',
                    required: true,
                  },
                  config: {
                    type: 'object',
                    description: 'Transformation configuration',
                    required: true,
                  },
                },
              },
            },
          },
          required: ['transformations'],
        },
      },
    ]);
  }
};

/**
 * Get action type by ID
 * @param id Action type ID
 * @returns Action type
 */
export const getActionType = async (id: string): Promise<ActionType> => {
  try {
    const response = await enhancedApiClient.get(`/automation/actions/types/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching action type ${id}:`, error);
    
    // Return mock data for development
    const actionTypes = await getActionTypes();
    const actionType = actionTypes.find(at => at.id === id);
    
    if (actionType) {
      return mockApiResponse(actionType);
    }
    
    throw new Error(`Action type with ID ${id} not found`);
  }
};

/**
 * Get action templates
 * @param actionTypeId Optional action type ID to filter templates
 * @returns List of action templates
 */
export const getActionTemplates = async (actionTypeId?: string): Promise<ActionTemplate[]> => {
  try {
    const response = await enhancedApiClient.get('/automation/actions/templates', {
      params: { actionTypeId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching action templates:', error);
    
    // Return mock data for development
    const mockTemplates: ActionTemplate[] = [
      {
        id: 'template-action-1',
        actionTypeId: 'action-type-1',
        name: 'Weekly LinkedIn Post',
        description: 'Schedule a post to LinkedIn every week',
        category: 'content',
        config: {
          action: 'schedule',
          platform: ['linkedin'],
          contentSource: 'ai-generated',
          contentGenerationParams: {
            topic: 'industry news',
            tone: 'professional',
          },
          scheduledTime: '{{formatDate(addDays(now(), 1), "YYYY-MM-DD")}T12:00:00Z',
        },
      },
      {
        id: 'template-action-2',
        actionTypeId: 'action-type-1',
        name: 'Multi-Platform Social Share',
        description: 'Share content across multiple social platforms',
        category: 'content',
        config: {
          action: 'post',
          platform: ['twitter', 'linkedin', 'facebook'],
          contentSource: 'direct',
          content: 'Check out our latest blog post: {{blogPost.title}} {{blogPost.url}}',
        },
      },
      {
        id: 'template-action-3',
        actionTypeId: 'action-type-2',
        name: 'Blog Post Generator',
        description: 'Generate a blog post using AI',
        category: 'content',
        config: {
          action: 'generate',
          templateId: 'template-blog-post',
          inputs: {
            topic: '{{workflow.topic}}',
            keywords: '{{workflow.keywords}}',
            length: 'medium',
          },
          brandVoiceId: 'brand-voice-1',
          outputFormat: 'markdown',
          saveToHistory: true,
        },
      },
      {
        id: 'template-action-4',
        actionTypeId: 'action-type-3',
        name: 'Content Team Notification',
        description: 'Notify content team about new content',
        category: 'communication',
        config: {
          channels: ['email', 'in-app'],
          recipients: ['content-team@example.com'],
          subject: 'New Content Generated: {{content.title}}',
          message: 'A new piece of content has been generated and is ready for review: {{content.title}}',
          priority: 'normal',
        },
      },
      {
        id: 'template-action-5',
        actionTypeId: 'action-type-4',
        name: 'CRM Integration',
        description: 'Send data to CRM system',
        category: 'integration',
        config: {
          url: 'https://api.crm.example.com/contacts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            name: '{{lead.name}}',
            email: '{{lead.email}}',
            source: 'Genius Navigator',
          },
          authentication: {
            type: 'api-key',
            apiKey: '{{secrets.crm_api_key}}',
            apiKeyName: 'X-API-Key',
          },
        },
      },
    ];
    
    if (actionTypeId) {
      return mockApiResponse(mockTemplates.filter(t => t.actionTypeId === actionTypeId));
    }
    
    return mockApiResponse(mockTemplates);
  }
};

/**
 * Get action template by ID
 * @param id Action template ID
 * @returns Action template
 */
export const getActionTemplate = async (id: string): Promise<ActionTemplate> => {
  try {
    const response = await enhancedApiClient.get(`/automation/actions/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching action template ${id}:`, error);
    
    // Return mock data for development
    const templates = await getActionTemplates();
    const template = templates.find(t => t.id === id);
    
    if (template) {
      return mockApiResponse(template);
    }
    
    throw new Error(`Action template with ID ${id} not found`);
  }
};

/**
 * Create action template
 * @param template Action template data
 * @returns Created action template
 */
export const createActionTemplate = async (
  template: Omit<ActionTemplate, 'id'>
): Promise<ActionTemplate> => {
  try {
    const response = await enhancedApiClient.post('/automation/actions/templates', template);
    return response.data;
  } catch (error) {
    console.error('Error creating action template:', error);
    
    // Return mock data for development
    return mockApiResponse({
      ...template,
      id: `template-action-${Date.now()}`,
    });
  }
};

/**
 * Update action template
 * @param id Action template ID
 * @param template Action template data
 * @returns Updated action template
 */
export const updateActionTemplate = async (
  id: string,
  template: Partial<Omit<ActionTemplate, 'id'>>
): Promise<ActionTemplate> => {
  try {
    const response = await enhancedApiClient.put(`/automation/actions/templates/${id}`, template);
    return response.data;
  } catch (error) {
    console.error(`Error updating action template ${id}:`, error);
    
    // Return mock data for development
    const templates = await getActionTemplates();
    const existingTemplate = templates.find(t => t.id === id);
    
    if (!existingTemplate) {
      throw new Error(`Action template with ID ${id} not found`);
    }
    
    return mockApiResponse({
      ...existingTemplate,
      ...template,
    });
  }
};

/**
 * Delete action template
 * @param id Action template ID
 * @returns Success status
 */
export const deleteActionTemplate = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.delete(`/automation/actions/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting action template ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({ success: true });
  }
};

/**
 * Test action with provided configuration
 * @param actionTypeId Action type ID
 * @param config Action configuration
 * @returns Test result
 */
export const testAction = async (
  actionTypeId: string,
  config: Record<string, any>
): Promise<{
  success: boolean;
  message: string;
  output?: any;
  error?: string;
}> => {
  try {
    const response = await enhancedApiClient.post('/automation/actions/test', {
      actionTypeId,
      config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error testing action ${actionTypeId}:`, error);
    
    // Return mock data for development
    const success = Math.random() > 0.2; // 80% chance of success
    
    if (success) {
      return mockApiResponse({
        success: true,
        message: 'Action executed successfully',
        output: {
          result: 'Sample output from action execution',
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      return mockApiResponse({
        success: false,
        message: 'Action execution failed',
        error: 'Invalid configuration or external service unavailable',
      });
    }
  }
};
