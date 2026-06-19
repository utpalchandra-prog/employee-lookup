var CACHE = 'emp-lookup-v1';
var ASSETS = [
  '/employee-lookup/',
  '/employee-lookup/index.html',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(resp){
        var r = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, r); });
        return resp;
      });
    }).catch(function(){
      return caches.match('/employee-lookup/index.html');
    })
  );
});
