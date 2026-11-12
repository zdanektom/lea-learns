/* Lea Learns service worker: offline-first. VERSION and ASSETS are filled in by build.mjs. */
const VERSION = 'lea-learns-1.0.0-fee7761e';
const ASSETS = [
 "./",
 "./app.js",
 "./assets/character/dog-chase.png",
 "./assets/character/dog-front.png",
 "./assets/character/dog-grin.png",
 "./assets/character/dog-jump.png",
 "./assets/character/dog-party.png",
 "./assets/character/dog-roll.png",
 "./assets/character/dog-sit.png",
 "./assets/character/ines-cheer.png",
 "./assets/character/ines-front.png",
 "./assets/character/ines-jump.png",
 "./assets/character/ines-point.png",
 "./assets/character/ines-sit.png",
 "./assets/character/ines-think.png",
 "./assets/character/ines-wave.png",
 "./assets/character/lea-cheer.png",
 "./assets/character/lea-front.png",
 "./assets/character/lea-jump.png",
 "./assets/character/lea-point.png",
 "./assets/character/lea-sit.png",
 "./assets/character/lea-think.png",
 "./assets/character/lea-wave.png",
 "./assets/fonts/fredoka.woff2",
 "./assets/fonts/nunito-cyrillic.woff2",
 "./assets/world/home-landscape.jpg",
 "./assets/world/home-portrait.jpg",
 "./icons/apple-touch-icon.png",
 "./icons/favicon-32.png",
 "./icons/favicon-48.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/maskable-192.png",
 "./icons/maskable-512.png",
 "./index.html",
 "./manifest.webmanifest",
 "./styles.css"
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('lea-learns-') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const key = req.mode === 'navigate' ? './index.html' : req;
    const cached = await cache.match(key, { ignoreSearch: true });
    const network = fetch(req).then((res) => { if (res && res.ok && res.type === 'basic') cache.put(key, res.clone()); return res; }).catch(() => cached);
    return cached || network;
  }));
});
