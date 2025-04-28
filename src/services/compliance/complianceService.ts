import { apiClient } from '@/services/api/apiClient';

export interface CompliancePolicy {
  id: string;
  name: string;
  version: string;
  effectiveDate: string;
  description: string;
  content: string;
  acknowledgmentRequired: boolean;
  region: string[];
  applicableRoles: string[];
}

export interface UserConsent {
  policyId: string;
  userId: string;
  consentDate: string;
  ipAddress: string;
  userAgent: string;
  version: string;
  status: 'accepted' | 'declined' | 'pending';
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriod: number; // in days
  description: string;
  legalBasis: string;
  automaticDeletion: boolean;
}

export interface DataSubjectRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'delete' | 'modify' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'denied';
  createdAt: string;
  completedAt?: string;
  details?: string;
}

export interface ComplianceAuditLog {
  id: string;
  action: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

/**
 * Service for managing compliance, data privacy, and regulatory requirements
 */
class ComplianceService {
  /**
   * Get all compliance policies applicable to the current user
   * 
   * @param region Optional region filter
   * @returns List of applicable compliance policies
   */
  public async getPolicies(region?: string): Promise<CompliancePolicy[]> {
    try {
      const response = await apiClient.get<CompliancePolicy[]>('/compliance/policies', {
        params: { region }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance policies:', error);
      return [];
    }
  }
  
  /**
   * Get a specific compliance policy by ID
   * 
   * @param policyId The ID of the policy to retrieve
   * @returns The requested compliance policy
   */
  public async getPolicy(policyId: string): Promise<CompliancePolicy | null> {
    try {
      const response = await apiClient.get<CompliancePolicy>(`/compliance/policies/${policyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching compliance policy ${policyId}:`, error);
      return null;
    }
  }
  
  /**
   * Record user consent for a compliance policy
   * 
   * @param policyId The ID of the policy being consented to
   * @param status The consent status (accepted, declined, pending)
   * @returns The recorded consent object
   */
  public async recordConsent(
    policyId: string, 
    status: 'accepted' | 'declined' | 'pending'
  ): Promise<UserConsent | null> {
    try {
      const response = await apiClient.post<UserConsent>('/compliance/consent', {
        policyId,
        status,
        consentDate: new Date().toISOString(),
        // Browser info is collected on the server side for security
      });
      return response.data;
    } catch (error) {
      console.error('Error recording consent:', error);
      return null;
    }
  }
  
  /**
   * Get user consent status for all policies
   * 
   * @returns List of user consents
   */
  public async getUserConsents(): Promise<UserConsent[]> {
    try {
      const response = await apiClient.get<UserConsent[]>('/compliance/consent');
      return response.data;
    } catch (error) {
      console.error('Error fetching user consents:', error);
      return [];
    }
  }
  
  /**
   * Submit a data subject request (GDPR, CCPA, etc.)
   * 
   * @param requestType Type of request (access, delete, modify, export)
   * @param details Additional details about the request
   * @returns The created data subject request
   */
  public async submitDataSubjectRequest(
    requestType: 'access' | 'delete' | 'modify' | 'export',
    details?: string
  ): Promise<DataSubjectRequest | null> {
    try {
      const response = await apiClient.post<DataSubjectRequest>('/compliance/data-requests', {
        requestType,
        details
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting data subject request:', error);
      return null;
    }
  }
  
  /**
   * Get the status of a data subject request
   * 
   * @param requestId The ID of the request to check
   * @returns The data subject request status
   */
  public async getDataSubjectRequestStatus(requestId: string): Promise<DataSubjectRequest | null> {
    try {
      const response = await apiClient.get<DataSubjectRequest>(`/compliance/data-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data subject request ${requestId}:`, error);
      return null;
    }
  }
  
  /**
   * Get all data retention policies
   * 
   * @returns List of data retention policies
   */
  public async getDataRetentionPolicies(): Promise<DataRetentionPolicy[]> {
    try {
      const response = await apiClient.get<DataRetentionPolicy[]>('/compliance/data-retention');
      return response.data;
    } catch (error) {
      console.error('Error fetching data retention policies:', error);
      return [];
    }
  }
  
  /**
   * Log a compliance-related action for audit purposes
   * 
   * @param action The action being performed
   * @param resourceType The type of resource being acted upon
   * @param resourceId The ID of the resource
   * @param details Additional details about the action
   * @returns The created audit log entry
   */
  public async logComplianceAction(
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ): Promise<ComplianceAuditLog | null> {
    try {
      const response = await apiClient.post<ComplianceAuditLog>('/compliance/audit-log', {
        action,
        resourceType,
        resourceId,
        details,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error logging compliance action:', error);
      // Fallback to local storage if API fails
      this.storeLocalAuditLog(action, resourceType, resourceId, details);
      return null;
    }
  }
  
  /**
   * Store audit log locally if API call fails
   * This is a fallback mechanism to ensure compliance actions are recorded
   */
  private storeLocalAuditLog(
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ): void {
    try {
      const logEntry: ComplianceAuditLog = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        userId: 'current-user', // Will be replaced on server sync
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
        ipAddress: 'local', // Will be captured on server sync
        userAgent: navigator.userAgent,
        details
      };
      
      // Get existing logs
      const existingLogsJson = localStorage.getItem('compliance_audit_logs');
      const existingLogs: ComplianceAuditLog[] = existingLogsJson 
        ? JSON.parse(existingLogsJson) 
        : [];
      
      // Add new log
      existingLogs.push(logEntry);
      
      // Store updated logs
      localStorage.setItem('compliance_audit_logs', JSON.stringify(existingLogs));
      
      console.log('Stored compliance audit log locally:', logEntry);
    } catch (error) {
      console.error('Error storing local audit log:', error);
    }
  }
  
  /**
   * Sync locally stored audit logs with the server
   * This should be called when connectivity is restored
   * 
   * @returns Number of logs successfully synced
   */
  public async syncLocalAuditLogs(): Promise<number> {
    try {
      const existingLogsJson = localStorage.getItem('compliance_audit_logs');
      if (!existingLogsJson) {
        return 0;
      }
      
      const existingLogs: ComplianceAuditLog[] = JSON.parse(existingLogsJson);
      if (existingLogs.length === 0) {
        return 0;
      }
      
      const response = await apiClient.post<{ syncedCount: number }>('/compliance/audit-log/sync', {
        logs: existingLogs
      });
      
      if (response.data.syncedCount > 0) {
        localStorage.removeItem('compliance_audit_logs');
      }
      
      return response.data.syncedCount;
    } catch (error) {
      console.error('Error syncing local audit logs:', error);
      return 0;
    }
  }
}

export const complianceService = new ComplianceService();
