/**
 * Advanced Cache System: Type Definitions
 * 
 * This module provides type definitions for the advanced caching system.
 */

/**
 * Cache storage types
 */
export enum CacheStorageType {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  INDEXED_DB = 'indexedDB',
  SERVICE_WORKER = 'serviceWorker'
}

/**
 * Cache eviction policies
 */
export enum CacheEvictionPolicy {
  LRU = 'lru',       // Least Recently Used
  LFU = 'lfu',       // Least Frequently Used
  FIFO = 'fifo',     // First In First Out
  PRIORITY = 'priority' // Priority-based
}

/**
 * Cache priority levels
 */
export enum CachePriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

/**
 * Cache entry state
 */
export enum CacheEntryState {
  VALID = 'valid',
  EXPIRED = 'expired',
  STALE = 'stale',
  REFRESHING = 'refreshing'
}

/**
 * Cache options
 */
export interface CacheOptions {
  // Time to live in milliseconds (default: 5 minutes)
  ttl?: number;
  // Maximum number of items to store in the cache (default: 100)
  maxItems?: number;
  // Whether to store the cache in localStorage (default: false)
  persistent?: boolean;
  // Cache namespace for partitioning (default: 'api-cache')
  namespace?: string;
  // Storage type (default: MEMORY)
  storageType?: CacheStorageType;
  // Eviction policy (default: LRU)
  evictionPolicy?: CacheEvictionPolicy;
  // Whether to compress data (default: false)
  compress?: boolean;
  // Whether to enable debug mode (default: false)
  debug?: boolean;
  // Whether to enable stale-while-revalidate (default: false)
  staleWhileRevalidate?: boolean;
  // Time to keep stale data while revalidating (default: 1 minute)
  staleTime?: number;
  // Maximum size in bytes (default: 5MB)
  maxSize?: number;
  // Default priority for entries (default: NORMAL)
  defaultPriority?: CachePriority;
  // Whether to enable offline support (default: false)
  offlineSupport?: boolean;
  // Whether to track dependencies between cached items (default: false)
  trackDependencies?: boolean;
}

/**
 * Cache entry
 */
export interface CacheEntry<T> {
  // The cache key
  key: string;
  // The cached data
  data: T;
  // When the entry was created
  timestamp: number;
  // When the entry expires
  expires: number;
  // The state of the entry
  state: CacheEntryState;
  // The size of the entry in bytes (if tracked)
  size?: number;
  // The priority of the entry
  priority: CachePriority;
  // How many times the entry has been accessed
  accessCount: number;
  // When the entry was last accessed
  lastAccessed: number;
  // Dependencies of this cache entry
  dependencies?: string[];
  // Metadata for the entry
  metadata?: Record<string, any>;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  // Number of cache hits
  hits: number;
  // Number of cache misses
  misses: number;
  // Number of items in the cache
  size: number;
  // Timestamp of the oldest entry
  oldestEntry: number | null;
  // Timestamp of the newest entry
  newestEntry: number | null;
  // Total size in bytes (if tracked)
  totalSize?: number;
  // Hit ratio (hits / (hits + misses))
  hitRatio?: number;
  // Average access time in milliseconds
  averageAccessTime?: number;
  // Number of evictions
  evictions?: number;
  // Number of expirations
  expirations?: number;
}

/**
 * Cache dependency
 */
export interface CacheDependency {
  // The key of the dependent item
  key: string;
  // The keys of the dependencies
  dependencies: string[];
}

/**
 * Cache storage interface
 */
export interface CacheStorage<T> {
  // Get an item from the cache
  get(key: string): Promise<CacheEntry<T> | undefined>;
  // Set an item in the cache
  set(key: string, entry: CacheEntry<T>): Promise<void>;
  // Delete an item from the cache
  delete(key: string): Promise<boolean>;
  // Check if an item exists in the cache
  has(key: string): Promise<boolean>;
  // Clear all items from the cache
  clear(): Promise<void>;
  // Get all keys in the cache
  keys(): Promise<string[]>;
  // Get all entries in the cache
  entries(): Promise<[string, CacheEntry<T>][]>;
  // Get the size of the cache
  size(): Promise<number>;
}

/**
 * Cache event types
 */
export enum CacheEventType {
  HIT = 'hit',
  MISS = 'miss',
  SET = 'set',
  DELETE = 'delete',
  CLEAR = 'clear',
  EXPIRE = 'expire',
  EVICT = 'evict',
  ERROR = 'error'
}

/**
 * Cache event
 */
export interface CacheEvent {
  // The type of event
  type: CacheEventType;
  // The key of the item
  key?: string;
  // The timestamp of the event
  timestamp: number;
  // Additional data for the event
  data?: any;
}

/**
 * Cache event listener
 */
export type CacheEventListener = (event: CacheEvent) => void;
