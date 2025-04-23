/**
 * Feature Flag System for Genius Online Navigator
 * 
 * This module provides a centralized way to manage feature flags across the application.
 * It supports different types of flags:
 * - Simple boolean flags
 * - User-based flags (enabled for specific users or roles)
 * - Percentage-based rollouts
 * - Environment-based flags
 * - Time-based flags (enabled during specific time periods)
 */

// Types
export type UserRole = 'admin' | 'manager' | 'developer' | 'client' | 'guest';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  teams?: string[];
}

export type FeatureFlagType = 
  | 'boolean'        // Simple on/off
  | 'userBased'      // Based on user properties
  | 'percentRollout' // Percentage-based rollout
  | 'environment'    // Based on environment
  | 'timeBased';     // Based on time period

export interface BaseFeatureFlag {
  id: string;
  name: string;
  description: string;
  type: FeatureFlagType;
  defaultValue: boolean;
}

export interface BooleanFeatureFlag extends BaseFeatureFlag {
  type: 'boolean';
  enabled: boolean;
}

export interface UserBasedFeatureFlag extends BaseFeatureFlag {
  type: 'userBased';
  enabledForUsers?: string[];      // List of user IDs
  enabledForRoles?: UserRole[];    // List of user roles
  enabledForTeams?: string[];      // List of team IDs
  enabledForEmails?: string[];     // List of email patterns (e.g., "*@company.com")
}

export interface PercentRolloutFeatureFlag extends BaseFeatureFlag {
  type: 'percentRollout';
  rolloutPercentage: number;       // 0-100
  seed?: string;                   // Optional seed for consistent hashing
}

export interface EnvironmentFeatureFlag extends BaseFeatureFlag {
  type: 'environment';
  enabledEnvironments: ('development' | 'staging' | 'production')[];
}

export interface TimeBasedFeatureFlag extends BaseFeatureFlag {
  type: 'timeBased';
  startTime?: string;              // ISO date string
  endTime?: string;                // ISO date string
}

export type FeatureFlag = 
  | BooleanFeatureFlag
  | UserBasedFeatureFlag
  | PercentRolloutFeatureFlag
  | EnvironmentFeatureFlag
  | TimeBasedFeatureFlag;

// Feature flag configuration
export const featureFlags: Record<string, FeatureFlag> = {
  // AI Features
  'ai-recommendations': {
    id: 'ai-recommendations',
    name: 'AI Recommendations',
    description: 'Enable AI-powered recommendations for projects and tasks',
    type: 'userBased',
    defaultValue: false,
    enabledForRoles: ['admin', 'manager']
  },
  'ai-risk-prediction': {
    id: 'ai-risk-prediction',
    name: 'AI Risk Prediction',
    description: 'Enable AI-powered risk prediction for projects',
    type: 'percentRollout',
    defaultValue: false,
    rolloutPercentage: 20
  },
  'smart-notifications': {
    id: 'smart-notifications',
    name: 'Smart Notifications',
    description: 'Enable AI-powered smart notifications',
    type: 'boolean',
    defaultValue: false,
    enabled: false
  },

  // New UI Features
  'new-dashboard': {
    id: 'new-dashboard',
    name: 'New Dashboard UI',
    description: 'Enable the new dashboard UI',
    type: 'percentRollout',
    defaultValue: false,
    rolloutPercentage: 50
  },
  'feedback-widget': {
    id: 'feedback-widget',
    name: 'Feedback Widget',
    description: 'Enable the feedback widget',
    type: 'boolean',
    defaultValue: true,
    enabled: true
  },
  'error-reporting': {
    id: 'error-reporting',
    name: 'Error Reporting Dashboard',
    description: 'Enable the error reporting dashboard',
    type: 'userBased',
    defaultValue: false,
    enabledForRoles: ['admin', 'developer']
  },

  // Beta Features
  'resource-optimization': {
    id: 'resource-optimization',
    name: 'Resource Optimization',
    description: 'Enable resource optimization suggestions',
    type: 'environment',
    defaultValue: false,
    enabledEnvironments: ['development', 'staging']
  },
  'advanced-analytics': {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Enable advanced analytics dashboard',
    type: 'timeBased',
    defaultValue: false,
    startTime: '2025-05-01T00:00:00Z',
    endTime: '2025-06-01T00:00:00Z'
  },
  'client-portal-chat': {
    id: 'client-portal-chat',
    name: 'Client Portal Chat',
    description: 'Enable real-time chat in client portal',
    type: 'userBased',
    defaultValue: false,
    enabledForRoles: ['admin', 'client']
  }
};

// Current environment
const currentEnvironment = process.env.NODE_ENV || 'development';

// Helper function to check if email matches a pattern
const emailMatchesPattern = (email: string, pattern: string): boolean => {
  if (pattern.startsWith('*@')) {
    const domain = pattern.substring(2);
    return email.endsWith(`@${domain}`);
  }
  return email === pattern;
};

// Helper function for percentage-based rollout
const isInRolloutPercentage = (id: string, percentage: number, seed = ''): boolean => {
  const hash = cyrb53(`${id}${seed}`);
  return (hash % 100) < percentage;
};

// Simple hash function (cyrb53)
function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * Check if a feature flag is enabled
 * 
 * @param flagId The ID of the feature flag to check
 * @param user Optional user object for user-based flags
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(flagId: string, user?: User): boolean {
  const flag = featureFlags[flagId];
  
  if (!flag) {
    console.warn(`Feature flag "${flagId}" not found. Returning default value (false).`);
    return false;
  }
  
  // Check flag based on type
  switch (flag.type) {
    case 'boolean':
      return (flag as BooleanFeatureFlag).enabled;
      
    case 'userBased':
      if (!user) return flag.defaultValue;
      
      const userFlag = flag as UserBasedFeatureFlag;
      
      // Check user ID
      if (userFlag.enabledForUsers?.includes(user.id)) {
        return true;
      }
      
      // Check user role
      if (userFlag.enabledForRoles?.includes(user.role)) {
        return true;
      }
      
      // Check user teams
      if (userFlag.enabledForTeams && user.teams) {
        for (const team of user.teams) {
          if (userFlag.enabledForTeams.includes(team)) {
            return true;
          }
        }
      }
      
      // Check user email
      if (userFlag.enabledForEmails && user.email) {
        for (const emailPattern of userFlag.enabledForEmails) {
          if (emailMatchesPattern(user.email, emailPattern)) {
            return true;
          }
        }
      }
      
      return flag.defaultValue;
      
    case 'percentRollout':
      if (!user) return flag.defaultValue;
      
      const percentFlag = flag as PercentRolloutFeatureFlag;
      return isInRolloutPercentage(user.id, percentFlag.rolloutPercentage, percentFlag.seed);
      
    case 'environment':
      const envFlag = flag as EnvironmentFeatureFlag;
      return envFlag.enabledEnvironments.includes(currentEnvironment as any);
      
    case 'timeBased':
      const timeFlag = flag as TimeBasedFeatureFlag;
      const now = new Date();
      
      if (timeFlag.startTime && new Date(timeFlag.startTime) > now) {
        return flag.defaultValue;
      }
      
      if (timeFlag.endTime && new Date(timeFlag.endTime) < now) {
        return flag.defaultValue;
      }
      
      return !flag.defaultValue;
      
    default:
      return flag.defaultValue;
  }
}

/**
 * Get all enabled feature flags for a user
 * 
 * @param user Optional user object
 * @returns Array of enabled feature flag IDs
 */
export function getEnabledFeatures(user?: User): string[] {
  return Object.keys(featureFlags).filter(flagId => isFeatureEnabled(flagId, user));
}

/**
 * React hook for feature flags
 * 
 * @param flagId The ID of the feature flag to check
 * @param user Optional user object for user-based flags
 * @returns boolean indicating if the feature is enabled
 */
export function useFeatureFlag(flagId: string, user?: User): boolean {
  return isFeatureEnabled(flagId, user);
}

// Export feature flag types for use in the application
export const FeatureFlagTypes = {
  BOOLEAN: 'boolean',
  USER_BASED: 'userBased',
  PERCENT_ROLLOUT: 'percentRollout',
  ENVIRONMENT: 'environment',
  TIME_BASED: 'timeBased'
} as const;
