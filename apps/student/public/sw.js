self.addEventListener("install", e => {
  e.waitUntil(caches.open("student-app-v1").then(c => c.addAll(["/", "/lessons/ratio", "/lessons/journey", "/lessons/number-line"])))}
)
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})