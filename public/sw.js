/* global self */
const STATIC_CACHE = "daily-dare-static-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll([
    "/",
    "/manifest.webmanifest",
    "/icons/dare-192.png",
    "/icons/dare-512.png",
  ])));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((response) => response ?? caches.match("/"))));
});
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data?.json() ?? {}; } catch { /* Fall back to a generic visible alert. */ }
  const expired = data.deadline && Date.parse(data.deadline) <= Date.now();
  event.waitUntil(self.registration.showNotification(expired ? "A new day on Daily Dare" : (data.title || "Your Daily Dare is ready"), {
    body: expired ? "Open the app to see your latest dare." : (data.body || "Post before midnight to keep your streak."),
    tag: data.tag || "daily-dare", icon: "/icons/dare-192.png", badge: "/icons/dare-192.png",
    data: { url: "/" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
    for (const client of windows) {
      if (new URL(client.url).origin === self.location.origin) {
        await client.navigate("/");
        return client.focus();
      }
    }
    return self.clients.openWindow("/");
  }));
});
