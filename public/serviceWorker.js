// Service Worker for Genius Online Navigator
// Provides offline support and performance optimizations through caching

const CACHE_NAME = 'genius-navigator-cache-v1';
const STATIC_CACHE_NAME = 'genius-navigator-static-v1';
const API_CACHE_NAME = 'genius-navigator-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/static/media/logo.svg',
  '/manifest.json',
  '/favicon.ico'
];

// API routes that should be cached
const API_ROUTES = [
  '/api/v1/config',
  '/api/v1/features',
  '/api/v1/user/preferences'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache API routes
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Pre-caching API routes');
        return Promise.all(
          API_ROUTES.map(route => {
            const url = new URL(route, self.location.origin);
            return fetch(url, { credentials: 'same-origin' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                return Promise.resolve();
              })
              .catch(() => Promise.resolve()); // Ignore failures during pre-caching
          })
        );
      })
    ])
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match our current version
          if (
            cacheName !== STATIC_CACHE_NAME && 
            cacheName !== API_CACHE_NAME && 
            cacheName !== CACHE_NAME
          ) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated and claiming clients');
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request is for an API
const isApiRequest = (request) => {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (request) => {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/static/') || 
    STATIC_ASSETS.includes(url.pathname)
  );
};

// Helper function to determine if we should cache this response
const shouldCacheResponse = (response) => {
  // Only cache successful responses
  return response.ok && response.status < 400;
};

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests - Cache with network update strategy
  if (isApiRequest(request)) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((networkResponse) => {
            // Cache the updated response for future use
            if (shouldCacheResponse(networkResponse)) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // If network fails, try to return from cache
            return cache.match(request);
          });
      })
    );
    return;
  }
  
  // Handle static assets - Cache first, network fallback
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response immediately
            // Refresh cache in the background
            fetch(request)
              .then((networkResponse) => {
                if (shouldCacheResponse(networkResponse)) {
                  cache.put(request, networkResponse);
                }
              })
              .catch(() => {
                // Ignore network errors when refreshing cache
              });
            
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(request).then((networkResponse) => {
            if (shouldCacheResponse(networkResponse)) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  
  // Default strategy for other requests - Network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses
        if (shouldCacheResponse(networkResponse)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails, try to return from cache
        return caches.match(request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[Service Worker] Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'INVALIDATE_API_CACHE') {
    const pattern = event.data.pattern;
    if (!pattern) return;
    
    event.waitUntil(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.keys().then((requests) => {
          return Promise.all(
            requests
              .filter(request => {
                const url = new URL(request.url);
                return url.pathname.includes(pattern);
              })
              .map(request => {
                console.log('[Service Worker] Invalidating cache for:', request.url);
                return cache.delete(request);
              })
          );
        });
      })
    );
  }
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-feedback') {
    event.waitUntil(syncFeedback());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

// Helper function to sync feedback data
async function syncFeedback() {
  try {
    const db = await openDB();
    const pendingFeedback = await db.getAll('pendingFeedback');
    
    for (const feedback of pendingFeedback) {
      try {
        const response = await fetch('/api/v1/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedback.data)
        });
        
        if (response.ok) {
          await db.delete('pendingFeedback', feedback.id);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync feedback:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error in syncFeedback:', error);
  }
}

// Helper function to sync analytics data
async function syncAnalytics() {
  try {
    const db = await openDB();
    const pendingAnalytics = await db.getAll('pendingAnalytics');
    
    for (const analytics of pendingAnalytics) {
      try {
        const response = await fetch('/api/v1/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(analytics.data)
        });
        
        if (response.ok) {
          await db.delete('pendingAnalytics', analytics.id);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync analytics:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error in syncAnalytics:', error);
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GeniusNavigatorOfflineDB', 1);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingFeedback')) {
        db.createObjectStore('pendingFeedback', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pendingAnalytics')) {
        db.createObjectStore('pendingAnalytics', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
