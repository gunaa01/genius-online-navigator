/**
 * Role-Based Access Control (RBAC) System
 * 
 * This module provides a centralized way to manage permissions and role-based access
 * across the application. It supports hierarchical roles, granular permissions,
 * and conditional access rules.
 */

// Types
export type Role = 
  | 'admin'
  | 'manager'
  | 'developer'
  | 'client'
  | 'guest';

export type Resource = 
  | 'projects'
  | 'tasks'
  | 'resources'
  | 'clients'
  | 'reports'
  | 'settings'
  | 'users'
  | 'billing'
  | 'automation'
  | 'ai_insights';

export type Action = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'assign'
  | 'export'
  | 'import'
  | 'configure';

export type Permission = `${Action}:${Resource}`;

export interface User {
  id: string;
  email: string;
  role: Role;
  permissions?: Permission[];
  teams?: string[];
}

// Role hierarchy (higher index roles inherit permissions from lower index roles)
const roleHierarchy: Role[] = ['guest', 'client', 'developer', 'manager', 'admin'];

// Default permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'create:projects', 'read:projects', 'update:projects', 'delete:projects',
    'create:tasks', 'read:tasks', 'update:tasks', 'delete:tasks',
    'create:resources', 'read:resources', 'update:resources', 'delete:resources',
    'create:clients', 'read:clients', 'update:clients', 'delete:clients',
    'create:reports', 'read:reports', 'update:reports', 'delete:reports',
    'create:settings', 'read:settings', 'update:settings', 'delete:settings',
    'create:users', 'read:users', 'update:users', 'delete:users',
    'create:billing', 'read:billing', 'update:billing', 'delete:billing',
    'create:automation', 'read:automation', 'update:automation', 'delete:automation',
    'read:ai_insights', 'configure:ai_insights',
    'approve:projects', 'assign:tasks', 'export:reports', 'import:resources'
  ],
  manager: [
    'create:projects', 'read:projects', 'update:projects',
    'create:tasks', 'read:tasks', 'update:tasks', 'delete:tasks',
    'create:resources', 'read:resources', 'update:resources',
    'read:clients', 'update:clients',
    'create:reports', 'read:reports', 'update:reports',
    'read:settings',
    'read:users',
    'read:billing',
    'create:automation', 'read:automation', 'update:automation',
    'read:ai_insights',
    'approve:projects', 'assign:tasks', 'export:reports'
  ],
  developer: [
    'read:projects', 'update:projects',
    'create:tasks', 'read:tasks', 'update:tasks',
    'read:resources',
    'read:clients',
    'read:reports',
    'read:automation',
    'read:ai_insights'
  ],
  client: [
    'read:projects',
    'read:tasks', 'update:tasks',
    'read:reports',
    'approve:projects'
  ],
  guest: [
    'read:projects'
  ]
};

// Special conditions for permissions
// These are functions that return true if the user has permission
// based on special conditions (e.g., team membership, ownership)
export type PermissionCondition = (user: User, resourceId?: string) => boolean;

const permissionConditions: Record<string, PermissionCondition> = {
  // Example: User can only update projects they are assigned to
  'update:projects': (user, resourceId) => {
    // In a real app, this would check if the user is assigned to the project
    // For now, we'll just check if they're a developer or higher
    return roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf('developer');
  },
  
  // Example: Users can only see clients in their team
  'read:clients': (user, resourceId) => {
    // In a real app, this would check if the client is in the user's team
    // For now, we'll just check if they have teams
    return !!user.teams && user.teams.length > 0;
  }
};

/**
 * Check if a user has a specific permission
 * 
 * @param user The user to check
 * @param permission The permission to check
 * @param resourceId Optional resource ID for conditional permissions
 * @returns boolean indicating if the user has the permission
 */
export function hasPermission(
  user: User,
  permission: Permission,
  resourceId?: string
): boolean {
  // If user has explicit permissions, check those first
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }
  
  // Check role-based permissions
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  
  // Check each role in the hierarchy up to and including the user's role
  for (let i = 0; i <= userRoleIndex; i++) {
    const role = roleHierarchy[i];
    if (rolePermissions[role].includes(permission)) {
      // If there's a special condition for this permission, check it
      if (permissionConditions[permission]) {
        return permissionConditions[permission](user, resourceId);
      }
      return true;
    }
  }
  
  return false;
}

/**
 * Check if a user can access a specific resource
 * 
 * @param user The user to check
 * @param resource The resource to check
 * @param action The action to check
 * @param resourceId Optional resource ID for conditional permissions
 * @returns boolean indicating if the user can access the resource
 */
export function canAccess(
  user: User,
  resource: Resource,
  action: Action,
  resourceId?: string
): boolean {
  const permission = `${action}:${resource}` as Permission;
  return hasPermission(user, permission, resourceId);
}

/**
 * Get all permissions for a user
 * 
 * @param user The user to get permissions for
 * @returns Array of permissions the user has
 */
export function getUserPermissions(user: User): Permission[] {
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const permissions = new Set<Permission>();
  
  // Add permissions from all roles up to and including the user's role
  for (let i = 0; i <= userRoleIndex; i++) {
    const role = roleHierarchy[i];
    rolePermissions[role].forEach(permission => permissions.add(permission));
  }
  
  // Add explicit user permissions
  if (user.permissions) {
    user.permissions.forEach(permission => permissions.add(permission));
  }
  
  return Array.from(permissions);
}

/**
 * Check if a user has a specific role or higher in the hierarchy
 * 
 * @param user The user to check
 * @param role The minimum role required
 * @returns boolean indicating if the user has the required role or higher
 */
export function hasRole(user: User, role: Role): boolean {
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const requiredRoleIndex = roleHierarchy.indexOf(role);
  
  return userRoleIndex >= requiredRoleIndex;
}

/**
 * React component props interface for RBAC components
 */
export interface RBACProps {
  permission?: Permission;
  resource?: Resource;
  action?: Action;
  role?: Role;
  resourceId?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Export constants for use in the application
 */
export const ROLES = {
  ADMIN: 'admin' as Role,
  MANAGER: 'manager' as Role,
  DEVELOPER: 'developer' as Role,
  CLIENT: 'client' as Role,
  GUEST: 'guest' as Role
};

export const RESOURCES = {
  PROJECTS: 'projects' as Resource,
  TASKS: 'tasks' as Resource,
  RESOURCES: 'resources' as Resource,
  CLIENTS: 'clients' as Resource,
  REPORTS: 'reports' as Resource,
  SETTINGS: 'settings' as Resource,
  USERS: 'users' as Resource,
  BILLING: 'billing' as Resource,
  AUTOMATION: 'automation' as Resource,
  AI_INSIGHTS: 'ai_insights' as Resource
};

export const ACTIONS = {
  CREATE: 'create' as Action,
  READ: 'read' as Action,
  UPDATE: 'update' as Action,
  DELETE: 'delete' as Action,
  APPROVE: 'approve' as Action,
  ASSIGN: 'assign' as Action,
  EXPORT: 'export' as Action,
  IMPORT: 'import' as Action,
  CONFIGURE: 'configure' as Action
};
