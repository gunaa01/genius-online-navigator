import { enhancedApiClient, mockApiResponse } from '@/services/apiClient';

/**
 * Trigger Event
 */
export interface TriggerEvent {
  id: string;
  source: 'social-media' | 'ai-content' | 'analytics' | 'system';
  name: string;
  description: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required: boolean;
    defaultValue?: any;
  }[];
}

/**
 * Webhook Configuration
 */
export interface WebhookConfiguration {
  id: string;
  name: string;
  url: string;
  secret: string;
  createdAt: string;
  updatedAt: string;
  workflowId: string;
  triggerId: string;
  status: 'active' | 'inactive';
  lastTriggered?: string;
}

/**
 * Get available trigger events
 * @returns List of available trigger events
 */
export const getTriggerEvents = async (): Promise<TriggerEvent[]> => {
  try {
    const response = await enhancedApiClient.get('/automation/triggers/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching trigger events:', error);
    
    // Return mock data for development
    return mockApiResponse([
      {
        id: 'event-1',
        source: 'social-media',
        name: 'post-published',
        description: 'Triggered when a social media post is published',
        parameters: [
          {
            name: 'platform',
            type: 'string',
            description: 'Social media platform',
            required: true,
          },
          {
            name: 'postId',
            type: 'string',
            description: 'ID of the published post',
            required: true,
          },
        ],
      },
      {
        id: 'event-2',
        source: 'social-media',
        name: 'engagement-threshold-reached',
        description: 'Triggered when a social media post reaches an engagement threshold',
        parameters: [
          {
            name: 'platform',
            type: 'string',
            description: 'Social media platform',
            required: true,
          },
          {
            name: 'postId',
            type: 'string',
            description: 'ID of the post',
            required: true,
          },
          {
            name: 'engagementType',
            type: 'string',
            description: 'Type of engagement (likes, comments, shares)',
            required: true,
          },
          {
            name: 'threshold',
            type: 'number',
            description: 'Engagement threshold',
            required: true,
            defaultValue: 100,
          },
        ],
      },
      {
        id: 'event-3',
        source: 'ai-content',
        name: 'content-generated',
        description: 'Triggered when AI content is generated',
        parameters: [
          {
            name: 'contentId',
            type: 'string',
            description: 'ID of the generated content',
            required: true,
          },
          {
            name: 'contentType',
            type: 'string',
            description: 'Type of content generated',
            required: true,
          },
        ],
      },
      {
        id: 'event-4',
        source: 'analytics',
        name: 'high-engagement-detected',
        description: 'Triggered when high engagement is detected on content',
        parameters: [
          {
            name: 'contentId',
            type: 'string',
            description: 'ID of the content',
            required: true,
          },
          {
            name: 'contentType',
            type: 'string',
            description: 'Type of content',
            required: true,
          },
          {
            name: 'metrics',
            type: 'object',
            description: 'Engagement metrics',
            required: true,
          },
          {
            name: 'threshold',
            type: 'number',
            description: 'Engagement threshold that was exceeded',
            required: true,
            defaultValue: 100,
          },
        ],
      },
      {
        id: 'event-5',
        source: 'system',
        name: 'workflow-completed',
        description: 'Triggered when a workflow completes execution',
        parameters: [
          {
            name: 'workflowId',
            type: 'string',
            description: 'ID of the completed workflow',
            required: true,
          },
          {
            name: 'runId',
            type: 'string',
            description: 'ID of the workflow run',
            required: true,
          },
          {
            name: 'status',
            type: 'string',
            description: 'Status of the workflow run',
            required: true,
          },
        ],
      },
    ]);
  }
};

/**
 * Get trigger event by ID
 * @param id Trigger event ID
 * @returns Trigger event
 */
export const getTriggerEvent = async (id: string): Promise<TriggerEvent> => {
  try {
    const response = await enhancedApiClient.get(`/automation/triggers/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trigger event ${id}:`, error);
    
    // Return mock data for development
    const events = await getTriggerEvents();
    const event = events.find(e => e.id === id);
    
    if (event) {
      return mockApiResponse(event);
    }
    
    throw new Error(`Trigger event with ID ${id} not found`);
  }
};

/**
 * Get webhook configurations
 * @param workflowId Optional workflow ID to filter webhooks
 * @returns List of webhook configurations
 */
export const getWebhookConfigurations = async (workflowId?: string): Promise<WebhookConfiguration[]> => {
  try {
    const response = await enhancedApiClient.get('/automation/triggers/webhooks', {
      params: { workflowId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching webhook configurations:', error);
    
    // Return mock data for development
    const mockWebhooks: WebhookConfiguration[] = [
      {
        id: 'webhook-1',
        name: 'External API Integration',
        url: 'https://api.example.com/webhook/genius-navigator',
        secret: 'wh_secret_123456',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        workflowId: 'workflow-3',
        triggerId: 'trigger-3',
        status: 'active',
        lastTriggered: '2025-01-15T10:30:00Z',
      },
      {
        id: 'webhook-2',
        name: 'CRM Integration',
        url: 'https://crm.example.com/api/webhook',
        secret: 'wh_secret_abcdef',
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z',
        workflowId: 'workflow-4',
        triggerId: 'trigger-4',
        status: 'active',
      },
    ];
    
    if (workflowId) {
      return mockApiResponse(mockWebhooks.filter(wh => wh.workflowId === workflowId));
    }
    
    return mockApiResponse(mockWebhooks);
  }
};

/**
 * Create webhook configuration
 * @param webhook Webhook configuration data
 * @returns Created webhook configuration
 */
export const createWebhookConfiguration = async (
  webhook: Omit<WebhookConfiguration, 'id' | 'createdAt' | 'updatedAt' | 'secret' | 'lastTriggered'>
): Promise<WebhookConfiguration> => {
  try {
    const response = await enhancedApiClient.post('/automation/triggers/webhooks', webhook);
    return response.data;
  } catch (error) {
    console.error('Error creating webhook configuration:', error);
    
    // Return mock data for development
    return mockApiResponse({
      ...webhook,
      id: `webhook-${Date.now()}`,
      secret: `wh_secret_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * Update webhook configuration
 * @param id Webhook configuration ID
 * @param webhook Webhook configuration data
 * @returns Updated webhook configuration
 */
export const updateWebhookConfiguration = async (
  id: string,
  webhook: Partial<Omit<WebhookConfiguration, 'id' | 'createdAt' | 'updatedAt' | 'secret' | 'lastTriggered'>>
): Promise<WebhookConfiguration> => {
  try {
    const response = await enhancedApiClient.put(`/automation/triggers/webhooks/${id}`, webhook);
    return response.data;
  } catch (error) {
    console.error(`Error updating webhook configuration ${id}:`, error);
    
    // Return mock data for development
    const webhooks = await getWebhookConfigurations();
    const existingWebhook = webhooks.find(wh => wh.id === id);
    
    if (!existingWebhook) {
      throw new Error(`Webhook configuration with ID ${id} not found`);
    }
    
    return mockApiResponse({
      ...existingWebhook,
      ...webhook,
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * Delete webhook configuration
 * @param id Webhook configuration ID
 * @returns Success status
 */
export const deleteWebhookConfiguration = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await enhancedApiClient.delete(`/automation/triggers/webhooks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting webhook configuration ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({ success: true });
  }
};

/**
 * Regenerate webhook secret
 * @param id Webhook configuration ID
 * @returns Updated webhook configuration with new secret
 */
export const regenerateWebhookSecret = async (id: string): Promise<WebhookConfiguration> => {
  try {
    const response = await enhancedApiClient.post(`/automation/triggers/webhooks/${id}/regenerate-secret`);
    return response.data;
  } catch (error) {
    console.error(`Error regenerating webhook secret for ${id}:`, error);
    
    // Return mock data for development
    const webhooks = await getWebhookConfigurations();
    const existingWebhook = webhooks.find(wh => wh.id === id);
    
    if (!existingWebhook) {
      throw new Error(`Webhook configuration with ID ${id} not found`);
    }
    
    return mockApiResponse({
      ...existingWebhook,
      secret: `wh_secret_${Math.random().toString(36).substring(2, 10)}`,
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * Test webhook
 * @param id Webhook configuration ID
 * @returns Test result
 */
export const testWebhook = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await enhancedApiClient.post(`/automation/triggers/webhooks/${id}/test`);
    return response.data;
  } catch (error) {
    console.error(`Error testing webhook ${id}:`, error);
    
    // Return mock data for development
    return mockApiResponse({
      success: Math.random() > 0.2, // 80% chance of success
      message: Math.random() > 0.2 
        ? 'Webhook test successful. Received 200 OK response.' 
        : 'Webhook test failed. Received 404 Not Found response.',
    });
  }
};
