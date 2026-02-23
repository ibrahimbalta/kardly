const CACHE_NAME = 'kardly-v1';
const OFFLINE_URL = '/offline.html';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install event - pre-cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching core assets');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first, cache fallback strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;

    // API requests - network only (don't cache dynamic data)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(
                    JSON.stringify({ error: 'Çevrimdışısınız. Lütfen internet bağlantınızı kontrol edin.' }),
                    { headers: { 'Content-Type': 'application/json' }, status: 503 }
                );
            })
        );
        return;
    }

    // Profile pages - network first, cache fallback
    if (url.pathname.match(/^\/[a-zA-Z0-9_-]+$/) && !url.pathname.startsWith('/_next')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache the latest version
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Try cache, then offline page
                    return caches.match(request).then((cached) => {
                        return cached || caches.match(OFFLINE_URL);
                    });
                })
        );
        return;
    }

    // Static assets (JS, CSS, images) - Stale while revalidate
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/icons/') ||
        url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf)$/)
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request)
                    .then((response) => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                        return response;
                    })
                    .catch(() => cached);

                return cached || fetchPromise;
            })
        );
        return;
    }

    // Default - network first
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Only cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).then((cached) => {
                    return cached || caches.match(OFFLINE_URL);
                });
            })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    let data = { title: 'Kardly', body: 'Yeni bir bildiriminiz var!' };

    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        if (event.data) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now(),
        },
        actions: data.actions || [
            { action: 'open', title: '📱 Aç' },
            { action: 'close', title: '❌ Kapat' },
        ],
        tag: data.tag || 'kardly-notification',
        renotify: true,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If there's already a window open, focus it
            for (const client of clientList) {
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-reviews') {
        event.waitUntil(syncReviews());
    }
    if (event.tag === 'sync-contacts') {
        event.waitUntil(syncContacts());
    }
});

async function syncReviews() {
    // Sync pending reviews when back online
    try {
        const cache = await caches.open('kardly-pending');
        const requests = await cache.keys();
        for (const request of requests) {
            if (request.url.includes('/api/review')) {
                const response = await cache.match(request);
                if (response) {
                    const body = await response.json();
                    await fetch(request, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });
                    await cache.delete(request);
                }
            }
        }
    } catch (e) {
        console.error('[SW] Sync reviews failed:', e);
    }
}

async function syncContacts() {
    try {
        const cache = await caches.open('kardly-pending');
        const requests = await cache.keys();
        for (const request of requests) {
            if (request.url.includes('/api/leads')) {
                const response = await cache.match(request);
                if (response) {
                    const body = await response.json();
                    await fetch(request, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });
                    await cache.delete(request);
                }
            }
        }
    } catch (e) {
        console.error('[SW] Sync contacts failed:', e);
    }
}
