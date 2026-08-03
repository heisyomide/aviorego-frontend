// workers/index.ts

const _self = self as unknown as any;

_self.addEventListener("push", (event: any) => {
  if (!event.data) return;

  let rawData: any = {};
  try {
    rawData = event.data.json();
  } catch (err) {
    rawData = { body: event.data.text() };
  }

  // Fallback and normalize properties safely
  const title = rawData.title || "Aviorè Go";
  const body = rawData.body || "You have a new update";
  const icon = rawData.icon || "/images/logo.png";
  const badge = rawData.badge || "/images/logo.png";
  
  // Extract URL from root or nested data object
  const targetUrl = rawData.url || rawData.data?.url || "/";

  const options: Record<string, any> = {
    body,
    icon,
    badge,
    vibrate: [100, 50, 100],
    data: {
      url: targetUrl,
    },
  };

  event.waitUntil(_self.registration.showNotification(title, options));
});

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