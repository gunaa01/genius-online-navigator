/**
 * API Cache System
 * 
 * This module provides a caching system for API responses to improve performance
 * and reduce redundant network requests. It supports time-based expiration,
 * conditional invalidation, and storage limits.
 */

// Types
export interface CacheOptions {
  // Time to live in milliseconds (default: 5 minutes)
  ttl?: number;
  // Maximum number of items to store in the cache (default: 100)
  maxItems?: number;
  // Whether to store the cache in localStorage (default: false)
  persistent?: boolean;
  // Cache namespace for partitioning (default: 'api-cache')
  namespace?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
  key: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

// Default options
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxItems: 100,
  persistent: false,
  namespace: 'api-cache'
};

/**
 * API Cache class for caching API responses
 */
class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private options: CacheOptions;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    oldestEntry: null,
    newestEntry: null
  };

  constructor(options: CacheOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Load from localStorage if persistent
    if (this.options.persistent) {
      this.loadFromStorage();
    }
  }

  /**
   * Set a cache entry
   * 
   * @param key The cache key
   * @param data The data to cache
   * @param options Optional cache options for this entry
   * @returns The cached entry
   */
  set<T>(key: string, data: T, options?: Partial<CacheOptions>): CacheEntry<T> {
    const fullKey = this.getFullKey(key);
    const ttl = options?.ttl || this.options.ttl;
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expires: now + (ttl || 0),
      key
    };
    
    // Enforce max items limit
    if (this.cache.size >= (this.options.maxItems || 0) && !this.cache.has(fullKey)) {
      this.evictOldest();
    }
    
    this.cache.set(fullKey, entry);
    this.updateStats();
    
    // Save to localStorage if persistent
    if (this.options.persistent) {
      this.saveToStorage();
    }
    
    return entry;
  }

  /**
   * Get a cache entry
   * 
   * @param key The cache key
   * @returns The cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const fullKey = this.getFullKey(key);
    const entry = this.cache.get(fullKey) as CacheEntry<T> | undefined;
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (entry.expires < Date.now()) {
      this.cache.delete(fullKey);
      this.updateStats();
      this.stats.misses++;
      
      // Save to localStorage if persistent
      if (this.options.persistent) {
        this.saveToStorage();
      }
      
      return null;
    }
    
    this.stats.hits++;
    return entry.data;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const fullKey = this.getFullKey(key);
    const entry = this.cache.get(fullKey);
    
    if (!entry) {
      return false;
    }
    
    // Check if expired
    if (entry.expires < Date.now()) {
      this.cache.delete(fullKey);
      this.updateStats();
      
      // Save to localStorage if persistent
      if (this.options.persistent) {
        this.saveToStorage();
      }
      
      return false;
    }
    
    return true;
  }

  /**
   * Delete a cache entry
   * 
   * @param key The cache key
   * @returns True if the entry was deleted
   */
  delete(key: string): boolean {
    const fullKey = this.getFullKey(key);
    const result = this.cache.delete(fullKey);
    
    if (result) {
      this.updateStats();
      
      // Save to localStorage if persistent
      if (this.options.persistent) {
        this.saveToStorage();
      }
    }
    
    return result;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.updateStats();
    
    // Save to localStorage if persistent
    if (this.options.persistent) {
      this.saveToStorage();
    }
  }

  /**
   * Clear all expired cache entries
   * 
   * @returns The number of entries cleared
   */
  clearExpired(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires < now) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      this.updateStats();
      
      // Save to localStorage if persistent
      if (this.options.persistent) {
        this.saveToStorage();
      }
    }
    
    return cleared;
  }

  /**
   * Get cache statistics
   * 
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Invalidate cache entries by prefix
   * 
   * @param prefix The prefix to match
   * @returns The number of entries invalidated
   */
  invalidateByPrefix(prefix: string): number {
    const fullPrefix = this.getFullKey(prefix);
    let invalidated = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(fullPrefix)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    if (invalidated > 0) {
      this.updateStats();
      
      // Save to localStorage if persistent
      if (this.options.persistent) {
        this.saveToStorage();
      }
    }
    
    return invalidated;
  }

  /**
   * Invalidate cache entries by pattern
   * 
   * @param pattern The pattern to match
   * @returns The number of entries invalidated
   */
  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (pattern.test(entry.key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    if (invalidated > 0) {
      this.updateStats();
      
      // Save to localStorage if persistent
      if (this.options.persistent) {
        this.saveToStorage();
      }
    }
    
    return invalidated;
  }

  /**
   * Get the full cache key with namespace
   * 
   * @param key The cache key
   * @returns The full cache key
   */
  private getFullKey(key: string): string {
    return `${this.options.namespace}:${key}`;
  }

  /**
   * Evict the oldest cache entry
   */
  private evictOldest(): void {
    let oldest: [string, CacheEntry<any>] | null = null;
    
    for (const entry of this.cache.entries()) {
      if (!oldest || entry[1].timestamp < oldest[1].timestamp) {
        oldest = entry;
      }
    }
    
    if (oldest) {
      this.cache.delete(oldest[0]);
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
    
    let oldest = Number.MAX_SAFE_INTEGER;
    let newest = 0;
    
    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    }
    
    this.stats.oldestEntry = this.cache.size > 0 ? oldest : null;
    this.stats.newestEntry = this.cache.size > 0 ? newest : null;
  }

  /**
   * Save the cache to localStorage
   */
  private saveToStorage(): void {
    if (!this.options.persistent || typeof window === 'undefined') {
      return;
    }
    
    try {
      const serialized = JSON.stringify(Array.from(this.cache.entries()));
      localStorage.setItem(this.options.namespace || 'api-cache', serialized);
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  /**
   * Load the cache from localStorage
   */
  private loadFromStorage(): void {
    if (!this.options.persistent || typeof window === 'undefined') {
      return;
    }
    
    try {
      const serialized = localStorage.getItem(this.options.namespace || 'api-cache');
      
      if (serialized) {
        const entries = JSON.parse(serialized) as [string, CacheEntry<any>][];
        this.cache = new Map(entries);
        this.clearExpired();
        this.updateStats();
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  }
}

// Create and export a singleton instance
export const apiCache = new APICache();

// Export the class for testing or custom instances
export default APICache;
