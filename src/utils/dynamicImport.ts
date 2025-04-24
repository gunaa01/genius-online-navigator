import React, { ComponentType, lazy } from 'react';

/**
 * Options for dynamic imports
 */
interface DynamicImportOptions {
  /**
   * Minimum delay in milliseconds before showing the component
   * Useful to prevent loading flashes for fast networks
   * @default 0
   */
  minimumDelay?: number;
  
  /**
   * Whether to prefetch the component
   * @default false
   */
  prefetch?: boolean;
  
  /**
   * Custom loading component to show while the component is loading
   */
  loadingComponent?: React.ReactNode;
  
  /**
   * Custom error component to show if the component fails to load
   */
  errorComponent?: React.ReactNode;
  
  /**
   * Retry options for failed imports
   */
  retry?: {
    /**
     * Number of retries
     * @default 3
     */
    count?: number;
    
    /**
     * Delay between retries in milliseconds
     * @default 1000
     */
    delay?: number;
  };
}

/**
 * Dynamically imports a component with enhanced options
 * @param importFn - Function that returns a promise from a dynamic import
 * @param options - Options for the dynamic import
 * @returns A lazy-loaded component
 */
export function dynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): React.LazyExoticComponent<T> {
  const {
    minimumDelay = 0,
    prefetch = false,
    retry = { count: 3, delay: 1000 },
  } = options;
  
  // Handle prefetching
  if (prefetch) {
    // Use requestIdleCallback if available, otherwise use setTimeout
    const requestIdleCallback = 
      window.requestIdleCallback || 
      ((cb) => setTimeout(cb, 1));
    
    requestIdleCallback(() => {
      importFn().catch(() => {
        // Silently catch prefetch errors
      });
    });
  }
  
  // Create enhanced import function with retry and minimum delay
  const enhancedImport = () => {
    // Function to handle retries
    const importWithRetry = (
      retriesLeft: number,
      retryDelay: number
    ): Promise<{ default: T }> => {
      return importFn().catch((error) => {
        // If we have retries left, wait and try again
        if (retriesLeft > 0) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(importWithRetry(retriesLeft - 1, retryDelay));
            }, retryDelay);
          });
        }
        // Otherwise, throw the error
        throw error;
      });
    };
    
    // Apply minimum delay if specified
    if (minimumDelay > 0) {
      return Promise.all([
        importWithRetry(retry.count || 3, retry.delay || 1000),
        new Promise((resolve) => setTimeout(resolve, minimumDelay)),
      ]).then(([moduleExport]) => moduleExport);
    }
    
    return importWithRetry(retry.count || 3, retry.delay || 1000);
  };
  
  return lazy(enhancedImport);
}

/**
 * Preloads a component by triggering its import
 * @param importFn - Function that returns a promise from a dynamic import
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): void {
  importFn().catch(() => {
    // Silently catch preload errors
  });
}

/**
 * Creates a component that will be loaded when it enters the viewport
 * @param importFn - Function that returns a promise from a dynamic import
 * @param options - Options for the dynamic import
 * @returns A lazy-loaded component that loads when visible
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
) {
  const LazyComponent = dynamicImport(importFn, options);
  
  // Add preload method to the component
  (LazyComponent as any).preload = () => preloadComponent(importFn);
  
  return LazyComponent;
}
