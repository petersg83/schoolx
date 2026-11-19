// Service worker « kill switch ».
// Les anciennes versions de l'application (Create React App 1) enregistraient un
// service worker à cette adresse. Il n'est plus utilisé, mais un navigateur qui
// l'a encore (par exemple une tablette de pointage) continuerait à servir
// l'ancienne application depuis son cache. Ce fichier remplace l'ancien service
// worker : il vide les caches, se désinscrit et recharge les pages ouvertes.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.navigate(client.url));
  })());
});
