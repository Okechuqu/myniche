const CACHE_NAME = "reelsdraft-shell-v2";
const OFFLINE_URL = "/offline";
const APP_SHELL = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/favicon/icon0.svg",
  "/icons/favicon/icon1.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.mode !== "navigate" || request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return cache.match(OFFLINE_URL);
    }),
  );
});
