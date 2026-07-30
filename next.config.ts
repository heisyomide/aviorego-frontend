import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  customWorkerSrc: "workers",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    // Add explicit runtime caching rules to bypass Service Worker caching on authenticated & dynamic pages
    runtimeCaching: [
      {
        // 1. ALL Authenticated Dashboard Routes & APIs MUST BE NETWORK ONLY
        urlPattern: /^\/(dashboard|rider|admin|auth|api|\_next\/data)\/.*$/i,
        handler: "NetworkOnly",
        options: {
          cacheName: "no-cache-dynamic-routes",
        },
      },
      {
        // 2. Static Assets (Images, Fonts, CSS) - Cache First for performance
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|css)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-media-cache",
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
      {
        // 3. Document / HTML Page Navigation - Network First with short timeout
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "page-navigations",
          networkTimeoutSeconds: 4, // If network takes > 4s, fallback safely
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withPWA(nextConfig);