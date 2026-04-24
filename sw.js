const CACHE_NAME = 'gym-plan-v3';
const FILES_TO_CACHE = [
  './Weekly_Workout_Plan.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(evt.request).then((response) =>
        response || fetch(evt.request).then((networkResponse) => {
          cache.put(evt.request, networkResponse.clone());
          return networkResponse;
        })
      )
    )
  );
});
