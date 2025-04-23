/**
 * Project Service API
 * 
 * This module provides API methods for project-related operations.
 */

import { apiClient, ApiResponse } from './apiClient';

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  endDate: string;
  budget?: number;
  clientId?: string;
  teamMembers: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateInput {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  budget?: number;
  clientId?: string;
  teamMembers?: string[];
  tags?: string[];
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId?: string;
  teamMembers?: string[];
  tags?: string[];
}

export interface ProjectFilters {
  status?: ('active' | 'completed' | 'on-hold' | 'archived')[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  clientId?: string;
  teamMemberId?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Project Service class for project-related API operations
 */
class ProjectService {
  private readonly basePath = '/projects';

  /**
   * Get a list of projects with optional filtering
   */
  public async getProjects(
    filters?: ProjectFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<ProjectListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
          queryParams.append('status', status);
        });
      }
      
      if (filters.priority && filters.priority.length > 0) {
        filters.priority.forEach(priority => {
          queryParams.append('priority', priority);
        });
      }
      
      if (filters.clientId) {
        queryParams.append('clientId', filters.clientId);
      }
      
      if (filters.teamMemberId) {
        queryParams.append('teamMemberId', filters.teamMemberId);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters.startDateFrom) {
        queryParams.append('startDateFrom', filters.startDateFrom);
      }
      
      if (filters.startDateTo) {
        queryParams.append('startDateTo', filters.startDateTo);
      }
      
      if (filters.endDateFrom) {
        queryParams.append('endDateFrom', filters.endDateFrom);
      }
      
      if (filters.endDateTo) {
        queryParams.append('endDateTo', filters.endDateTo);
      }
    }
    
    const url = `${this.basePath}?${queryParams.toString()}`;
    return apiClient.get<ProjectListResponse>(url);
  }

  /**
   * Get a project by ID
   */
  public async getProject(id: string): Promise<ApiResponse<Project>> {
    return apiClient.get<Project>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new project
   */
  public async createProject(project: ProjectCreateInput): Promise<ApiResponse<Project>> {
    return apiClient.post<Project>(this.basePath, project);
  }

  /**
   * Update an existing project
   */
  public async updateProject(id: string, project: ProjectUpdateInput): Promise<ApiResponse<Project>> {
    return apiClient.put<Project>(`${this.basePath}/${id}`, project);
  }

  /**
   * Delete a project
   */
  public async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Update project progress
   */
  public async updateProgress(id: string, progress: number): Promise<ApiResponse<Project>> {
    return apiClient.patch<Project>(`${this.basePath}/${id}/progress`, { progress });
  }

  /**
   * Add team members to a project
   */
  public async addTeamMembers(id: string, memberIds: string[]): Promise<ApiResponse<Project>> {
    return apiClient.post<Project>(`${this.basePath}/${id}/team-members`, { memberIds });
  }

  /**
   * Remove team members from a project
   */
  public async removeTeamMembers(id: string, memberIds: string[]): Promise<ApiResponse<Project>> {
    return apiClient.delete<Project>(`${this.basePath}/${id}/team-members`, {
      data: { memberIds }
    });
  }

  /**
   * Get project statistics
   */
  public async getProjectStats(): Promise<ApiResponse<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    onHoldProjects: number;
    averageProgress: number;
  }>> {
    return apiClient.get<any>(`${this.basePath}/stats`);
  }
}

// Create and export a singleton instance
export const projectService = new ProjectService();

// Export the class for testing or custom instances
export default ProjectService;
