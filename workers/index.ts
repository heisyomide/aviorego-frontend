// worker/index.ts

// Listen for incoming push notifications sent from your backend
self.addEventListener("push", (event: any) => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || "Aviorè Go";
  const options = {
    body: data.body || "You have a new update",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/", // Redirect link when notification is tapped
    },
  };

  event.waitUntil((self as any).registration.showNotification(title, options));
});

// Handle tap/click on notification
self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    (self as any).clients.matchAll({ type: "window" }).then((clientList: any[]) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if ((self as any).clients.openWindow) {
        return (self as any).clients.openWindow(targetUrl);
      }
    })
  );
});