/**
 * useApi Hook
 * 
 * A custom React hook for making API requests with loading, error, and data states.
 * This hook simplifies the integration of our API services with React components.
 */

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, ApiError } from '@/services/api/apiClient';

interface UseApiOptions<T> {
  // If true, the request will be made immediately when the hook is called
  immediate?: boolean;
  // Initial data to use before the request is made
  initialData?: T;
  // Function to transform the response data
  transform?: (data: any) => T;
  // Callback when request is successful
  onSuccess?: (data: T) => void;
  // Callback when request fails
  onError?: (error: ApiError) => void;
  // Dependencies array for the request (similar to useEffect dependencies)
  deps?: any[];
}

interface UseApiState<T> {
  // The data returned from the API
  data: T | undefined;
  // Whether the request is currently loading
  loading: boolean;
  // The error returned from the API, if any
  error: ApiError | null;
  // Whether the request has been executed at least once
  executed: boolean;
}

interface UseApiResult<T> extends UseApiState<T> {
  // Function to execute the request
  execute: (...args: any[]) => Promise<T | undefined>;
  // Function to reset the state
  reset: () => void;
}

/**
 * A hook for making API requests with loading, error, and data states
 * 
 * @param requestFn The API request function to call
 * @param options Options for the hook
 * @returns An object with the request state and functions to execute or reset the request
 * 
 * @example
 * // Basic usage
 * const { data, loading, error, execute } = useApi(projectService.getProjects);
 * 
 * // With immediate execution
 * const { data, loading, error } = useApi(projectService.getProjects, { immediate: true });
 * 
 * // With parameters
 * const { data, loading, error, execute } = useApi(projectService.getProject);
 * // Later in your component
 * useEffect(() => {
 *   if (projectId) {
 *     execute(projectId);
 *   }
 * }, [projectId, execute]);
 */
function useApi<T>(
  requestFn: (...args: any[]) => Promise<ApiResponse<any>>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    immediate = false,
    initialData,
    transform,
    onSuccess,
    onError,
    deps = []
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: immediate,
    error: null,
    executed: false
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await requestFn(...args);
        const data = transform ? transform(response.data) : response.data;
        
        setState(prev => ({ 
          ...prev, 
          data, 
          loading: false, 
          error: null,
          executed: true
        }));
        
        if (onSuccess) {
          onSuccess(data);
        }
        
        return data;
      } catch (err) {
        const error = err as ApiError;
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error,
          executed: true
        }));
        
        if (onError) {
          onError(error);
        }
        
        return undefined;
      }
    },
    [requestFn, transform, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      executed: false
    });
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...deps]);

  return {
    ...state,
    execute,
    reset
  };
}

export default useApi;
