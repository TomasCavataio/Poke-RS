caches
    .open("poke-cache")
    .then((cache) => {
        return cache.addAll([
            "./",
            "./index.html",
            "./assets/js/app.js",
            "./assets/css/style.css",
            "./assets/css/reset.css",
        ]);
    })
    .catch(console.warn);

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response !== undefined) {
                return response;
            } else {
                return fetch(event.request)
                    .then((response) => {
                        const responseClone = response.clone();
                        caches.open("poke-cache").then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    })
                    .catch(() => {
                        return caches.match(event.request);
                    });
            }
        })
    );
});