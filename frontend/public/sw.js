// public/sw.js

const CACHE_VERSION = 'v-1.1.6'; // Har nayi release par badlo
// Increment version with every deployment

const CACHE_NAME = `msk-institute-${CACHE_VERSION}`;

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

// Install event: cache assets
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
     .then(() => {
       return self.clients.matchAll({ type: 'window' }).then(clients => {
         clients.forEach(client => {
           client.postMessage({ type: 'NEW_VERSION' });
         });
       });
     })
  );
});



// Fetch event: serve from cache, fallback to network, then to offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          // Check for valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          // Clone and store in cache
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // Serve offline fallback for HTML pages
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// Listen for skipWaiting message from client (optional)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
