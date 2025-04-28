/**
 * Automation Service API
 * 
 * This module provides API methods for automation-related operations,
 * including workflow automations, triggers, and actions.
 */

import { apiClient, ApiResponse } from './apiClient';

// Types
export interface Automation {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: Trigger;
  conditions: Condition[];
  actions: Action[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
  averageExecutionTime?: number; // in milliseconds
}

export type TriggerType = 
  | 'project_created'
  | 'project_updated'
  | 'project_status_changed'
  | 'task_created'
  | 'task_updated'
  | 'task_status_changed'
  | 'task_assigned'
  | 'task_due_soon'
  | 'task_overdue'
  | 'comment_added'
  | 'document_uploaded'
  | 'client_feedback'
  | 'schedule';

export interface Trigger {
  id: string;
  type: TriggerType;
  config: Record<string, any>; // Configuration specific to trigger type
}

export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';

export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
}

export type ActionType = 
  | 'create_task'
  | 'update_task'
  | 'assign_task'
  | 'send_notification'
  | 'send_email'
  | 'update_project'
  | 'create_document'
  | 'add_comment'
  | 'webhook';

export interface Action {
  id: string;
  type: ActionType;
  config: Record<string, any>; // Configuration specific to action type
  order: number;
}

export interface AutomationCreateInput {
  name: string;
  description: string;
  isActive: boolean;
  trigger: Omit<Trigger, 'id'>;
  conditions: Omit<Condition, 'id'>[];
  actions: Omit<Action, 'id'>[];
}

export interface AutomationUpdateInput {
  name?: string;
  description?: string;
  isActive?: boolean;
  trigger?: Omit<Trigger, 'id'>;
  conditions?: Omit<Condition, 'id'>[];
  actions?: Omit<Action, 'id'>[];
}

export interface AutomationFilters {
  isActive?: boolean;
  triggerType?: TriggerType[];
  actionType?: ActionType[];
  search?: string;
  createdBy?: string;
}

export interface AutomationListResponse {
  automations: Automation[];
  total: number;
  page: number;
  limit: number;
}

export interface AutomationExecutionLog {
  id: string;
  automationId: string;
  automationName: string;
  triggerType: TriggerType;
  triggerData: Record<string, any>;
  executionTime: number; // in milliseconds
  status: 'success' | 'partial_success' | 'failed';
  actionResults: {
    actionId: string;
    actionType: ActionType;
    status: 'success' | 'failed';
    result?: any;
    error?: string;
  }[];
  timestamp: string;
}

export interface AutomationExecutionLogFilters {
  automationId?: string;
  status?: ('success' | 'partial_success' | 'failed')[];
  triggerType?: TriggerType[];
  startDate?: string;
  endDate?: string;
}

export interface AutomationExecutionLogListResponse {
  logs: AutomationExecutionLog[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Automation Service class for automation-related API operations
 */
class AutomationService {
  private readonly basePath = '/automations';
  private readonly logsPath = '/execution-logs';
  private readonly triggersPath = '/triggers';
  private readonly actionsPath = '/actions';

  /**
   * Get a list of automations with optional filtering
   */
  public async getAutomations(
    filters?: AutomationFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<AutomationListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.isActive !== undefined) {
        queryParams.append('isActive', filters.isActive.toString());
      }
      
      if (filters.triggerType && filters.triggerType.length > 0) {
        filters.triggerType.forEach(type => {
          queryParams.append('triggerType', type);
        });
      }
      
      if (filters.actionType && filters.actionType.length > 0) {
        filters.actionType.forEach(type => {
          queryParams.append('actionType', type);
        });
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters.createdBy) {
        queryParams.append('createdBy', filters.createdBy);
      }
    }
    
    const url = `${this.basePath}?${queryParams.toString()}`;
    return apiClient.get<AutomationListResponse>(url);
  }

  /**
   * Get an automation by ID
   */
  public async getAutomation(id: string): Promise<ApiResponse<Automation>> {
    return apiClient.get<Automation>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new automation
   */
  public async createAutomation(automation: AutomationCreateInput): Promise<ApiResponse<Automation>> {
    return apiClient.post<Automation>(this.basePath, automation);
  }

  /**
   * Update an existing automation
   */
  public async updateAutomation(id: string, automation: AutomationUpdateInput): Promise<ApiResponse<Automation>> {
    return apiClient.put<Automation>(`${this.basePath}/${id}`, automation);
  }

  /**
   * Delete an automation
   */
  public async deleteAutomation(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Enable an automation
   */
  public async enableAutomation(id: string): Promise<ApiResponse<Automation>> {
    return apiClient.patch<Automation>(`${this.basePath}/${id}/enable`, {});
  }

  /**
   * Disable an automation
   */
  public async disableAutomation(id: string): Promise<ApiResponse<Automation>> {
    return apiClient.patch<Automation>(`${this.basePath}/${id}/disable`, {});
  }

  /**
   * Run an automation manually
   */
  public async runAutomation(id: string, data?: Record<string, any>): Promise<ApiResponse<AutomationExecutionLog>> {
    return apiClient.post<AutomationExecutionLog>(`${this.basePath}/${id}/run`, data || {});
  }

  /**
   * Get execution logs for automations
   */
  public async getExecutionLogs(
    filters?: AutomationExecutionLogFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<AutomationExecutionLogListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.automationId) {
        queryParams.append('automationId', filters.automationId);
      }
      
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
          queryParams.append('status', status);
        });
      }
      
      if (filters.triggerType && filters.triggerType.length > 0) {
        filters.triggerType.forEach(type => {
          queryParams.append('triggerType', type);
        });
      }
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }
    }
    
    const url = `${this.logsPath}?${queryParams.toString()}`;
    return apiClient.get<AutomationExecutionLogListResponse>(url);
  }

  /**
   * Get execution log by ID
   */
  public async getExecutionLog(id: string): Promise<ApiResponse<AutomationExecutionLog>> {
    return apiClient.get<AutomationExecutionLog>(`${this.logsPath}/${id}`);
  }

  /**
   * Get available triggers
   */
  public async getAvailableTriggers(): Promise<ApiResponse<{
    triggerTypes: {
      type: TriggerType;
      name: string;
      description: string;
      configSchema: Record<string, any>;
    }[];
  }>> {
    return apiClient.get<any>(this.triggersPath);
  }

  /**
   * Get available actions
   */
  public async getAvailableActions(): Promise<ApiResponse<{
    actionTypes: {
      type: ActionType;
      name: string;
      description: string;
      configSchema: Record<string, any>;
    }[];
  }>> {
    return apiClient.get<any>(this.actionsPath);
  }

  /**
   * Get automation statistics
   */
  public async getAutomationStats(): Promise<ApiResponse<{
    totalAutomations: number;
    activeAutomations: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    mostUsedTriggers: { type: TriggerType; count: number }[];
    mostUsedActions: { type: ActionType; count: number }[];
  }>> {
    return apiClient.get<any>(`${this.basePath}/stats`);
  }
}

// Create and export a singleton instance
export const automationService = new AutomationService();

// Export the class for testing or custom instances
export default AutomationService;
