/**
 * API Client for Genius Online Navigator
 * 
 * This module provides a centralized client for making API requests to the backend.
 * It handles authentication, error handling, and request/response formatting.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiCache, CacheOptions } from '@/lib/apiCache';

// Types
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  cache?: boolean | CacheOptions;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  cached?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  errors?: any;
  requestId?: string;
}

export interface RequestOptions extends AxiosRequestConfig {
  cache?: boolean | CacheOptions;
  cacheKey?: string;
}

// Default configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.geniusonlinenavigator.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxItems: 100,
  },
};

/**
 * API Client class for making HTTP requests
 */
class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private defaultCacheOptions: boolean | CacheOptions;

  constructor(config: ApiClientConfig = DEFAULT_CONFIG) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || DEFAULT_CONFIG.timeout,
      headers: { ...DEFAULT_CONFIG.headers, ...config.headers },
    });

    this.defaultCacheOptions = config.cache !== undefined ? config.cache : DEFAULT_CONFIG.cache;

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
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
  public async get<T>(url: string, config?: RequestOptions): Promise<ApiResponse<T>> {
    const shouldCache = this.shouldUseCache(config);
    
    if (shouldCache) {
      const cacheKey = this.getCacheKey('GET', url, config);
      const cachedResponse = apiCache.get<ApiResponse<T>>(cacheKey);
      
      if (cachedResponse) {
        return {
          ...cachedResponse,
          cached: true
        };
      }
      
      const response = await this.client.get<T>(url, config);
      const apiResponse = this.handleSuccess(response);
      
      // Cache the response
      const cacheOptions = this.getCacheOptions(config);
      apiCache.set(cacheKey, apiResponse, cacheOptions);
      
      return apiResponse;
    }
    
    return this.client.get<T>(url, config);
  }

  /**
   * Make a POST request
   */
  public async post<T>(url: string, data?: any, config?: RequestOptions): Promise<ApiResponse<T>> {
    // POST requests are not cached by default
    const response = await this.client.post<T>(url, data, config);
    
    // Invalidate cache for related resources
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a PUT request
   */
  public async put<T>(url: string, data?: any, config?: RequestOptions): Promise<ApiResponse<T>> {
    // PUT requests are not cached by default
    const response = await this.client.put<T>(url, data, config);
    
    // Invalidate cache for related resources
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(url: string, data?: any, config?: RequestOptions): Promise<ApiResponse<T>> {
    // PATCH requests are not cached by default
    const response = await this.client.patch<T>(url, data, config);
    
    // Invalidate cache for related resources
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(url: string, config?: RequestOptions): Promise<ApiResponse<T>> {
    // DELETE requests are not cached by default
    const response = await this.client.delete<T>(url, config);
    
    // Invalidate cache for related resources
    this.invalidateRelatedCache(url);
    
    return response;
  }

  /**
   * Clear the API cache
   */
  public clearCache(): void {
    apiCache.clear();
  }

  /**
   * Clear expired cache entries
   */
  public clearExpiredCache(): number {
    return apiCache.clearExpired();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return apiCache.getStats();
  }

  /**
   * Handle successful response
   */
  private handleSuccess(response: AxiosResponse): ApiResponse<any> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
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
   * Check if caching should be used for a request
   */
  private shouldUseCache(config?: RequestOptions): boolean {
    // If cache is explicitly disabled in the request config, don't use cache
    if (config?.cache === false) {
      return false;
    }
    
    // If cache is explicitly enabled in the request config or default config, use cache
    return config?.cache !== undefined ? !!config.cache : !!this.defaultCacheOptions;
  }

  /**
   * Get cache options for a request
   */
  private getCacheOptions(config?: RequestOptions): CacheOptions {
    // Start with default cache options
    const defaultOptions = typeof this.defaultCacheOptions === 'boolean' 
      ? {} 
      : this.defaultCacheOptions || {};
    
    // Override with request-specific cache options
    const requestOptions = typeof config?.cache === 'boolean' 
      ? {} 
      : config?.cache || {};
    
    return { ...defaultOptions, ...requestOptions };
  }

  /**
   * Generate a cache key for a request
   */
  private getCacheKey(method: string, url: string, config?: RequestOptions): string {
    // If a custom cache key is provided, use it
    if (config?.cacheKey) {
      return config.cacheKey;
    }
    
    // Generate a cache key based on the request
    let key = `${method}:${url}`;
    
    // Include query parameters in the cache key
    if (config?.params) {
      key += `:${JSON.stringify(config.params)}`;
    }
    
    return key;
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
      apiCache.invalidateByPrefix(`GET:/${resourceType}`);
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export default ApiClient;
