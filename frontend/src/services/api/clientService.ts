/**
 * Client Service API
 * 
 * This module provides API methods for client-related operations,
 * including client portal access, approvals, and communications.
 */

import { apiClient, ApiResponse } from './apiClient';

// Types
export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  projects: ClientProject[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  progress: number;
  startDate: string;
  endDate: string;
  pendingApprovals: number;
  unreadMessages: number;
}

export interface ClientApproval {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  type: 'document' | 'design' | 'milestone' | 'payment';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  submittedAt: string;
  dueBy?: string;
  fileUrl?: string;
  feedback?: string;
  approvedAt?: string;
  approvedBy?: {
    id: string;
    name: string;
  };
}

export interface ClientDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'other';
  size: number;
  projectId: string;
  projectName: string;
  category: 'contract' | 'deliverable' | 'report' | 'invoice' | 'other';
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  uploadedAt: string;
  lastViewed?: string;
  version: number;
  fileUrl: string;
}

export interface ClientMessage {
  id: string;
  projectId: string;
  projectName: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: 'client' | 'team_member';
  };
  content: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  timestamp: string;
  isRead: boolean;
}

export interface ClientCreateInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface ClientUpdateInput {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface ClientFilters {
  search?: string;
  hasActiveProjects?: boolean;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}

export interface ApprovalCreateInput {
  title: string;
  description: string;
  projectId: string;
  type: 'document' | 'design' | 'milestone' | 'payment';
  dueBy?: string;
  fileUrl?: string;
}

export interface ApprovalUpdateInput {
  title?: string;
  description?: string;
  type?: 'document' | 'design' | 'milestone' | 'payment';
  dueBy?: string;
  fileUrl?: string;
}

export interface ApprovalFilters {
  projectId?: string;
  status?: ('pending' | 'approved' | 'rejected')[];
  type?: ('document' | 'design' | 'milestone' | 'payment')[];
  search?: string;
}

export interface ApprovalListResponse {
  approvals: ClientApproval[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentFilters {
  projectId?: string;
  category?: ('contract' | 'deliverable' | 'report' | 'invoice' | 'other')[];
  type?: ('pdf' | 'doc' | 'image' | 'spreadsheet' | 'other')[];
  search?: string;
}

export interface DocumentListResponse {
  documents: ClientDocument[];
  total: number;
  page: number;
  limit: number;
}

export interface MessageFilters {
  projectId?: string;
  isRead?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface MessageListResponse {
  messages: ClientMessage[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Client Service class for client-related API operations
 */
class ClientService {
  private readonly basePath = '/clients';
  private readonly approvalsPath = '/approvals';
  private readonly documentsPath = '/documents';
  private readonly messagesPath = '/messages';

  /**
   * Get a list of clients with optional filtering
   */
  public async getClients(
    filters?: ClientFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<ClientListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters.hasActiveProjects !== undefined) {
        queryParams.append('hasActiveProjects', filters.hasActiveProjects.toString());
      }
    }
    
    const url = `${this.basePath}?${queryParams.toString()}`;
    return apiClient.get<ClientListResponse>(url);
  }

  /**
   * Get a client by ID
   */
  public async getClient(id: string): Promise<ApiResponse<Client>> {
    return apiClient.get<Client>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new client
   */
  public async createClient(client: ClientCreateInput): Promise<ApiResponse<Client>> {
    return apiClient.post<Client>(this.basePath, client);
  }

  /**
   * Update an existing client
   */
  public async updateClient(id: string, client: ClientUpdateInput): Promise<ApiResponse<Client>> {
    return apiClient.put<Client>(`${this.basePath}/${id}`, client);
  }

  /**
   * Delete a client
   */
  public async deleteClient(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Get client projects
   */
  public async getClientProjects(clientId: string): Promise<ApiResponse<ClientProject[]>> {
    return apiClient.get<ClientProject[]>(`${this.basePath}/${clientId}/projects`);
  }

  /**
   * Get client approvals with optional filtering
   */
  public async getApprovals(
    clientId: string,
    filters?: ApprovalFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<ApprovalListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.projectId) {
        queryParams.append('projectId', filters.projectId);
      }
      
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
          queryParams.append('status', status);
        });
      }
      
      if (filters.type && filters.type.length > 0) {
        filters.type.forEach(type => {
          queryParams.append('type', type);
        });
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
    }
    
    const url = `${this.basePath}/${clientId}${this.approvalsPath}?${queryParams.toString()}`;
    return apiClient.get<ApprovalListResponse>(url);
  }

  /**
   * Get an approval by ID
   */
  public async getApproval(approvalId: string): Promise<ApiResponse<ClientApproval>> {
    return apiClient.get<ClientApproval>(`${this.approvalsPath}/${approvalId}`);
  }

  /**
   * Create a new approval request
   */
  public async createApproval(clientId: string, approval: ApprovalCreateInput): Promise<ApiResponse<ClientApproval>> {
    return apiClient.post<ClientApproval>(`${this.basePath}/${clientId}${this.approvalsPath}`, approval);
  }

  /**
   * Update an existing approval request
   */
  public async updateApproval(approvalId: string, approval: ApprovalUpdateInput): Promise<ApiResponse<ClientApproval>> {
    return apiClient.put<ClientApproval>(`${this.approvalsPath}/${approvalId}`, approval);
  }

  /**
   * Submit approval decision (approve or reject)
   */
  public async submitApprovalDecision(
    approvalId: string,
    decision: 'approve' | 'reject',
    feedback?: string
  ): Promise<ApiResponse<ClientApproval>> {
    return apiClient.post<ClientApproval>(`${this.approvalsPath}/${approvalId}/${decision}`, { feedback });
  }

  /**
   * Get client documents with optional filtering
   */
  public async getDocuments(
    clientId: string,
    filters?: DocumentFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<DocumentListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.projectId) {
        queryParams.append('projectId', filters.projectId);
      }
      
      if (filters.category && filters.category.length > 0) {
        filters.category.forEach(category => {
          queryParams.append('category', category);
        });
      }
      
      if (filters.type && filters.type.length > 0) {
        filters.type.forEach(type => {
          queryParams.append('type', type);
        });
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
    }
    
    const url = `${this.basePath}/${clientId}${this.documentsPath}?${queryParams.toString()}`;
    return apiClient.get<DocumentListResponse>(url);
  }

  /**
   * Get a document by ID
   */
  public async getDocument(documentId: string): Promise<ApiResponse<ClientDocument>> {
    return apiClient.get<ClientDocument>(`${this.documentsPath}/${documentId}`);
  }

  /**
   * Record document view
   */
  public async recordDocumentView(documentId: string): Promise<ApiResponse<ClientDocument>> {
    return apiClient.post<ClientDocument>(`${this.documentsPath}/${documentId}/view`, {});
  }

  /**
   * Get client messages with optional filtering
   */
  public async getMessages(
    clientId: string,
    filters?: MessageFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<MessageListResponse>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters if provided
    if (filters) {
      if (filters.projectId) {
        queryParams.append('projectId', filters.projectId);
      }
      
      if (filters.isRead !== undefined) {
        queryParams.append('isRead', filters.isRead.toString());
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }
    }
    
    const url = `${this.basePath}/${clientId}${this.messagesPath}?${queryParams.toString()}`;
    return apiClient.get<MessageListResponse>(url);
  }

  /**
   * Send a message
   */
  public async sendMessage(
    clientId: string,
    projectId: string,
    content: string,
    attachments?: { id: string; name: string; type: string; size: number; url: string }[]
  ): Promise<ApiResponse<ClientMessage>> {
    return apiClient.post<ClientMessage>(`${this.basePath}/${clientId}${this.messagesPath}`, {
      projectId,
      content,
      attachments
    });
  }

  /**
   * Mark messages as read
   */
  public async markMessagesAsRead(messageIds: string[]): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.messagesPath}/mark-as-read`, { messageIds });
  }

  /**
   * Get client portal summary
   */
  public async getClientPortalSummary(clientId: string): Promise<ApiResponse<{
    activeProjects: number;
    pendingApprovals: number;
    unreadMessages: number;
    upcomingDeadlines: number;
    recentDocuments: ClientDocument[];
  }>> {
    return apiClient.get<any>(`${this.basePath}/${clientId}/portal-summary`);
  }
}

// Create and export a singleton instance
export const clientService = new ClientService();

// Export the class for testing or custom instances
export default ClientService;
