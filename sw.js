const CACHE = 'mizbery-static-v8';
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/config.js",
  "./manifest.webmanifest",
  "./assets/mizbery-apple.png",
  "./assets/social-preview.jpg",
  "./assets/mizbery-trio-cutout.webp",
  "./assets/mizbery-hero.webp",
  "./assets/mizbery-logo-theme-light.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/icon-192.png",
  "./assets/mizbery-packed-cutout.webp",
  "./assets/mizbery-bottle-cutout.webp",
  "./assets/mizbery-logo-theme-dark.png"
];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));});
self.addEventListener('activate',event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;event.respondWith(fetch(req).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return resp;}).catch(()=>caches.match(req).then(cached=>cached||caches.match('./index.html'))));});
