"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    const res = await Notification.requestPermission();
    setPermission(res);

    if (res === "granted") {
      // 🟢 Register subscription with service worker
      const registration = await navigator.serviceWorker.ready;
      
      // Here you will subscribe using your VAPID Public Key:
      // const subscription = await registration.pushManager.subscribe({
      //   userVisibleOnly: true,
      //   applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      // });
      // Send `subscription` to your backend API to store for this rider/user.

      alert("Push notifications enabled!");
    }
  };

  if (permission === "granted") return null; // Already enabled

  return (
    <button
      onClick={requestPermission}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
    >
      <Bell className="w-4 h-4" />
      Enable Push Notifications
    </button>
  );
}