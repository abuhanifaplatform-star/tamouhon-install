const cachePrefix = 'tamouhon-install-';
const cacheName = cachePrefix + 'v1';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll([
    './', './manifest.webmanifest', './icons/icon-192.png',
    './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'
  ])));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(cachePrefix) && key !== cacheName)
    .map(key => caches.delete(key)))));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
