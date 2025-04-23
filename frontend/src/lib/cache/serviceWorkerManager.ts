/**
 * Service Worker Manager
 * 
 * This module provides utilities for registering and interacting with the service worker
 * for offline support and advanced caching capabilities.
 */

// Service worker registration options
export interface ServiceWorkerOptions {
  scope?: string;
  updateViaCache?: ServiceWorkerUpdateViaCache;
  immediate?: boolean;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

// Default options
const DEFAULT_OPTIONS: ServiceWorkerOptions = {
  scope: '/',
  updateViaCache: 'none',
  immediate: true
};

/**
 * Service Worker Manager
 * 
 * Provides methods for registering and interacting with the service worker
 */
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private options: ServiceWorkerOptions;

  /**
   * Create a new ServiceWorkerManager
   * 
   * @param options Service worker options
   */
  constructor(options: ServiceWorkerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Check if service workers are supported in the current browser
   * 
   * @returns True if service workers are supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Register the service worker
   * 
   * @param scriptUrl The URL of the service worker script
   * @param options Registration options
   * @returns A promise that resolves with the service worker registration
   */
  async register(
    scriptUrl: string = '/serviceWorker.js',
    options: ServiceWorkerOptions = {}
  ): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) {
      console.warn('Service workers are not supported in this browser');
      return null;
    }

    try {
      const mergedOptions = { ...this.options, ...options };
      
      // Register the service worker
      this.registration = await navigator.serviceWorker.register(scriptUrl, {
        scope: mergedOptions.scope,
        updateViaCache: mergedOptions.updateViaCache
      });

      console.log('Service worker registered successfully:', this.registration);

      // Check for updates
      if (mergedOptions.immediate) {
        this.checkForUpdates();
      }

      // Call success callback
      if (mergedOptions.onSuccess) {
        mergedOptions.onSuccess(this.registration);
      }

      // Add update listener
      this.registration.onupdatefound = () => {
        const installingWorker = this.registration.installing;
        
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New service worker available
                console.log('New service worker available');
                
                // Call update callback
                if (mergedOptions.onUpdate && this.registration) {
                  mergedOptions.onUpdate(this.registration);
                }
              } else {
                // Service worker installed for the first time
                console.log('Service worker installed for the first time');
              }
            }
          };
        }
      };

      return this.registration;
    } catch (error) {
      console.error('Error registering service worker:', error);
      
      // Call error callback
      if (options.onError) {
        options.onError(error as Error);
      }
      
      return null;
    }
  }

  /**
   * Unregister the service worker
   * 
   * @returns A promise that resolves with true if unregistration was successful
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      console.warn('No service worker registration to unregister');
      return false;
    }

    try {
      const success = await this.registration.unregister();
      
      if (success) {
        console.log('Service worker unregistered successfully');
        this.registration = null;
      } else {
        console.warn('Service worker unregistration failed');
      }
      
      return success;
    } catch (error) {
      console.error('Error unregistering service worker:', error);
      return false;
    }
  }

  /**
   * Check for service worker updates
   * 
   * @returns A promise that resolves with true if an update was found
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) {
      console.warn('No service worker registration to check for updates');
      return false;
    }

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Error checking for service worker updates:', error);
      return false;
    }
  }

  /**
   * Skip waiting and activate the new service worker
   * 
   * @returns A promise that resolves when the message is sent
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      console.warn('No waiting service worker to skip waiting');
      return;
    }

    // Send skip waiting message to the waiting service worker
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Clear all caches managed by the service worker
   * 
   * @returns A promise that resolves when the message is sent
   */
  async clearCaches(): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registration to clear caches');
      return;
    }

    // Send clear caches message to the active service worker
    if (this.registration.active) {
      this.registration.active.postMessage({ type: 'CLEAR_CACHES' });
    }
  }

  /**
   * Invalidate API cache entries matching a pattern
   * 
   * @param pattern The pattern to match
   * @returns A promise that resolves when the message is sent
   */
  async invalidateApiCache(pattern: string): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registration to invalidate cache');
      return;
    }

    // Send invalidate cache message to the active service worker
    if (this.registration.active) {
      this.registration.active.postMessage({ 
        type: 'INVALIDATE_API_CACHE',
        pattern
      });
    }
  }

  /**
   * Get the current service worker registration
   * 
   * @returns The service worker registration or null if not registered
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Create and export a singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Export the class for testing or custom instances
export default ServiceWorkerManager;
