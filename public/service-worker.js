const CACHE_NAME = 'offline-cache-v9'
const OFFLINE_URL = '/offline'
const CACHED_URLS = [OFFLINE_URL, '/style.css', '/main.js', '/manifest.webmanifest', '/icon-192x192.png', '/icon-256x256.png', '/icon-384x384.png', '/icon-512x512.png']

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("[Service Worker] Pre-caching offline assets")
                return cache.addAll(CACHED_URLS)
            })
            .then(() => self.skipWaiting())
    )
})

self.addEventListener("activate", (e) => {
    console.log("[Service Worker] Activated successfully")
    e.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[Service Worker] Removing old cache", key)
                        return caches.delete(key)
                    }
                }))
            }))
})

self.addEventListener("fetch", (e) => {
    console.log("[Service Worker] Fetching...")

    e.respondWith(
        caches.match(e.request)
            .then(cachedResponse => {

                if (cachedResponse) return cachedResponse

                return fetch(e.request)
                    .then(response => {
                        // If the request is not a GET request,
                        // OR if the request does not start with 'http'
                        // don't cache the response
                        if (e.request.method !== 'GET' || e.request.url.indexOf('http') !== 0) return response

                        // Clone the response, so we can asynchronously store it and return it
                        const clone = response.clone()

                        // Cache the response
                        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone))
                        // Return the response
                        return response
                    })
                    .catch(() => {
                        console.log('[Service Worker] Fetch failed; returning offline page instead.')
                        // If the request fails, return the offline page
                        if (e.request.mode === 'navigate') {
                            return caches.open(CACHE_NAME)
                                .then(cache => cache.match(OFFLINE_URL))
                        }
                    })
            })
    )
})

