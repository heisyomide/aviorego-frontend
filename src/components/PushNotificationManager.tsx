"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";

// Helper function to convert base64 VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [showBellBtn, setShowBellBtn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission !== "granted") {
      setShowBellBtn(true);
    } else {
      // User has already granted permission -> silently ensure backend has token
      navigator.serviceWorker.ready
        .then((reg) => syncPushTokenWithBackend(reg))
        .catch(console.error);
    }
  }, []);

  const syncPushTokenWithBackend = async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
          console.error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY in env variables");
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      // Extract Auth JWT token
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

      if (!token) {
        console.warn("Push sync skipped: Authorization token not found");
        return;
      }

      // Send Push Subscription to Backend
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/notifications/subscribe`,
        subscription,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Push subscription synchronized successfully");
    } catch (err) {
      console.error("Failed to sync push subscription with backend:", err);
    }
  };

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support push notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setShowBellBtn(false);
      const registration = await navigator.serviceWorker.ready;
      await syncPushTokenWithBackend(registration);
    }
  };

  if (!showBellBtn) return null;

  return (
    <button
      onClick={handleRequestPermission}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md"
    >
      <Bell className="w-4 h-4" />
      Enable Push Notifications
    </button>
  );
}