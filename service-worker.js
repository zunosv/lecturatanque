// ============================================================
// service-worker.js — Medición de Tanques v2
// Estrategia: Cache-First para todo (100% offline)
// ============================================================

const CACHE = 'tanques-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Fuentes Google (se cachean en primera carga)
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap'
];

// ── Instalación ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log('[SW] Pre-cacheando assets...');
      // Cachear assets locales (críticos)
      return cache.addAll(['./', './index.html', './manifest.json'])
        .then(() => {
          // Intentar cachear fuentes (sin fallar si no hay red)
          return fetch('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap')
            .then(res => cache.put('fonts-css', res))
            .catch(() => console.log('[SW] Fuentes no disponibles (sin red)'));
        });
    })
  );
  self.skipWaiting();
});

// ── Activación: limpiar cachés viejas ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('[SW] Borrando caché antigua:', k);
          return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Cache-First → Network → Fallback ─────────────────
self.addEventListener('fetch', event => {
  // Solo manejar GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // No está en cache → intentar red y guardar
      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200) return response;

          // Clonar y guardar en caché
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Sin red y sin caché: devolver index.html para navegación
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          // Para fuentes: devolver respuesta vacía (app sigue funcionando)
          return new Response('', { status: 408 });
        });
    })
  );
});
