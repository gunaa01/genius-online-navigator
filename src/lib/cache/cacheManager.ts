import { 
  CacheOptions, 
  CacheEntry, 
  CacheStats, 
  CacheEventType, 
  CacheEvent, 
  CacheEventListener,
  CachePriority,
  CacheEntryState
} from './cacheTypes';
import { MemoryStorage } from './memoryStorage';

/**
 * Default cache options
 */
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxItems: 100,
  persistent: false,
  namespace: 'advanced-cache',
  debug: false,
  staleWhileRevalidate: false,
  staleTime: 60 * 1000, // 1 minute
  defaultPriority: CachePriority.NORMAL
};

/**
 * Advanced Cache Manager
 * 
 * This class provides advanced caching capabilities including:
 * - Time-based expiration
 * - Memory-based storage
 * - Stale-while-revalidate pattern
 * - Event listeners for cache operations
 * - Statistics tracking
 * - Priority-based eviction
 */
export class CacheManager<T = any> {
  private options: CacheOptions;
  private storage: MemoryStorage<T>;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    oldestEntry: null,
    newestEntry: null,
    hitRatio: 0,
    evictions: 0,
    expirations: 0
  };
  private eventListeners: Map<CacheEventType, Set<CacheEventListener>> = new Map();
  private cleanupInterval: number | null = null;

  /**
   * Create a new CacheManager
   * 
   * @param options Cache options
   */
  constructor(options: Partial<CacheOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.storage = new MemoryStorage<T>();
    
    // Set up periodic cleanup of expired items
    if (typeof window !== 'undefined') {
      this.cleanupInterval = window.setInterval(() => {
        this.clearExpired();
      }, 60 * 1000); // Run every minute
    }
  }

  /**
   * Set a value in the cache
   * 
   * @param key The cache key
   * @param value The value to cache
   * @param options Optional cache options for this entry
   * @returns The cache entry
   */
  async set(key: string, value: T, options?: Partial<CacheOptions>): Promise<CacheEntry<T>> {
    const now = Date.now();
    const ttl = options?.ttl || this.options.ttl || DEFAULT_OPTIONS.ttl;
    const priority = options?.defaultPriority || this.options.defaultPriority || DEFAULT_OPTIONS.defaultPriority;
    
    const entry: CacheEntry<T> = {
      key,
      data: value,
      timestamp: now,
      expires: now + (ttl || 0),
      state: CacheEntryState.VALID,
      priority,
      accessCount: 0,
      lastAccessed: now
    };
    
    // Check if we need to evict items
    const size = await this.storage.size();
    if (size >= (this.options.maxItems || DEFAULT_OPTIONS.maxItems!)) {
      await this.evictItems(1);
    }
    
    // Store the entry
    await this.storage.set(key, entry);
    
    // Update stats
    this.updateStats();
    
    // Emit event
    this.emitEvent({
      type: CacheEventType.SET,
      key,
      timestamp: now,
      data: { value }
    });
    
    return entry;
  }

  /**
   * Get a value from the cache
   * 
   * @param key The cache key
   * @returns The cached value or null if not found or expired
   */
  async get(key: string): Promise<T | null> {
    const now = Date.now();
    const entry = await this.storage.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRatio();
      
      this.emitEvent({
        type: CacheEventType.MISS,
        key,
        timestamp: now
      });
      
      return null;
    }
    
    // Check if expired
    if (entry.expires < now) {
      // If stale-while-revalidate is enabled, return stale value
      if (this.options.staleWhileRevalidate && 
          entry.expires + (this.options.staleTime || 0) > now) {
        
        // Mark as stale
        entry.state = CacheEntryState.STALE;
        await this.storage.set(key, entry);
        
        this.stats.hits++;
        this.updateHitRatio();
        
        this.emitEvent({
          type: CacheEventType.HIT,
          key,
          timestamp: now,
          data: { stale: true }
        });
        
        return entry.data;
      }
      
      // Otherwise, remove expired entry
      await this.storage.delete(key);
      this.stats.misses++;
      this.stats.expirations = (this.stats.expirations || 0) + 1;
      this.updateHitRatio();
      
      this.emitEvent({
        type: CacheEventType.EXPIRE,
        key,
        timestamp: now
      });
      
      return null;
    }
    
    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = now;
    await this.storage.set(key, entry);
    
    this.stats.hits++;
    this.updateHitRatio();
    
    this.emitEvent({
      type: CacheEventType.HIT,
      key,
      timestamp: now
    });
    
    return entry.data;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const entry = await this.storage.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if expired
    if (entry.expires < Date.now()) {
      // If stale-while-revalidate is enabled, consider stale values as valid
      if (this.options.staleWhileRevalidate && 
          entry.expires + (this.options.staleTime || 0) > Date.now()) {
        return true;
      }
      
      await this.storage.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete a value from the cache
   * 
   * @param key The cache key
   * @returns True if the value was deleted
   */
  async delete(key: string): Promise<boolean> {
    const deleted = await this.storage.delete(key);
    
    if (deleted) {
      this.updateStats();
      
      this.emitEvent({
        type: CacheEventType.DELETE,
        key,
        timestamp: Date.now()
      });
    }
    
    return deleted;
  }

  /**
   * Clear all values from the cache
   */
  async clear(): Promise<void> {
    await this.storage.clear();
    
    // Reset stats
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      oldestEntry: null,
      newestEntry: null,
      hitRatio: 0,
      evictions: 0,
      expirations: 0
    };
    
    this.emitEvent({
      type: CacheEventType.CLEAR,
      timestamp: Date.now()
    });
  }

  /**
   * Clear all expired values from the cache
   * 
   * @returns The number of expired values cleared
   */
  async clearExpired(): Promise<number> {
    const now = Date.now();
    let cleared = 0;
    
    const entries = await this.storage.entries();
    
    for (const [key, entry] of entries) {
      if (entry.expires < now) {
        // If stale-while-revalidate is enabled, keep stale values
        if (this.options.staleWhileRevalidate && 
            entry.expires + (this.options.staleTime || 0) > now) {
          continue;
        }
        
        await this.storage.delete(key);
        cleared++;
        
        this.emitEvent({
          type: CacheEventType.EXPIRE,
          key,
          timestamp: now
        });
      }
    }
    
    if (cleared > 0) {
      this.stats.expirations = (this.stats.expirations || 0) + cleared;
      this.updateStats();
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
   * Add an event listener
   * 
   * @param type The event type to listen for
   * @param listener The event listener function
   */
  addEventListener(type: CacheEventType, listener: CacheEventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    
    this.eventListeners.get(type)!.add(listener);
  }

  /**
   * Remove an event listener
   * 
   * @param type The event type
   * @param listener The event listener function
   * @returns True if the listener was removed
   */
  removeEventListener(type: CacheEventType, listener: CacheEventListener): boolean {
    if (!this.eventListeners.has(type)) {
      return false;
    }
    
    return this.eventListeners.get(type)!.delete(listener);
  }

  /**
   * Invalidate cache entries by prefix
   * 
   * @param prefix The prefix to match
   * @returns The number of entries invalidated
   */
  async invalidateByPrefix(prefix: string): Promise<number> {
    let invalidated = 0;
    
    const entries = await this.storage.entries();
    
    for (const [key, _] of entries) {
      if (key.startsWith(prefix)) {
        await this.storage.delete(key);
        invalidated++;
        
        this.emitEvent({
          type: CacheEventType.DELETE,
          key,
          timestamp: Date.now(),
          data: { reason: 'prefix-invalidation', prefix }
        });
      }
    }
    
    if (invalidated > 0) {
      this.updateStats();
    }
    
    return invalidated;
  }

  /**
   * Invalidate cache entries by pattern
   * 
   * @param pattern The pattern to match
   * @returns The number of entries invalidated
   */
  async invalidateByPattern(pattern: RegExp): Promise<number> {
    let invalidated = 0;
    
    const entries = await this.storage.entries();
    
    for (const [key, _] of entries) {
      if (pattern.test(key)) {
        await this.storage.delete(key);
        invalidated++;
        
        this.emitEvent({
          type: CacheEventType.DELETE,
          key,
          timestamp: Date.now(),
          data: { reason: 'pattern-invalidation', pattern: pattern.toString() }
        });
      }
    }
    
    if (invalidated > 0) {
      this.updateStats();
    }
    
    return invalidated;
  }

  /**
   * Dispose of the cache manager and clean up resources
   */
  dispose(): void {
    if (this.cleanupInterval !== null && typeof window !== 'undefined') {
      window.clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.eventListeners.clear();
  }

  /**
   * Emit a cache event
   * 
   * @param event The event to emit
   */
  private emitEvent(event: CacheEvent): void {
    if (!this.options.debug && event.type !== CacheEventType.ERROR) {
      return;
    }
    
    if (this.eventListeners.has(event.type)) {
      for (const listener of this.eventListeners.get(event.type)!) {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in cache event listener:', error);
        }
      }
    }
    
    // Also emit to all listeners
    if (this.eventListeners.has(CacheEventType.ERROR) && event.type === CacheEventType.ERROR) {
      for (const listener of this.eventListeners.get(CacheEventType.ERROR)!) {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in cache error event listener:', error);
        }
      }
    }
  }

  /**
   * Update cache statistics
   */
  private async updateStats(): Promise<void> {
    const entries = await this.storage.entries();
    
    this.stats.size = entries.length;
    
    let oldest = Number.MAX_SAFE_INTEGER;
    let newest = 0;
    
    for (const [_, entry] of entries) {
      if (entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    }
    
    this.stats.oldestEntry = entries.length > 0 ? oldest : null;
    this.stats.newestEntry = entries.length > 0 ? newest : null;
    
    this.updateHitRatio();
  }

  /**
   * Update the hit ratio statistic
   */
  private updateHitRatio(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRatio = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Evict items from the cache based on priority and access patterns
   * 
   * @param count The number of items to evict
   * @returns The number of items evicted
   */
  private async evictItems(count: number): Promise<number> {
    if (count <= 0) {
      return 0;
    }
    
    const entries = await this.storage.entries();
    
    // Sort by priority (lowest first) and then by last accessed (oldest first)
    entries.sort((a, b) => {
      if (a[1].priority !== b[1].priority) {
        return a[1].priority - b[1].priority;
      }
      return a[1].lastAccessed - b[1].lastAccessed;
    });
    
    // Evict the specified number of items
    let evicted = 0;
    for (let i = 0; i < count && i < entries.length; i++) {
      const [key, _] = entries[i];
      await this.storage.delete(key);
      evicted++;
      
      this.emitEvent({
        type: CacheEventType.EVICT,
        key,
        timestamp: Date.now()
      });
    }
    
    if (evicted > 0) {
      this.stats.evictions = (this.stats.evictions || 0) + evicted;
    }
    
    return evicted;
  }
}

// Create and export a singleton instance
export const cacheManager = new CacheManager();

// Export the class for testing or custom instances
export default CacheManager;
