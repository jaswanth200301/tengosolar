// Tengo Solar — Service Worker
// Caches the app shell for offline use

const CACHE_NAME    = 'tengo-solar-v1';
const OFFLINE_URL   = '/';
const CACHE_ASSETS  = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
];

// Install — cache app shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(CACHE_ASSETS).catch(err => {
                console.log('Cache addAll partial failure (ok for dev):', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
    // Skip non-GET and cross-origin requests
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    // Skip API calls (Supabase, Daily.co, etc.)
    const url = new URL(event.request.url);
    if (url.hostname !== self.location.hostname) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses for main HTML
                if (response.ok && event.request.mode === 'navigate') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // Offline fallback
                return caches.match(event.request)
                    .then(cached => cached || caches.match(OFFLINE_URL));
            })
    );
});

// Push notifications (for future use with Daily.co webhooks)
self.addEventListener('push', event => {
    const data = event.data?.json() || {};
    const title   = data.title   || '☀️ Tengo Solar';
    const options = {
        body:    data.body    || 'You have a new notification',
        icon:    '/icon-192.png',
        badge:   '/icon-192.png',
        tag:     data.tag     || 'tengo-notification',
        data:    data,
        actions: data.actions || [],
        requireInteraction: data.requireInteraction || false,
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type:'window', includeUncontrolled:true })
            .then(clientList => {
                const existing = clientList.find(c => c.url === url && 'focus' in c);
                if (existing) return existing.focus();
                if (clients.openWindow) return clients.openWindow(url);
            })
    );
});
