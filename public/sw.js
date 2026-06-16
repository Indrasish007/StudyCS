const CACHE_NAME = "auranotes-cache-v1";
const OFFLINE_URLS = [
  "/",
  "/dashboard",
  "/assistant",
  "/revision",
  "/knowledge-graph",
  "/handwritten-notes",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // We only cache GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Network-first for api requests, cache-first for static files
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch in background to update cache
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            })
            .catch(() => {
              // Ignore network failures for background updates
            });
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, copy);
              });
            }
            return response;
          })
          .catch(() => {
            // If fetching a page/navigation request, return home or error page
            if (event.request.mode === "navigate") {
              return caches.match("/");
            }
          });
      })
    );
  }
});
