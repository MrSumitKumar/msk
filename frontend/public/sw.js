// public/sw.js

const CACHE_NAME = 'msk-institute-v1';
const urlsToCache = [
  '/',
  '/courses',
  '/about',
  '/contact',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event: cache defined assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate immediately after install
});

// Activate event: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim clients immediately
});

// Fetch event: serve from cache, then fallback to network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        // Only cache valid responses
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }

        // Cache new response
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback to offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
