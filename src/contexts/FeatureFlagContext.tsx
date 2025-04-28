import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isFeatureEnabled, 
  getEnabledFeatures, 
  User, 
  FeatureFlag, 
  featureFlags 
} from '@/lib/featureFlags';

interface FeatureFlagContextType {
  isEnabled: (flagId: string) => boolean;
  enabledFeatures: string[];
  allFlags: Record<string, FeatureFlag>;
  refreshFlags: () => void;
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  isEnabled: () => false,
  enabledFeatures: [],
  allFlags: {},
  refreshFlags: () => {},
  user: undefined,
  setUser: () => {}
});

export const useFeatureFlags = () => useContext(FeatureFlagContext);

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  initialUser?: User;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ 
  children,
  initialUser
}) => {
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  
  // Function to refresh the enabled features
  const refreshFlags = () => {
    setEnabledFeatures(getEnabledFeatures(user));
  };
  
  // Update enabled features when user changes
  useEffect(() => {
    refreshFlags();
  }, [user]);
  
  // Check if a feature flag is enabled
  const isEnabled = (flagId: string): boolean => {
    return isFeatureEnabled(flagId, user);
  };
  
  const value = {
    isEnabled,
    enabledFeatures,
    allFlags: featureFlags,
    refreshFlags,
    user,
    setUser
  };
  
  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

/**
 * Component that conditionally renders content based on a feature flag
 */
interface FeatureFlaggedProps {
  flagId: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureFlagged: React.FC<FeatureFlaggedProps> = ({
  flagId,
  fallback = null,
  children
}) => {
  const { isEnabled } = useFeatureFlags();
  
  return isEnabled(flagId) ? <>{children}</> : <>{fallback}</>;
};

export default FeatureFlagContext;
