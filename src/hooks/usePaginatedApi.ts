/**
 * usePaginatedApi Hook
 * 
 * A custom React hook for making paginated API requests with loading, error, and data states.
 * This hook extends useApi to handle pagination, filtering, and sorting.
 */

import { useState, useCallback, useEffect } from 'react';
import useApi from './useApi';
import { ApiError } from '@/services/api/apiClient';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsePaginatedApiOptions<T, F> {
  // If true, the request will be made immediately when the hook is called
  immediate?: boolean;
  // Initial data to use before the request is made
  initialData?: T[];
  // Initial pagination state
  initialPagination?: Partial<PaginationState>;
  // Initial filters
  initialFilters?: F;
  // Function to transform the response data
  transform?: (data: any) => T[];
  // Callback when request is successful
  onSuccess?: (data: T[], pagination: PaginationState) => void;
  // Callback when request fails
  onError?: (error: ApiError) => void;
  // Dependencies array for the request (similar to useEffect dependencies)
  deps?: any[];
}

interface UsePaginatedApiState<T, F> {
  // The data returned from the API
  data: T[];
  // The current pagination state
  pagination: PaginationState;
  // The current filters
  filters: F | undefined;
  // Whether the request is currently loading
  loading: boolean;
  // The error returned from the API, if any
  error: ApiError | null;
  // Whether the request has been executed at least once
  executed: boolean;
}

interface UsePaginatedApiResult<T, F> extends UsePaginatedApiState<T, F> {
  // Function to fetch a specific page
  fetchPage: (page: number) => Promise<void>;
  // Function to change the page size
  setPageSize: (limit: number) => Promise<void>;
  // Function to update filters and fetch the first page
  setFilters: (filters: F) => Promise<void>;
  // Function to execute the request with current pagination and filters
  refresh: () => Promise<void>;
  // Function to reset the state
  reset: () => void;
  // Check if there's a next page
  hasNextPage: boolean;
  // Check if there's a previous page
  hasPreviousPage: boolean;
  // Go to the next page
  nextPage: () => Promise<void>;
  // Go to the previous page
  previousPage: () => Promise<void>;
  // Go to the first page
  firstPage: () => Promise<void>;
  // Go to the last page
  lastPage: () => Promise<void>;
}

/**
 * A hook for making paginated API requests with loading, error, and data states
 * 
 * @param requestFn The API request function to call
 * @param options Options for the hook
 * @returns An object with the request state and functions to control pagination
 * 
 * @example
 * // Basic usage
 * const { 
 *   data, 
 *   loading, 
 *   pagination, 
 *   fetchPage, 
 *   nextPage, 
 *   previousPage 
 * } = usePaginatedApi(
 *   (page, limit, filters) => projectService.getProjects(filters, page, limit),
 *   { immediate: true }
 * );
 * 
 * // With filters
 * const [searchTerm, setSearchTerm] = useState('');
 * const { 
 *   data, 
 *   loading, 
 *   setFilters 
 * } = usePaginatedApi(
 *   (page, limit, filters) => projectService.getProjects(filters, page, limit)
 * );
 * 
 * const handleSearch = () => {
 *   setFilters({ search: searchTerm });
 * };
 */
function usePaginatedApi<T, F = any>(
  requestFn: (page: number, limit: number, filters?: F) => Promise<any>,
  options: UsePaginatedApiOptions<T, F> = {}
): UsePaginatedApiResult<T, F> {
  const {
    immediate = false,
    initialData = [],
    initialPagination = {},
    initialFilters,
    transform,
    onSuccess,
    onError,
    deps = []
  } = options;

  // Set up initial pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPagination.page || 1,
    limit: initialPagination.limit || 10,
    total: initialPagination.total || 0,
    totalPages: initialPagination.totalPages || 0
  });

  // Set up filters state
  const [filters, setFiltersState] = useState<F | undefined>(initialFilters);

  // Create a function to extract pagination data from the response
  const extractPaginationAndData = useCallback((response: any) => {
    // Handle different response formats
    const data = response.data || response.items || response.results || response;
    const total = response.total || response.totalItems || response.count || 0;
    const page = response.page || response.currentPage || 1;
    const limit = response.limit || response.pageSize || 10;
    const totalPages = response.totalPages || Math.ceil(total / limit) || 0;

    // Update pagination state
    setPagination({ page, limit, total, totalPages });

    // Return the data for further transformation
    return transform ? transform(data) : data;
  }, [transform]);

  // Use the base useApi hook
  const api = useApi<T[]>(
    async (...args: any[]) => {
      // If args are provided, use them; otherwise, use the current state
      const page = args[0] !== undefined ? args[0] : pagination.page;
      const limit = args[1] !== undefined ? args[1] : pagination.limit;
      const requestFilters = args[2] !== undefined ? args[2] : filters;
      
      return requestFn(page, limit, requestFilters);
    },
    {
      immediate: false, // We'll handle this ourselves
      initialData,
      transform: extractPaginationAndData,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data, pagination);
        }
      },
      onError,
      deps: [pagination.page, pagination.limit, filters, ...deps]
    }
  );

  // Function to fetch a specific page
  const fetchPage = useCallback(async (page: number) => {
    if (page < 1) page = 1;
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      page = pagination.totalPages;
    }
    
    await api.execute(page, pagination.limit, filters);
  }, [api, pagination.limit, pagination.totalPages, filters]);

  // Function to change the page size
  const setPageSize = useCallback(async (limit: number) => {
    if (limit < 1) limit = 1;
    await api.execute(1, limit, filters); // Reset to first page when changing page size
  }, [api, filters]);

  // Function to update filters and fetch the first page
  const setFilters = useCallback(async (newFilters: F) => {
    setFiltersState(newFilters);
    await api.execute(1, pagination.limit, newFilters); // Reset to first page when changing filters
  }, [api, pagination.limit]);

  // Function to refresh the current page
  const refresh = useCallback(async () => {
    await api.execute(pagination.page, pagination.limit, filters);
  }, [api, pagination.page, pagination.limit, filters]);

  // Navigation helpers
  const hasNextPage = pagination.page < pagination.totalPages;
  const hasPreviousPage = pagination.page > 1;

  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await fetchPage(pagination.page + 1);
    }
  }, [fetchPage, pagination.page, hasNextPage]);

  const previousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await fetchPage(pagination.page - 1);
    }
  }, [fetchPage, pagination.page, hasPreviousPage]);

  const firstPage = useCallback(async () => {
    await fetchPage(1);
  }, [fetchPage]);

  const lastPage = useCallback(async () => {
    await fetchPage(pagination.totalPages);
  }, [fetchPage, pagination.totalPages]);

  // Execute the request immediately if specified
  useEffect(() => {
    if (immediate) {
      api.execute(pagination.page, pagination.limit, filters);
    }
  }, []);

  return {
    data: api.data || [],
    pagination,
    filters,
    loading: api.loading,
    error: api.error,
    executed: api.executed,
    fetchPage,
    setPageSize,
    setFilters,
    refresh,
    reset: api.reset,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage
  };
}

export default usePaginatedApi;
