const CACHE_NAME = 'careerforge-v2';
const ASSETS = [
  '/manifest.json'
];

// Install event - caching static assets safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[sw] Failed to precache ${url}:`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for everything dynamic, cache fallback for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests and requests from our own origin
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Skip Clerk auth routes, API routes, and Next.js internal chunks from SW caching
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('sign-in') ||
    url.pathname.includes('sign-up') ||
    url.pathname.includes('__clerk')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});