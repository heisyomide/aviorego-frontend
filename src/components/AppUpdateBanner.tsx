"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

export default function AppUpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check version every 10 minutes or on window focus
    const checkVersion = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/version`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const currentVersion = data.version;
        const savedVersion = localStorage.getItem("aviore_app_version");

        if (savedVersion && savedVersion !== currentVersion) {
          setUpdateAvailable(true);
        } else if (!savedVersion) {
          localStorage.setItem("aviore_app_version", currentVersion);
        }
      } catch (err) {
        // Ignore network errors during background check
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, 10 * 60 * 1000); // Check every 10 mins
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // 1. Unregister service workers so old caches are wiped
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // 2. Clear browser cache storage if available
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 3. Update saved local version to latest
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/version`);
      const data = await res.json();
      localStorage.setItem("aviore_app_version", data.version);

      // 4. Hard reload the page to fetch fresh server chunks
      window.location.reload();
    } catch (err) {
      console.error("Failed to update app cache:", err);
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-900 text-white px-4 py-3 shadow-lg flex items-center justify-between transition-all animate-slide-down">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>A new version of Aviorè Go is available with performance improvements!</span>
      </div>
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="flex items-center gap-1.5 bg-white text-emerald-900 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? "animate-spin" : ""}`} />
        {isUpdating ? "Updating..." : "Update Now"}
      </button>
    </div>
  );
}