import { CacheEntry, CacheStorage } from './cacheTypes';

/**
 * IndexedDB cache storage implementation
 * 
 * This adapter uses IndexedDB for persistent cache storage of larger datasets.
 * IndexedDB can store much more data than localStorage (typically 50-100MB or more)
 * and supports storing complex objects without serialization.
 */
export class IndexedDBAdapter<T> implements CacheStorage<T> {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryCache: Map<string, CacheEntry<T>> = new Map();
  private ready: boolean = false;

  /**
   * Create a new IndexedDBAdapter
   * 
   * @param dbName The name of the IndexedDB database
   * @param storeName The name of the object store
   */
  constructor(dbName: string = 'advanced-cache-db', storeName: string = 'cache-store') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.initDatabase();
  }

  /**
   * Initialize the IndexedDB database
   */
  private initDatabase(): void {
    if (!window.indexedDB) {
      console.error('IndexedDB is not supported in this browser');
      return;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.ready = true;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });

    // Preload cache entries into memory for faster access
    this.preloadCache();
  }

  /**
   * Preload cache entries into memory
   */
  private async preloadCache(): Promise<void> {
    try {
      // Wait for database to be ready
      await this.dbPromise;
      
      // Get all entries
      const entries = await this.entries();
      
      // Store in memory cache
      for (const [key, entry] of entries) {
        this.memoryCache.set(key, entry);
      }
    } catch (error) {
      console.error('Error preloading cache from IndexedDB:', error);
    }
  }

  /**
   * Get the database instance
   * 
   * @returns The IndexedDB database instance
   */
  private async getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.initDatabase();
    }
    
    if (!this.dbPromise) {
      throw new Error('IndexedDB is not supported');
    }
    
    return this.dbPromise;
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

    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        
        request.onsuccess = () => {
          const entry = request.result as CacheEntry<T> | undefined;
          
          if (entry) {
            // Update memory cache
            this.memoryCache.set(key, entry);
          }
          
          resolve(entry);
        };
        
        request.onerror = () => {
          reject(new Error(`Failed to get item ${key} from IndexedDB`));
        };
      });
    } catch (error) {
      console.error(`Error getting item ${key} from IndexedDB:`, error);
      return undefined;
    }
  }

  /**
   * Set an item in the cache
   * 
   * @param key The cache key
   * @param entry The cache entry
   */
  async set(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        // Make sure the key is set in the entry
        const entryWithKey = { ...entry, key };
        const request = store.put(entryWithKey);
        
        request.onsuccess = () => {
          // Update memory cache
          this.memoryCache.set(key, entry);
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error(`Failed to set item ${key} in IndexedDB`));
        };
      });
    } catch (error) {
      console.error(`Error setting item ${key} in IndexedDB:`, error);
      
      // Still update memory cache
      this.memoryCache.set(key, entry);
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
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => {
          // Update memory cache
          this.memoryCache.delete(key);
          resolve(true);
        };
        
        request.onerror = () => {
          reject(new Error(`Failed to delete item ${key} from IndexedDB`));
        };
      });
    } catch (error) {
      console.error(`Error deleting item ${key} from IndexedDB:`, error);
      
      // Still update memory cache
      this.memoryCache.delete(key);
      return false;
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

    try {
      const entry = await this.get(key);
      return entry !== undefined;
    } catch (error) {
      console.error(`Error checking if item ${key} exists in IndexedDB:`, error);
      return false;
    }
  }

  /**
   * Clear all items from the cache
   */
  async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          // Clear memory cache
          this.memoryCache.clear();
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error('Failed to clear IndexedDB store'));
        };
      });
    } catch (error) {
      console.error('Error clearing IndexedDB cache:', error);
      
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
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();
        
        request.onsuccess = () => {
          resolve(request.result as string[]);
        };
        
        request.onerror = () => {
          reject(new Error('Failed to get keys from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('Error getting keys from IndexedDB:', error);
      
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
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const entries = request.result as CacheEntry<T>[];
          resolve(entries.map(entry => [entry.key, entry]));
        };
        
        request.onerror = () => {
          reject(new Error('Failed to get entries from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('Error getting entries from IndexedDB:', error);
      
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
      console.error('Error getting size from IndexedDB:', error);
      
      // Fall back to memory cache
      return this.memoryCache.size;
    }
  }
}
