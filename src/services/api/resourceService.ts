/**
 * Resource Service API
 * 
 * This module provides API methods for resource management operations,
 * including team members, skills, and resource allocation.
 */

import { apiClient, ApiResponse } from './apiClient';

// Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  skills: Skill[];
  availability: Availability;
  workload: number; // 0-100%
  hourlyRate?: number;
  projects: ProjectAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Availability {
  status: 'available' | 'partially_available' | 'unavailable';
  schedule: ScheduleEntry[];
  vacationDays: VacationPeriod[];
  weeklyCapacity: number; // Hours per week
}

export interface ScheduleEntry {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  available: boolean;
}

export interface VacationPeriod {
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ProjectAssignment {
  projectId: string;
  projectName: string;
  role: string;
  allocation: number; // 0-100%
  startDate: string;
  endDate: string;
}

export interface TeamMemberCreateInput {
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  skills?: Omit<Skill, 'id'>[];
  availability?: Omit<Availability, 'schedule'> & {
    schedule?: Omit<ScheduleEntry, 'id'>[];
  };
  hourlyRate?: number;
}

export interface TeamMemberUpdateInput {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  avatar?: string;
  hourlyRate?: number;
}

export interface TeamMemberFilters {
  role?: string[];
  department?: string[];
  skills?: string[];
  availability?: ('available' | 'partially_available' | 'unavailable')[];
  search?: string;
  projectId?: string;
}

export interface TeamMemberListResponse {
  teamMembers: TeamMember[];
  total: number;
  page: number;
  limit: number;
}

export interface ResourceAllocation {
  teamMemberId: string;
  projectId: string;
  role: string;
  allocation: number; // 0-100%
  startDate: string;
  endDate: string;
}

export interface ResourceAllocationCreateInput {
  teamMemberId: string;
  projectId: string;
  role: string;
  allocation: number; // 0-100%
  startDate: string;
  endDate: string;
}

export interface ResourceAllocationUpdateInput {
  role?: string;
  allocation?: number; // 0-100%
  startDate?: string;
  endDate?: string;
}

/**
 * Resource Service class for resource management API operations
 */
class ResourceService {
  private readonly basePath = '/resources';
  private readonly teamMembersPath = '/team-members';
  private readonly allocationsPath = '/allocations';
  private readonly skillsPath = '/skills';

  /**
   * Get a list of team members with optional filtering
   */
  public async getTeamMembers(
    filters?: TeamMemberFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<TeamMemberListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.role && filters.role.length > 0) {
        filters.role.forEach(role => {
          queryParams.append('role', role);
        });
      }
      
      if (filters.department && filters.department.length > 0) {
        filters.department.forEach(department => {
          queryParams.append('department', department);
        });
      }
      
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => {
          queryParams.append('skills', skill);
        });
      }
      
      if (filters.availability && filters.availability.length > 0) {
        filters.availability.forEach(availability => {
          queryParams.append('availability', availability);
        });
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters.projectId) {
        queryParams.append('projectId', filters.projectId);
      }
    }
    
    const url = `${this.teamMembersPath}?${queryParams.toString()}`;
    return apiClient.get<TeamMemberListResponse>(url);
  }

  /**
   * Get a team member by ID
   */
  public async getTeamMember(id: string): Promise<ApiResponse<TeamMember>> {
    return apiClient.get<TeamMember>(`${this.teamMembersPath}/${id}`);
  }

  /**
   * Create a new team member
   */
  public async createTeamMember(teamMember: TeamMemberCreateInput): Promise<ApiResponse<TeamMember>> {
    return apiClient.post<TeamMember>(this.teamMembersPath, teamMember);
  }

  /**
   * Update an existing team member
   */
  public async updateTeamMember(id: string, teamMember: TeamMemberUpdateInput): Promise<ApiResponse<TeamMember>> {
    return apiClient.put<TeamMember>(`${this.teamMembersPath}/${id}`, teamMember);
  }

  /**
   * Delete a team member
   */
  public async deleteTeamMember(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.teamMembersPath}/${id}`);
  }

  /**
   * Add skills to a team member
   */
  public async addSkills(teamMemberId: string, skills: Omit<Skill, 'id'>[]): Promise<ApiResponse<TeamMember>> {
    return apiClient.post<TeamMember>(`${this.teamMembersPath}/${teamMemberId}/skills`, { skills });
  }

  /**
   * Remove skills from a team member
   */
  public async removeSkills(teamMemberId: string, skillIds: string[]): Promise<ApiResponse<TeamMember>> {
    return apiClient.delete<TeamMember>(`${this.teamMembersPath}/${teamMemberId}/skills`, {
      data: { skillIds }
    });
  }

  /**
   * Update team member availability
   */
  public async updateAvailability(teamMemberId: string, availability: Availability): Promise<ApiResponse<TeamMember>> {
    return apiClient.put<TeamMember>(`${this.teamMembersPath}/${teamMemberId}/availability`, availability);
  }

  /**
   * Add vacation period for a team member
   */
  public async addVacation(teamMemberId: string, vacation: VacationPeriod): Promise<ApiResponse<TeamMember>> {
    return apiClient.post<TeamMember>(`${this.teamMembersPath}/${teamMemberId}/vacations`, vacation);
  }

  /**
   * Get resource allocations for a project
   */
  public async getProjectAllocations(projectId: string): Promise<ApiResponse<ResourceAllocation[]>> {
    return apiClient.get<ResourceAllocation[]>(`${this.allocationsPath}/project/${projectId}`);
  }

  /**
   * Get resource allocations for a team member
   */
  public async getTeamMemberAllocations(teamMemberId: string): Promise<ApiResponse<ResourceAllocation[]>> {
    return apiClient.get<ResourceAllocation[]>(`${this.allocationsPath}/team-member/${teamMemberId}`);
  }

  /**
   * Create a new resource allocation
   */
  public async createAllocation(allocation: ResourceAllocationCreateInput): Promise<ApiResponse<ResourceAllocation>> {
    return apiClient.post<ResourceAllocation>(this.allocationsPath, allocation);
  }

  /**
   * Update an existing resource allocation
   */
  public async updateAllocation(
    teamMemberId: string,
    projectId: string,
    allocation: ResourceAllocationUpdateInput
  ): Promise<ApiResponse<ResourceAllocation>> {
    return apiClient.put<ResourceAllocation>(
      `${this.allocationsPath}/team-member/${teamMemberId}/project/${projectId}`,
      allocation
    );
  }

  /**
   * Delete a resource allocation
   */
  public async deleteAllocation(teamMemberId: string, projectId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.allocationsPath}/team-member/${teamMemberId}/project/${projectId}`);
  }

  /**
   * Get all available skills
   */
  public async getSkills(): Promise<ApiResponse<Skill[]>> {
    return apiClient.get<Skill[]>(this.skillsPath);
  }

  /**
   * Get resource utilization report
   */
  public async getUtilizationReport(
    startDate: string,
    endDate: string,
    departmentId?: string
  ): Promise<ApiResponse<{
    overallUtilization: number;
    teamMemberUtilization: { teamMemberId: string; name: string; utilization: number }[];
    departmentUtilization: { department: string; utilization: number }[];
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', startDate);
    queryParams.append('endDate', endDate);
    
    if (departmentId) {
      queryParams.append('departmentId', departmentId);
    }
    
    return apiClient.get<any>(`${this.basePath}/utilization?${queryParams.toString()}`);
  }

  /**
   * Get resource recommendations for a project
   */
  public async getResourceRecommendations(
    projectId: string,
    requiredSkills: string[],
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    recommendations: {
      teamMemberId: string;
      name: string;
      matchScore: number;
      availability: number;
      skills: { name: string; proficiency: string }[];
    }[];
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('projectId', projectId);
    queryParams.append('startDate', startDate);
    queryParams.append('endDate', endDate);
    
    requiredSkills.forEach(skill => {
      queryParams.append('skills', skill);
    });
    
    return apiClient.get<any>(`${this.basePath}/recommendations?${queryParams.toString()}`);
  }
}

// Create and export a singleton instance
export const resourceService = new ResourceService();

// Export the class for testing or custom instances
export default ResourceService;
