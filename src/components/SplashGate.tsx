"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface SplashGateProps {
  children: React.ReactNode;
}

export default function SplashGate({ children }: SplashGateProps) {
  const [isReady, setIsReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Preparing your experience...");
  const [retryCount, setRetryCount] = useState(0);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const wakeServerAndPreload = async () => {
      try {
        if (retryCount > 0) {
          setStatusMessage("Waking up secure server...");
        } else {
          setStatusMessage("Preparing your experience...");
        }

        // 1. Wake backend via lightweight ping
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/health`, {
          method: "GET",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) throw new Error("Server not responding");

        // 2. Preload static app configurations/cache here if needed
        setStatusMessage("Loading system config...");
        await new Promise((resolve) => setTimeout(resolve, 400)); // Smooth UX transition delay

        if (isMounted) {
          setIsReady(true);
        }
      } catch (err) {
        console.warn("Server cold start in progress, retrying...", err);

        // Update messaging if taking longer than expected
        if (retryCount >= 2) {
          setIsStuck(true);
          setStatusMessage("Server is taking a moment to spin up...");
        } else {
          setStatusMessage("Connecting to server...");
        }

        // Retry automatically every 3 seconds
        timer = setTimeout(() => {
          if (isMounted) {
            setRetryCount((prev) => prev + 1);
          }
        }, 3000);
      }
    };

    wakeServerAndPreload();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [retryCount]);

  // Once server is awake, render the rest of the application
  if (isReady) {
    return <>{children}</>;
  }

  // Splash Screen View
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-neutral-900 text-white p-6 font-sans">
      {/* Top Spacer */}
      <div className="w-full h-12" />

      {/* Main Branding & Loading State */}
      <div className="flex flex-col items-center text-center max-w-xs space-y-6">
        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Aviorè<span className="text-emerald-500">Go</span>
          </h1>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center space-y-3 pt-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>

          <p className="text-xs font-semibold text-neutral-400 tracking-wide">
            {statusMessage}
          </p>
        </div>

        {/* Manual Retry Button (Shown if cold start takes > 9 seconds) */}
        {isStuck && (
          <button
            onClick={() => {
              setIsStuck(false);
              setRetryCount((prev) => prev + 1);
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full text-xs font-bold border border-neutral-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Tap to Retry</span>
          </button>
        )}
      </div>

      {/* Footer / Subtext */}
      <div className="pb-6 text-center">
        <p className="text-[11px] font-medium text-neutral-500">
          Securing connection to services
        </p>
      </div>
    </div>
  );
}