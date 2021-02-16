// This is the service worker with the Cache-first network

const CACHE_VERSION = "0001"; // increment up one on a major update where cache should be immidiately cleared
const OFFLINE_URL = "/offline"; // the page to show a user when they dont have a connection

const CACHE = "betterMacStoreVersion" + CACHE_VERSION;
const OFFLINE_CACHE = "betterMacStoreOfflineVersion" + CACHE_VERSION;

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', function (event) {
    // We only want to call event.respondWith() if this is a GET request for an HTML document.
    if (event.request.method === 'GET' &&
        event.request.headers.get('accept').indexOf('text/html') !== -1) {
        console.log('Handling fetch event for', event.request.url);
        event.respondWith(
            fetch(event.request).catch(function (e) {
                console.error('Fetch failed; returning offline page instead.', e);
                return caches.open(OFFLINE_CACHE).then(function (cache) {
                    return cache.match(OFFLINE_URL);
                });
            })
        );
    }
});

workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.CacheFirst({
        cacheName: CACHE
    })
);