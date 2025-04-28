/**
 * RBAC Context
 * 
 * This module provides a React context for role-based access control.
 * It allows components to check permissions and conditionally render based on user access.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  User, 
  Permission, 
  Resource, 
  Action, 
  Role,
  hasPermission, 
  canAccess, 
  hasRole 
} from '@/lib/rbac';
import { useAuth } from './AuthContext';

interface RBACContextType {
  hasPermission: (permission: Permission, resourceId?: string) => boolean;
  canAccess: (resource: Resource, action: Action, resourceId?: string) => boolean;
  hasRole: (role: Role) => boolean;
  userPermissions: Permission[];
}

const RBACContext = createContext<RBACContextType>({
  hasPermission: () => false,
  canAccess: () => false,
  hasRole: () => false,
  userPermissions: [],
});

export const useRBAC = () => useContext(RBACContext);

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // If no user is authenticated, deny all permissions
  if (!user) {
    return (
      <RBACContext.Provider
        value={{
          hasPermission: () => false,
          canAccess: () => false,
          hasRole: () => false,
          userPermissions: [],
        }}
      >
        {children}
      </RBACContext.Provider>
    );
  }

  // Create a value object with permission check functions
  const value: RBACContextType = {
    hasPermission: (permission, resourceId) => 
      hasPermission(user, permission, resourceId),
    canAccess: (resource, action, resourceId) => 
      canAccess(user, resource, action, resourceId),
    hasRole: (role) => 
      hasRole(user, role),
    userPermissions: [],
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};

/**
 * Can component - Conditionally renders children based on permission
 */
interface CanProps {
  permission?: Permission;
  resource?: Resource;
  action?: Action;
  role?: Role;
  resourceId?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export const Can: React.FC<CanProps> = ({
  permission,
  resource,
  action,
  role,
  resourceId,
  fallback = null,
  children,
}) => {
  const { hasPermission, canAccess, hasRole } = useRBAC();
  
  // Check if user has access
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission, resourceId);
  } else if (resource && action) {
    hasAccess = canAccess(resource, action, resourceId);
  } else if (role) {
    hasAccess = hasRole(role);
  }
  
  // Render children if user has access, otherwise render fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

/**
 * Cannot component - Inverse of Can component
 */
export const Cannot: React.FC<CanProps> = (props) => {
  const { children, fallback } = props;
  return (
    <Can {...props} fallback={children}>
      {fallback}
    </Can>
  );
};

export default RBACContext;
