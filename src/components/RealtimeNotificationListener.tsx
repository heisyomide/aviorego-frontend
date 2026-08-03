"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export default function RealtimeNotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

    if (!token) return;

    // Connect to your WebSocket Gateway (adjust base URL if needed)
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
    
    const socket = io(`${socketUrl}/job-comm`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected for real-time notifications, ID:", socket.id);
    });

    // Listen for the event emitted from your PushNotificationService backend
    socket.on("new_notification", (notification) => {
      console.log("[Socket] New notification received:", notification);

      // 1. Invalidate React Query cache so notification bell & dropdown list refetch instantly
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });

      // 2. Optional: Trigger browser native notification toast or audio beep if permitted
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.body,
          icon: "/images/logo.png",
        });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket Connection Error]:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return null; // Headless listener component
}