import { useState, useEffect, useCallback, useRef } from 'react';
import { CacheManager } from '@/lib/cache/cacheManager';
import { CacheOptions, CachePriority } from '@/lib/cache/cacheTypes';
import { performanceMonitor } from '@/lib/cache/performanceMonitor';

// Default cache options
const DEFAULT_OPTIONS: Partial<CacheOptions> = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  defaultPriority: CachePriority.NORMAL
};

// Cache instance for the hook
const hookCacheManager = new CacheManager({
  namespace: 'react-hooks',
  ...DEFAULT_OPTIONS
});

/**
 * Hook return type
 */
interface UseCacheReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  mutate: (newData: T | ((oldData: T | null) => T)) => Promise<void>;
  isStale: boolean;
}

/**
 * Cache hook options
 */
interface UseCacheOptions<T> extends Partial<CacheOptions> {
  // Function to fetch data if not in cache
  fetcher: () => Promise<T>;
  // Initial data to use before fetching
  initialData?: T;
  // Whether to automatically fetch data on mount
  autoFetch?: boolean;
  // Dependencies array for refetching (similar to useEffect)
  deps?: any[];
  // Key for the cache entry (defaults to a hash of the fetcher function and deps)
  cacheKey?: string;
  // Whether to track performance metrics
  trackPerformance?: boolean;
  // Callback when data is fetched
  onSuccess?: (data: T) => void;
  // Callback when an error occurs
  onError?: (error: Error) => void;
}

/**
 * React hook for using the cache system
 * 
 * @param options Hook options
 * @returns Cache state and methods
 */
export function useCache<T = any>(options: UseCacheOptions<T>): UseCacheReturn<T> {
  // Merge options with defaults
  const {
    fetcher,
    initialData = null,
    autoFetch = true,
    deps = [],
    cacheKey,
    trackPerformance = true,
    onSuccess,
    onError,
    ...cacheOptions
  } = options;

  // Generate a stable cache key
  const fetcherRef = useRef(fetcher);
  const key = cacheKey || `${fetcherRef.current.toString()}-${JSON.stringify(deps)}`;

  // State
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);

  // Fetch data function
  const fetchData = useCallback(async (force: boolean = false) => {
    setIsLoading(true);
    setError(null);

    let trackingId: number | null = null;
    
    try {
      // Start performance tracking
      if (trackPerformance) {
        trackingId = performanceMonitor.startTracking(key, 'GET');
      }

      // Try to get from cache first
      if (!force) {
        const cachedData = await hookCacheManager.get<T>(key);
        
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          
          // Check if data is stale
          const entry = await hookCacheManager.getEntry(key);
          setIsStale(entry?.state === 'stale');
          
          // End performance tracking
          if (trackPerformance && trackingId !== null) {
            performanceMonitor.endTracking(trackingId, true, JSON.stringify(cachedData).length);
          }
          
          // Call success callback
          if (onSuccess) {
            onSuccess(cachedData);
          }
          
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetcher();
      
      // Update state
      setData(freshData);
      setIsLoading(false);
      setIsStale(false);
      
      // Store in cache
      await hookCacheManager.set(key, freshData, cacheOptions);
      
      // End performance tracking
      if (trackPerformance && trackingId !== null) {
        performanceMonitor.endTracking(trackingId, false, JSON.stringify(freshData).length);
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess(freshData);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err as Error);
      
      // End performance tracking
      if (trackPerformance && trackingId !== null) {
        performanceMonitor.endTracking(trackingId, false, 0);
      }
      
      // Call error callback
      if (onError) {
        onError(err as Error);
      }
    }
  }, [key, fetcher, cacheOptions, trackPerformance, onSuccess, onError]);

  // Refresh function - force fetch fresh data
  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Mutate function - update cache and state
  const mutate = useCallback(async (newData: T | ((oldData: T | null) => T)) => {
    const resolvedData = typeof newData === 'function' 
      ? (newData as Function)(data) 
      : newData;
    
    setData(resolvedData);
    setIsStale(false);
    
    await hookCacheManager.set(key, resolvedData, cacheOptions);
  }, [key, data, cacheOptions]);

  // Fetch data on mount or when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch, ...deps]);

  return {
    data,
    isLoading,
    error,
    refresh,
    mutate,
    isStale
  };
}

/**
 * Hook for prefetching data into the cache
 * 
 * @param options Hook options
 * @returns Function to trigger prefetch
 */
export function usePrefetch<T = any>(options: Omit<UseCacheOptions<T>, 'autoFetch'>) {
  const {
    fetcher,
    deps = [],
    cacheKey,
    ...cacheOptions
  } = options;

  // Generate a stable cache key
  const fetcherRef = useRef(fetcher);
  const key = cacheKey || `${fetcherRef.current.toString()}-${JSON.stringify(deps)}`;

  // Prefetch function
  const prefetch = useCallback(async () => {
    try {
      // Check if already in cache
      const cachedData = await hookCacheManager.get<T>(key);
      
      if (cachedData) {
        return cachedData;
      }

      // Fetch and cache
      const data = await fetcher();
      await hookCacheManager.set(key, data, cacheOptions);
      
      return data;
    } catch (error) {
      console.error('Error prefetching data:', error);
      return null;
    }
  }, [key, fetcher, cacheOptions]);

  return prefetch;
}

/**
 * Hook for invalidating cache entries
 * 
 * @returns Functions to invalidate cache entries
 */
export function useCacheInvalidation() {
  // Invalidate a specific key
  const invalidateKey = useCallback(async (key: string) => {
    return hookCacheManager.delete(key);
  }, []);

  // Invalidate entries matching a pattern
  const invalidatePattern = useCallback(async (pattern: RegExp) => {
    return hookCacheManager.invalidateByPattern(pattern);
  }, []);

  // Invalidate entries with a specific prefix
  const invalidatePrefix = useCallback(async (prefix: string) => {
    return hookCacheManager.invalidateByPrefix(prefix);
  }, []);

  // Clear all cache entries
  const clearCache = useCallback(async () => {
    return hookCacheManager.clear();
  }, []);

  return {
    invalidateKey,
    invalidatePattern,
    invalidatePrefix,
    clearCache
  };
}

/**
 * Hook for accessing cache performance metrics
 * 
 * @returns Performance metrics and analysis functions
 */
export function useCachePerformance() {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());

  // Update metrics when they change
  useEffect(() => {
    const listener = (newMetrics: any) => {
      setMetrics(newMetrics);
    };
    
    performanceMonitor.addListener(listener);
    
    return () => {
      performanceMonitor.removeListener(listener);
    };
  }, []);

  // Get response time analysis
  const getResponseTimeAnalysis = useCallback(() => {
    return performanceMonitor.getResponseTimeAnalysis();
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    performanceMonitor.reset();
  }, []);

  return {
    metrics,
    getResponseTimeAnalysis,
    resetMetrics
  };
}

export default useCache;
