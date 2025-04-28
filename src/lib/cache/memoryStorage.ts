import { CacheEntry, CacheStorage } from './cacheTypes';

/**
 * In-memory cache storage implementation
 */
export class MemoryStorage<T> implements CacheStorage<T> {
  private storage: Map<string, CacheEntry<T>> = new Map();

  /**
   * Get an item from the cache
   * 
   * @param key The cache key
   * @returns The cache entry or undefined if not found
   */
  async get(key: string): Promise<CacheEntry<T> | undefined> {
    return this.storage.get(key);
  }

  /**
   * Set an item in the cache
   * 
   * @param key The cache key
   * @param entry The cache entry
   */
  async set(key: string, entry: CacheEntry<T>): Promise<void> {
    this.storage.set(key, entry);
  }

  /**
   * Delete an item from the cache
   * 
   * @param key The cache key
   * @returns True if the item was deleted
   */
  async delete(key: string): Promise<boolean> {
    return this.storage.delete(key);
  }

  /**
   * Check if an item exists in the cache
   * 
   * @param key The cache key
   * @returns True if the item exists
   */
  async has(key: string): Promise<boolean> {
    return this.storage.has(key);
  }

  /**
   * Clear all items from the cache
   */
  async clear(): Promise<void> {
    this.storage.clear();
  }

  /**
   * Get all keys in the cache
   * 
   * @returns Array of cache keys
   */
  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  /**
   * Get all entries in the cache
   * 
   * @returns Array of [key, entry] pairs
   */
  async entries(): Promise<[string, CacheEntry<T>][]> {
    return Array.from(this.storage.entries());
  }

  /**
   * Get the size of the cache
   * 
   * @returns Number of items in the cache
   */
  async size(): Promise<number> {
    return this.storage.size;
  }
}
