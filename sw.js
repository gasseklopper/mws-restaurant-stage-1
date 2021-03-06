const cacheName = 'v2'

// Call Install Event
self.addEventListener('install', (event) => {
  console.log(`--> Service Worker: Installed ${event}`)
})

// call activate Event
self.addEventListener('activate', (event) => {
  console.log(`--> Service Worker: acitivated ${event}`)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
           if (cache !== cacheName) {
             console.log(`--> Service Worker: Clearing Old Cache `)
             return caches.delete(cache)
           }
        })
      )
    })
  )
})

// Call Fetch Event
self.addEventListener('fetch', event => {
  console.log(`--> Service Worker: Fetching`)
  event.respondWith(
    fetch(event.request)
    .then(response => {
      // Make copy clone of response
      const resClone = response.clone()
      // Open Cache
      caches
        .open(cacheName)
        .then(cache => {
          // Add response to cache
          cache.put(event.request, resClone)
        })
      return response
    })
    .catch(error => caches.match(event.request).then(response => response))
  )
})
