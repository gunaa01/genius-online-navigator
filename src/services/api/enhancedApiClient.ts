/**
 * Enhanced API Client for Genius Online Navigator
 * 
 * This module provides an advanced API client with multi-level caching,
 * offline support, and performance optimizations.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiCacheAdapter, ApiCacheConfig } from '@/lib/cache/apiCacheAdapter';
import { CacheManager } from '@/lib/cache/cacheManager';
import { serviceWorkerManager } from '@/lib/cache/serviceWorkerManager';
import { CachePriority } from '@/lib/cache/cacheTypes';

// Types
export interface EnhancedApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  cache?: ApiCacheConfig;
  retryConfig?: RetryConfig;
  offlineSupport?: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryStatusCodes: number[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  cached?: boolean;
  stale?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  errors?: any;
  requestId?: string;
}

export interface RequestOptions extends AxiosRequestConfig {
  cache?: ApiCacheConfig;
  retry?: boolean | Partial<RetryConfig>;
  offlineSupport?: boolean;
  priority?: CachePriority;
  background?: boolean;
}

// Default configuration
const DEFAULT_CONFIG: EnhancedApiClientConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.geniusonlinenavigator.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  cache: {
    enabled: true,
    cacheErrorResponses: false,
    cacheableStatuses: [200, 201, 202, 203, 204, 206, 207, 208, 226],
    priority: CachePriority.NORMAL
  },
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryStatusCodes: [408, 429, 500, 502, 503, 504]
  },
  offlineSupport: true
};

/**
 * Enhanced API Client class for making HTTP requests with advanced caching
 */
export class EnhancedApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private cacheAdapter: ApiCacheAdapter;
  private config: EnhancedApiClientConfig;
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private offlineQueue: Array<{
    method: string;
    url: string;
    data?: any;
    options?: RequestOptions;
  }> = [];

  constructor(config: Partial<EnhancedApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Create Axios instance
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout || DEFAULT_CONFIG.timeout,
      headers: { ...DEFAULT_CONFIG.headers, ...this.config.headers },
    });

    // Create cache adapter
    this.cacheAdapter = new ApiCacheAdapter(
      new CacheManager<AxiosResponse>({
        ttl: 5 * 60 * 1000, // 5 minutes
        maxItems: 100,
        staleWhileRevalidate: true,
        debug: process.env.NODE_ENV === 'development'
      }),
      this.config.cache
    );

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        // Add timestamp to prevent caching by the browser
        if (config.method?.toLowerCase() === 'get') {
          config.params = {
            ...config.params,
            _t: new Date().getTime()
          };
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleSuccess.bind(this),
      this.handleError.bind(this)
    );

    // Initialize offline support
    if (this.config.offlineSupport) {
      this.initOfflineSupport();
    }
  }

  /**
   * Initialize offline support
   */
  private initOfflineSupport(): void {
    // Register service worker
    if (serviceWorkerManager.isSupported()) {
      serviceWorkerManager.register('/serviceWorker.js', {
        onSuccess: () => {
          console.log('Service worker registered for offline support');
        },
        onError: (error) => {
          console.error('Service worker registration failed:', error);
        },
        onUpdate: () => {
          console.log('Service worker updated');
        }
      });
    }

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    console.log('App is online, processing offline queue');
    this.processOfflineQueue();
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    console.log('App is offline, requests will be queued');
  }

  /**
   * Process offline queue
   */
  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) {
      return;
    }

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const request of queue) {
      try {
        console.log(`Processing offline request: ${request.method} ${request.url}`);
        
        switch (request.method.toLowerCase()) {
          case 'get':
            await this.get(request.url, request.options);
            break;
          case 'post':
            await this.post(request.url, request.data, request.options);
            break;
          case 'put':
            await this.put(request.url, request.data, request.options);
            break;
          case 'patch':
            await this.patch(request.url, request.data, request.options);
            break;
          case 'delete':
            await this.delete(request.url, request.options);
            break;
        }
      } catch (error) {
        console.error(`Failed to process offline request: ${request.method} ${request.url}`, error);
        // Re-queue failed requests
        this.offlineQueue.push(request);
      }
    }
  }

  /**
   * Set the authentication token for subsequent requests
   */
  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get the current authentication token
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Make a GET request
   */
  public async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const cacheConfig: ApiCacheConfig = {
      ...this.config.cache,
      ...options?.cache
    };

    // Check if we're offline
    if (!navigator.onLine && this.config.offlineSupport) {
      // Check cache first
      const cachedResponse = await this.cacheAdapter.getCachedResponse(url, options, cacheConfig);
      
      if (cachedResponse) {
        return this.transformResponse<T>(cachedResponse, true);
      }
      
      // Queue request for later if not in cache
      this.offlineQueue.push({
        method: 'get',
        url,
        options
      });
      
      throw new Error('You are offline and this resource is not available in the cache');
    }

    // Check for pending requests to the same URL
    const requestKey = this.getRequestKey('get', url, options);
    
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    // Check cache first
    const cachedResponse = await this.cacheAdapter.getCachedResponse(url, options, cacheConfig);
    
    if (cachedResponse) {
      const response = this.transformResponse<T>(cachedResponse, true);
      
      // If background refresh is enabled, refresh the cache in the background
      if (cacheConfig.options?.staleWhileRevalidate && !options?.background) {
        this.refreshCacheInBackground(url, options, cacheConfig);
      }
      
      return response;
    }

    // Create the request promise
    const requestPromise = this.makeRequest<T>('get', url, undefined, options);
    
    // Store the promise for deduplication
    this.pendingRequests.set(requestKey, requestPromise);
    
    try {
      const response = await requestPromise;
      return response;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    // Check if we're offline
    if (!navigator.onLine && this.config.offlineSupport) {
      // Queue request for later
      this.offlineQueue.push({
        method: 'post',
        url,
        data,
        options
      });
      
      throw new Error('You are offline. Your request has been queued and will be sent when you are back online.');
    }

    const response = await this.makeRequest<T>('post', url, data, options);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a PUT request
   */
  public async put<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    // Check if we're offline
    if (!navigator.onLine && this.config.offlineSupport) {
      // Queue request for later
      this.offlineQueue.push({
        method: 'put',
        url,
        data,
        options
      });
      
      throw new Error('You are offline. Your request has been queued and will be sent when you are back online.');
    }

    const response = await this.makeRequest<T>('put', url, data, options);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    // Check if we're offline
    if (!navigator.onLine && this.config.offlineSupport) {
      // Queue request for later
      this.offlineQueue.push({
        method: 'patch',
        url,
        data,
        options
      });
      
      throw new Error('You are offline. Your request has been queued and will be sent when you are back online.');
    }

    const response = await this.makeRequest<T>('patch', url, data, options);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    // Check if we're offline
    if (!navigator.onLine && this.config.offlineSupport) {
      // Queue request for later
      this.offlineQueue.push({
        method: 'delete',
        url,
        options
      });
      
      throw new Error('You are offline. Your request has been queued and will be sent when you are back online.');
    }

    const response = await this.makeRequest<T>('delete', url, undefined, options);
    
    // Invalidate related cache entries
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a request with retry logic
   */
  private async makeRequest<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestOptions,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      let response: AxiosResponse;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await this.client.get(url, options);
          break;
        case 'post':
          response = await this.client.post(url, data, options);
          break;
        case 'put':
          response = await this.client.put(url, data, options);
          break;
        case 'patch':
          response = await this.client.patch(url, data, options);
          break;
        case 'delete':
          response = await this.client.delete(url, options);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      // Cache the response if it's a GET request
      if (method.toLowerCase() === 'get') {
        const cacheConfig: ApiCacheConfig = {
          ...this.config.cache,
          ...options?.cache,
          priority: options?.priority || CachePriority.NORMAL
        };
        
        await this.cacheAdapter.cacheResponse(url, response, options, cacheConfig);
      }
      
      return this.transformResponse<T>(response);
    } catch (error) {
      // Handle retry logic
      const shouldRetry = this.shouldRetry(error as AxiosError, options, retryCount);
      
      if (shouldRetry) {
        const retryConfig = this.getRetryConfig(options);
        const delay = retryConfig.retryDelay * Math.pow(2, retryCount);
        
        console.log(`Retrying request (${retryCount + 1}/${retryConfig.maxRetries}): ${method} ${url}`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.makeRequest<T>(method, url, data, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Refresh cache in the background
   */
  private async refreshCacheInBackground(
    url: string,
    options?: RequestOptions,
    cacheConfig?: ApiCacheConfig
  ): Promise<void> {
    try {
      // Clone options and mark as background request
      const backgroundOptions: RequestOptions = {
        ...options,
        background: true,
        cache: {
          ...options?.cache,
          forceRefresh: true
        }
      };
      
      // Make the request in the background
      await this.get(url, backgroundOptions);
    } catch (error) {
      console.error('Background cache refresh failed:', error);
    }
  }

  /**
   * Check if a request should be retried
   */
  private shouldRetry(
    error: AxiosError,
    options?: RequestOptions,
    retryCount: number = 0
  ): boolean {
    // Don't retry if explicitly disabled
    if (options?.retry === false) {
      return false;
    }
    
    const retryConfig = this.getRetryConfig(options);
    
    // Don't retry if max retries reached
    if (retryCount >= retryConfig.maxRetries) {
      return false;
    }
    
    // Check if status code is in the retry list
    if (error.response && retryConfig.retryStatusCodes.includes(error.response.status)) {
      return true;
    }
    
    // Retry network errors
    if (!error.response && error.code === 'ECONNABORTED') {
      return true;
    }
    
    return false;
  }

  /**
   * Get retry configuration
   */
  private getRetryConfig(options?: RequestOptions): RetryConfig {
    // Start with default retry config
    const defaultConfig = this.config.retryConfig || DEFAULT_CONFIG.retryConfig!;
    
    // If retry is explicitly disabled, return empty config
    if (options?.retry === false) {
      return {
        maxRetries: 0,
        retryDelay: 0,
        retryStatusCodes: []
      };
    }
    
    // If retry is a boolean, use default config
    if (options?.retry === true) {
      return defaultConfig;
    }
    
    // Merge with request-specific retry options
    return {
      ...defaultConfig,
      ...(typeof options?.retry === 'object' ? options.retry : {})
    };
  }

  /**
   * Get a unique key for a request for deduplication
   */
  private getRequestKey(method: string, url: string, options?: RequestOptions): string {
    let key = `${method}:${url}`;
    
    // Include query parameters in the key
    if (options?.params) {
      key += `:${JSON.stringify(options.params)}`;
    }
    
    return key;
  }

  /**
   * Transform Axios response to API response
   */
  private transformResponse<T>(response: AxiosResponse, cached: boolean = false): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      cached
    };
  }

  /**
   * Handle successful response
   */
  private handleSuccess(response: AxiosResponse): AxiosResponse {
    return response;
  }

  /**
   * Handle error response
   */
  private handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        statusText: error.response.statusText,
        errors: error.response.data?.errors,
        requestId: error.response.headers['x-request-id'],
      };

      // Handle authentication errors
      if (error.response.status === 401) {
        // Dispatch event for auth error
        window.dispatchEvent(new CustomEvent('auth:error', { detail: apiError }));
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        message: 'No response received from server',
        status: 0,
        statusText: 'Network Error',
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        message: error.message,
        status: 0,
        statusText: 'Request Error',
      });
    }
  }

  /**
   * Invalidate cache entries related to a URL
   */
  private invalidateRelatedCache(url: string): void {
    // Extract the resource type from the URL
    const urlParts = url.split('/').filter(Boolean);
    
    if (urlParts.length > 0) {
      // Invalidate all cache entries for this resource type
      // For example, if the URL is '/projects/123', invalidate all '/projects' cache entries
      const resourceType = urlParts[0];
      this.cacheAdapter.invalidateByUrl(new RegExp(`/${resourceType}`));
      
      // Also invalidate in service worker if available
      if (this.config.offlineSupport && serviceWorkerManager.isSupported()) {
        serviceWorkerManager.invalidateApiCache(`/${resourceType}`);
      }
    }
  }

  /**
   * Clear the API cache
   */
  public async clearCache(): Promise<void> {
    await this.cacheAdapter.invalidateAll();
    
    // Also clear service worker cache if available
    if (this.config.offlineSupport && serviceWorkerManager.isSupported()) {
      await serviceWorkerManager.clearCaches();
    }
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats() {
    return this.cacheAdapter.cacheManager.getStats();
  }
}

// Create and export a singleton instance
export const enhancedApiClient = new EnhancedApiClient();

// Export the class for testing or custom instances
export default EnhancedApiClient;
