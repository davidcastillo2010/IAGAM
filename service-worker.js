const CACHE_NAME = "iagam-v3";

self.addEventListener("install", event => {
 event.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.add("./"))
 );
 self.skipWaiting();
});

self.addEventListener("activate", event => {
 event.waitUntil(
  caches.keys().then(keys =>
   Promise.all(
    keys.map(key =>
     key === CACHE_NAME ? Promise.resolve() : caches.delete(key)
    )
   )
  )
 );
 self.clients.claim();
});

self.addEventListener("fetch", event => {
 if(event.request.method !== "GET") return;

 const url = new URL(event.request.url);

 if(url.origin !== self.location.origin) return;

 event.respondWith(
  fetch(event.request, {cache:"no-store"})
   .then(response => {
    if(response.ok){
     const copy = response.clone();
     caches.open(CACHE_NAME).then(cache =>
      cache.put(event.request,copy)
     );
    }
    return response;
   })
   .catch(() => caches.match(event.request))
 );
});
