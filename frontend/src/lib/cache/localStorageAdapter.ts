import { CacheEntry, CacheStorage } from './cacheTypes';

/**
 * LocalStorage cache storage implementation
 * 
 * This adapter uses localStorage for persistent cache storage.
 * Note that localStorage has a size limit (usually 5-10MB) and
 * can only store strings, so we need to serialize/deserialize.
 */
export class LocalStorageAdapter<T> implements CacheStorage<T> {
  private namespace: string;
  private memoryCache: Map<string, CacheEntry<T>> = new Map();

  /**
   * Create a new LocalStorageAdapter
   * 
   * @param namespace The namespace to use for localStorage keys
   */
  constructor(namespace: string = 'advanced-cache') {
    this.namespace = namespace;
    this.loadFromStorage();
  }

  /**
   * Get an item from the cache
   * 
   * @param key The cache key
   * @returns The cache entry or undefined if not found
   */
  async get(key: string): Promise<CacheEntry<T> | undefined> {
    // Check memory cache first for performance
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // Try to get from localStorage
    try {
      const fullKey = this.getFullKey(key);
      const serialized = localStorage.getItem(fullKey);
      
      if (serialized) {
        const entry = JSON.parse(serialized) as CacheEntry<T>;
        // Update memory cache
        this.memoryCache.set(key, entry);
        return entry;
      }
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
    }

    return undefined;
  }

  /**
   * Set an item in the cache
   * 
   * @param key The cache key
   * @param entry The cache entry
   */
  async set(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const serialized = JSON.stringify(entry);
      
      // Update localStorage
      localStorage.setItem(fullKey, serialized);
      
      // Update memory cache
      this.memoryCache.set(key, entry);
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      
      // If localStorage fails (e.g., quota exceeded), still update memory cache
      this.memoryCache.set(key, entry);
      
      // Try to free up space by removing oldest entries
      this.pruneStorage();
    }
  }

  /**
   * Delete an item from the cache
   * 
   * @param key The cache key
   * @returns True if the item was deleted
   */
  async delete(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      
      // Update memory cache
      return this.memoryCache.delete(key);
    } catch (error) {
      console.error(`Error deleting item ${key} from localStorage:`, error);
      
      // Still try to update memory cache
      return this.memoryCache.delete(key);
    }
  }

  /**
   * Check if an item exists in the cache
   * 
   * @param key The cache key
   * @returns True if the item exists
   */
  async has(key: string): Promise<boolean> {
    // Check memory cache first for performance
    if (this.memoryCache.has(key)) {
      return true;
    }

    // Check localStorage
    try {
      const fullKey = this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error(`Error checking if item ${key} exists in localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all items from the cache
   */
  async clear(): Promise<void> {
    try {
      // Clear only items in our namespace
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.namespace}:`)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear memory cache
      this.memoryCache.clear();
    } catch (error) {
      console.error('Error clearing localStorage cache:', error);
      
      // Still clear memory cache
      this.memoryCache.clear();
    }
  }

  /**
   * Get all keys in the cache
   * 
   * @returns Array of cache keys
   */
  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      const prefix = `${this.namespace}:`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length));
        }
      }
      
      return keys;
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      
      // Fall back to memory cache
      return Array.from(this.memoryCache.keys());
    }
  }

  /**
   * Get all entries in the cache
   * 
   * @returns Array of [key, entry] pairs
   */
  async entries(): Promise<[string, CacheEntry<T>][]> {
    try {
      const entries: [string, CacheEntry<T>][] = [];
      const keys = await this.keys();
      
      for (const key of keys) {
        const entry = await this.get(key);
        if (entry) {
          entries.push([key, entry]);
        }
      }
      
      return entries;
    } catch (error) {
      console.error('Error getting entries from localStorage:', error);
      
      // Fall back to memory cache
      return Array.from(this.memoryCache.entries());
    }
  }

  /**
   * Get the size of the cache
   * 
   * @returns Number of items in the cache
   */
  async size(): Promise<number> {
    try {
      const keys = await this.keys();
      return keys.length;
    } catch (error) {
      console.error('Error getting size from localStorage:', error);
      
      // Fall back to memory cache
      return this.memoryCache.size;
    }
  }

  /**
   * Get the full key with namespace
   * 
   * @param key The cache key
   * @returns The full key with namespace
   */
  private getFullKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  /**
   * Load all items from localStorage into memory cache
   */
  private loadFromStorage(): void {
    try {
      const prefix = `${this.namespace}:`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        
        if (fullKey && fullKey.startsWith(prefix)) {
          const key = fullKey.substring(prefix.length);
          const serialized = localStorage.getItem(fullKey);
          
          if (serialized) {
            try {
              const entry = JSON.parse(serialized) as CacheEntry<T>;
              this.memoryCache.set(key, entry);
            } catch (parseError) {
              console.error(`Error parsing localStorage item ${key}:`, parseError);
              // Remove invalid item
              localStorage.removeItem(fullKey);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  }

  /**
   * Prune localStorage to free up space
   * 
   * This removes the oldest 20% of entries when storage is full
   */
  private pruneStorage(): void {
    try {
      // Get all entries in our namespace
      const entries: [string, CacheEntry<T>][] = [];
      const prefix = `${this.namespace}:`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        
        if (fullKey && fullKey.startsWith(prefix)) {
          const key = fullKey.substring(prefix.length);
          const serialized = localStorage.getItem(fullKey);
          
          if (serialized) {
            try {
              const entry = JSON.parse(serialized) as CacheEntry<T>;
              entries.push([fullKey, entry]);
            } catch (parseError) {
              // Remove invalid item
              localStorage.removeItem(fullKey);
            }
          }
        }
      }
      
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 20%
      const toRemove = Math.ceil(entries.length * 0.2);
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        localStorage.removeItem(entries[i][0]);
      }
    } catch (error) {
      console.error('Error pruning localStorage:', error);
    }
  }
}
