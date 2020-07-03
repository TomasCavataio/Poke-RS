
caches.open('poke-cache')
    .then((cache) => {
        return cache.addAll(
            ['./',
                './index.html',
                './assets/js/app.js',
                './assets/css/style.css',
                './assets/css/reset.css']
        )
    });


self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .then(async response => {
                console.log(event.request);
                if (event.request.method === 'GET') {
                    caches.open('poke-cache').then(cache => cache.add(event.request)).catch(console.warn);
                }
                if (!response) throw response
                return response;
            })
            .catch(() => caches.match(event.request)),
    );
});