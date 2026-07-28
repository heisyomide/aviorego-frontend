// workers/index.ts

// Declare worker global scope safely for TypeScript
const _self = self as unknown as any;

// 1. Listen for incoming push notifications from backend
_self.addEventListener("push", (event: any) => {
  if (!event.data) return;

  let payload = {
    title: "Aviorè Go",
    body: "You have a new update",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    url: "/",
  };

  try {
    const json = event.data.json();
    payload = { ...payload, ...json };
  } catch (err) {
    payload.body = event.data.text() || payload.body;
  }

  const options: Record<string, any> = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    vibrate: [100, 50, 100],
    data: {
      url: payload.url,
    },
  };

  event.waitUntil(_self.registration.showNotification(payload.title, options));
});

// 2. Handle tap/click on notification banner
_self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();

  const targetPath = event.notification.data?.url || "/";

  event.waitUntil(
    _self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList: any[]) => {
      for (const client of clientList) {
        try {
          const clientUrl = new URL(client.url);
          if (
            (clientUrl.pathname === targetPath || client.url.endsWith(targetPath)) &&
            "focus" in client
          ) {
            return client.focus();
          }
        } catch (e) {
          // Fallback if URL parsing fails
        }
      }

      if (_self.clients.openWindow) {
        return _self.clients.openWindow(targetPath);
      }
    })
  );
});