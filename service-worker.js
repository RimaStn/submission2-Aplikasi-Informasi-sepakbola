importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
    console.log(`Workbox berhasil dimuat`);

    workbox.precaching.precacheAndRoute(
        [
            { url: '/index.html', revision: '1' },
            { url: '/nav.html', revision: '1' },
            { url: '/team.html', revision: '1' },
            { url: '/pages/home.html', revision: '1' },
            { url: '/pages/klasemen.html', revision: '2' },
            { url: '/pages/jadwal.html', revision: '1' },
            { url: '/pages/favorit.html', revision: '1' },
            { url: '/css/materialize.min.css', revision: '1' },
            { url: '/css/main.css', revision: '1'},
            { url: '/js/materialize.min.js', revision: '1' },
            { url: '/js/api.js', revision: '2' },
            { url: '/js/db.js', revision: '1' },
            { url: '/js/nav.js', revision: '1' },
            { url: '/js/idb.js', revision: '1' },
            { url: '/js/teams.js', revision: '1' },
            { url: '/js/script.js', revision: '1' },
            { url: '/push.js', revision: '1' },
            { url: '/assets/icons/maskable_icon128.png', revision: '1' },
            { url: '/assets/icons/maskable_icon144.png', revision: '1' },
            { url: '/assets/icons/maskable_icon192.png', revision: '1' },
            { url: '/assets/icons/maskable_icon384.png', revision: '1' },
            { url: '/assets/icons/maskable_icon512.png', revision: '1' },
            { url: '/assets/icons/icon72.png', revision: '1' },
            { url: '/assets/img/headerhome3.jpeg', revision: '1' },
            { url: '/manifest.json', revision: '1' },
            {  
              url: 
                "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
              revision: '1' },
            {
              url:
                "https://fonts.googleapis.com/icon?family=Material+Icons",
              revision: '1'
            },
        ],  {
                ignoreUrlParametersMatching: [/.*/]
            }
    );

    workbox.routing.registerRoute(
        ({ url }) => url.origin === "https://api.football-data.org",
        workbox.strategies.staleWhileRevalidate({
            cacheName: "league",
            plugins: [
                new workbox.expiration.Plugin({
                     maxAgeSeconds: 60 * 30
                })
            ]
        })
    )

    workbox.routing.registerRoute(
        new RegExp('/assets/icons/'),
            workbox.strategies.staleWhileRevalidate ({
                cacheName: 'assets-cache'
            })
    );

    // Menyimpan cache dari CSS Google Fonts
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );

    // Menyimpan cache untuk file font selama 1 tahun
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        workbox.strategies.cacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        /.*(?:png|gif|jpg|jpeg|svg)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200]
                }),
                new workbox.expiration.Plugin({
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ]
        })
    );

} else {
    console.log(`Workbox gagal dimuat`);
}

     
self.addEventListener('push', function(event) {
    let body;
        if (event.data) {
            body = event.data.text();
        } else {
             body = 'Push message no payload';
        }
    let options = {
        body: body,
        icon: '/assets/icons/icon72.png',
        badge: '/assets/icons/icon72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});