import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CacheManager } from './cacheManager';
import { CacheOptions, CachePriority } from './cacheTypes';

/**
 * API Cache Configuration
 */
export interface ApiCacheConfig {
  // Whether to enable caching for this request
  enabled?: boolean;
  // Cache key to use (defaults to URL + serialized params)
  key?: string;
  // Cache options
  options?: Partial<CacheOptions>;
  // Cache tags for invalidation
  tags?: string[];
  // Whether to force a refresh (bypass cache)
  forceRefresh?: boolean;
  // Whether to update the cache even on error responses
  cacheErrorResponses?: boolean;
  // Status codes to cache (defaults to only 2xx)
  cacheableStatuses?: number[];
  // Priority of this cache entry
  priority?: CachePriority;
}

/**
 * Default API cache configuration
 */
const DEFAULT_API_CACHE_CONFIG: ApiCacheConfig = {
  enabled: true,
  cacheErrorResponses: false,
  cacheableStatuses: [200, 201, 202, 203, 204, 206, 207, 208, 226],
  priority: CachePriority.NORMAL
};

/**
 * API Cache Adapter
 * 
 * This class provides integration between the CacheManager and API clients
 * like Axios to enable caching of API responses.
 */
export class ApiCacheAdapter {
  private cacheManager: CacheManager<AxiosResponse>;
  private config: ApiCacheConfig;

  /**
   * Create a new ApiCacheAdapter
   * 
   * @param cacheManager The cache manager to use
   * @param config Default API cache configuration
   */
  constructor(
    cacheManager: CacheManager<AxiosResponse>,
    config: ApiCacheConfig = DEFAULT_API_CACHE_CONFIG
  ) {
    this.cacheManager = cacheManager;
    this.config = { ...DEFAULT_API_CACHE_CONFIG, ...config };
  }

  /**
   * Generate a cache key for a request
   * 
   * @param url The request URL
   * @param config The request configuration
   * @returns The cache key
   */
  generateCacheKey(url: string, config?: AxiosRequestConfig): string {
    const method = (config?.method || 'get').toLowerCase();
    const params = config?.params ? JSON.stringify(config.params) : '';
    const headers = config?.headers ? JSON.stringify(config.headers) : '';
    
    // Only include headers in the cache key if they're relevant for caching
    // (e.g., Accept, Content-Type, but not Authorization)
    const relevantHeaders = config?.headers ? 
      JSON.stringify(this.extractRelevantHeaders(config.headers)) : '';
    
    return `${method}:${url}:${params}:${relevantHeaders}`;
  }

  /**
   * Extract headers that are relevant for caching
   * 
   * @param headers The request headers
   * @returns The relevant headers for caching
   */
  private extractRelevantHeaders(headers: any): Record<string, string> {
    const relevantHeaders: Record<string, string> = {};
    const relevantHeaderNames = [
      'accept',
      'content-type',
      'x-api-version',
      'x-requested-with'
    ];
    
    for (const name of relevantHeaderNames) {
      if (headers[name]) {
        relevantHeaders[name] = headers[name];
      }
    }
    
    return relevantHeaders;
  }

  /**
   * Check if a request is cacheable
   * 
   * @param config The request configuration
   * @param cacheConfig The cache configuration
   * @returns True if the request is cacheable
   */
  isCacheable(
    config: AxiosRequestConfig,
    cacheConfig: ApiCacheConfig = {}
  ): boolean {
    // Merge with default config
    const mergedConfig = { ...this.config, ...cacheConfig };
    
    // Check if caching is enabled
    if (!mergedConfig.enabled) {
      return false;
    }
    
    // Check if force refresh is enabled
    if (mergedConfig.forceRefresh) {
      return false;
    }
    
    // Only cache GET requests by default
    const method = (config.method || 'get').toLowerCase();
    if (method !== 'get') {
      return false;
    }
    
    return true;
  }

  /**
   * Check if a response is cacheable
   * 
   * @param response The response
   * @param cacheConfig The cache configuration
   * @returns True if the response is cacheable
   */
  isResponseCacheable(
    response: AxiosResponse,
    cacheConfig: ApiCacheConfig = {}
  ): boolean {
    // Merge with default config
    const mergedConfig = { ...this.config, ...cacheConfig };
    
    // Check if caching is enabled
    if (!mergedConfig.enabled) {
      return false;
    }
    
    // Check if the status code is cacheable
    const cacheableStatuses = mergedConfig.cacheableStatuses || 
      DEFAULT_API_CACHE_CONFIG.cacheableStatuses;
    
    return cacheableStatuses!.includes(response.status);
  }

  /**
   * Get a cached response
   * 
   * @param url The request URL
   * @param config The request configuration
   * @param cacheConfig The cache configuration
   * @returns The cached response or null if not found
   */
  async getCachedResponse(
    url: string,
    config?: AxiosRequestConfig,
    cacheConfig: ApiCacheConfig = {}
  ): Promise<AxiosResponse | null> {
    // Merge with default config
    const mergedConfig = { ...this.config, ...cacheConfig };
    
    // Check if request is cacheable
    if (!this.isCacheable(config || {}, mergedConfig)) {
      return null;
    }
    
    // Generate cache key
    const cacheKey = mergedConfig.key || this.generateCacheKey(url, config);
    
    // Get from cache
    return this.cacheManager.get(cacheKey);
  }

  /**
   * Cache a response
   * 
   * @param url The request URL
   * @param response The response to cache
   * @param config The request configuration
   * @param cacheConfig The cache configuration
   * @returns True if the response was cached
   */
  async cacheResponse(
    url: string,
    response: AxiosResponse,
    config?: AxiosRequestConfig,
    cacheConfig: ApiCacheConfig = {}
  ): Promise<boolean> {
    // Merge with default config
    const mergedConfig = { ...this.config, ...cacheConfig };
    
    // Check if response is cacheable
    if (!this.isResponseCacheable(response, mergedConfig)) {
      return false;
    }
    
    // Generate cache key
    const cacheKey = mergedConfig.key || this.generateCacheKey(url, config);
    
    // Set in cache
    await this.cacheManager.set(cacheKey, response, {
      ttl: mergedConfig.options?.ttl,
      defaultPriority: mergedConfig.priority
    });
    
    return true;
  }

  /**
   * Invalidate cache entries by URL pattern
   * 
   * @param urlPattern The URL pattern to match
   * @returns The number of entries invalidated
   */
  async invalidateByUrl(urlPattern: RegExp): Promise<number> {
    return this.cacheManager.invalidateByPattern(urlPattern);
  }

  /**
   * Invalidate cache entries by tag
   * 
   * @param tag The tag to match
   * @returns The number of entries invalidated
   */
  async invalidateByTag(tag: string): Promise<number> {
    return this.cacheManager.invalidateByPrefix(`tag:${tag}:`);
  }

  /**
   * Invalidate all cache entries
   */
  async invalidateAll(): Promise<void> {
    await this.cacheManager.clear();
  }
}

// Create and export a singleton instance
export const apiCacheAdapter = new ApiCacheAdapter(new CacheManager<AxiosResponse>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxItems: 100,
  staleWhileRevalidate: true,
  debug: process.env.NODE_ENV === 'development'
}));

// Export the class for testing or custom instances
export default ApiCacheAdapter;
