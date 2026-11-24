// Offline-Cache: Das Spiel funktioniert nach dem ersten Öffnen auch ohne Internet.
const VERSION = '1.2.0'; // Major.Minor.Patch – immer gleich wie VERSION in index.html
const CACHE = 'mahjong-' + VERSION;
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.png', 'icon-512.png'];
// cache:'reload' umgeht den Browser-Zwischenspeicher, damit wirklich die neuen Dateien im Offline-Cache landen
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // Erst Netz (für Updates, 'no-cache' fragt immer beim Server nach), bei Offline den Cache nehmen
  e.respondWith(fetch(e.request.url, { cache: 'no-cache' }).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
