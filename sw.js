// Service Worker for Portfolio Website
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Network failed, try to serve from cache
                    return caches.match('/index.html');
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(
            syncFormData()
        );
    }
});

// Handle form data sync
async function syncFormData() {
    try {
        // Get stored form data from IndexedDB
        const formData = await getStoredFormData();
        
        if (formData) {
            // Try to send the form data
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Successfully sent, remove from storage
                await removeStoredFormData();
                
                // Notify the client
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({
                            type: 'FORM_SYNC_SUCCESS',
                            message: 'Your message has been sent successfully!'
                        });
                    });
                });
            }
        }
    } catch (error) {
        console.error('Form sync failed:', error);
    }
}

// Helper functions for IndexedDB operations
async function getStoredFormData() {
    return new Promise((resolve) => {
        const request = indexedDB.open('portfolio-db', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['formData'], 'readonly');
            const store = transaction.objectStore('formData');
            const getRequest = store.get('pending');
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };
        };
        
        request.onerror = () => {
            resolve(null);
        };
    });
}

async function removeStoredFormData() {
    return new Promise((resolve) => {
        const request = indexedDB.open('portfolio-db', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['formData'], 'readwrite');
            const store = transaction.objectStore('formData');
            const deleteRequest = store.delete('pending');
            
            deleteRequest.onsuccess = () => {
                resolve();
            };
        };
        
        request.onerror = () => {
            resolve();
        };
    });
}

// Push notification handling (for future features)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
    };

    event.waitUntil(
        self.registration.showNotification('Portfolio Update', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});