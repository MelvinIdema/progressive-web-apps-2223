const CACHE_NAME = 'offline-cache'
const OFFLINE_URL = '/offline'
const CACHED_URLS = [OFFLINE_URL, '/style.css', '/main.js', '/manifest.webmanifest', '/icon-192x192.png', '/icon-256x256.png', '/icon-384x384.png', '/icon-512x512.png']

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("[Service Worker] Pre-caching offline page")
                return cache.addAll(CACHED_URLS)
            })
    )
})

self.addEventListener("activate", (e) => {
    console.log("[Service Worker] Activated successfully")
})

self.addEventListener("fetch", (e) => {
    console.log("[Service Worker] Fetching...")
    e.respondWith(
        caches.match(e.request)
            .then(cachedResponse => {

                if (cachedResponse) return cachedResponse

                return fetch(e.request)
                    .then(response => {
                        // If the request is not a GET request, don't cache the response
                        if (e.request.method !== 'GET') return response

                        // Cache the response
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(e.request, response.clone())
                                return response
                            })
                    })
                    .catch(() => {
                        // If the request fails, return the offline page
                        // if (e.request.mode === 'navigate') {
                        //     return caches.open(CACHE_NAME)
                        //         .then(cache => cache.match(OFFLINE_URL))
                        // }
                    })
            })
    )
})