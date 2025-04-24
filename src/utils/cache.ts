/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  value: T;
  expiry: number | null;
}

/**
 * Cache options
 */
interface CacheOptions {
  /**
   * Time to live in milliseconds
   * Set to null for no expiration
   * @default 5 minutes
   */
  ttl?: number | null;
  
  /**
   * Maximum number of entries in the cache
   * When exceeded, the least recently used entry is removed
   * @default 100
   */
  maxSize?: number;
}

/**
 * A simple in-memory LRU cache with expiration
 */
class Cache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private accessOrder: string[] = [];
  private readonly ttl: number | null;
  private readonly maxSize: number;
  
  /**
   * Creates a new cache instance
   * @param options - Cache options
   */
  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.ttl = options.ttl ?? 5 * 60 * 1000; // Default: 5 minutes
    this.maxSize = options.maxSize ?? 100;
  }
  
  /**
   * Gets a value from the cache
   * @param key - Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    this.cleanExpired();
    
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (entry.expiry !== null && entry.expiry < Date.now()) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return undefined;
    }
    
    // Update access order (move to end)
    this.updateAccessOrder(key);
    
    return entry.value;
  }
  
  /**
   * Sets a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Optional override for TTL
   */
  set(key: string, value: T, options?: { ttl?: number | null }): void {
    this.cleanExpired();
    
    // Calculate expiry time
    const ttl = options?.ttl !== undefined ? options.ttl : this.ttl;
    const expiry = ttl === null ? null : Date.now() + ttl;
    
    // Add to cache
    this.cache.set(key, { value, expiry });
    
    // Update access order
    this.updateAccessOrder(key);
    
    // Enforce max size
    if (this.cache.size > this.maxSize) {
      const oldest = this.accessOrder[0];
      this.cache.delete(oldest);
      this.accessOrder.shift();
    }
  }
  
  /**
   * Removes a value from the cache
   * @param key - Cache key
   * @returns True if the key was found and removed
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.removeFromAccessOrder(key);
    return result;
  }
  
  /**
   * Checks if a key exists in the cache and is not expired
   * @param key - Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }
  
  /**
   * Clears all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }
  
  /**
   * Gets all valid keys in the cache
   * @returns Array of keys
   */
  keys(): string[] {
    this.cleanExpired();
    return [...this.cache.keys()];
  }
  
  /**
   * Gets the number of entries in the cache
   * @returns Number of entries
   */
  size(): number {
    this.cleanExpired();
    return this.cache.size;
  }
  
  /**
   * Updates the access order for a key
   * @param key - Cache key
   */
  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }
  
  /**
   * Removes a key from the access order
   * @param key - Cache key
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index !== -1) {
      this.accessOrder.splice(index, 1);
    }
  }
  
  /**
   * Removes all expired entries from the cache
   */
  private cleanExpired(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry !== null && entry.expiry < now) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
      }
    }
  }
}

// Create a global cache instance
export const globalCache = new Cache();

/**
 * Memoizes a function with caching
 * @param fn - Function to memoize
 * @param options - Cache options
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: CacheOptions & { keyFn?: (...args: Parameters<T>) => string } = {}
): T {
  const cache = new Cache<ReturnType<T>>(options);
  
  return ((...args: Parameters<T>) => {
    // Generate cache key
    const key = options.keyFn 
      ? options.keyFn(...args) 
      : JSON.stringify(args);
    
    // Check cache
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    
    // Call original function
    const result = fn(...args);
    
    // Cache result if it's not a Promise
    if (!(result instanceof Promise)) {
      cache.set(key, result);
      return result;
    }
    
    // Handle Promise results
    return result.then((value) => {
      cache.set(key, value);
      return value;
    });
  }) as T;
}

export default Cache;
