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
    // Stop Workbox from precaching build artifacts or Vercel system files
    exclude: [
      /\.map$/,
      /^manifest.*\.json$/,
      /_next\/data\/.*\.json$/,
      /^\.well-known\//,
    ],
    runtimeCaching: [
      // 1. Completely ignore Vercel system paths
      {
        urlPattern: /\/\.well-known\/.*/i,
        handler: "NetworkOnly",
      },
      // 2. Dynamic API requests - Network first with zero timeout issues
      {
        urlPattern: /^https:\/\/aviore-go-backend\.onrender\.com\/.*$/i,
        handler: "NetworkOnly",
      },
      // 3. Static Assets (Images, Fonts, CSS, JS)
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|css|js)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-media-cache",
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
      // 4. Document / Page Navigation (Dashboard, Admin, etc.)
      // ALWAYS use NetworkFirst for navigation so it falls back gracefully instead of crashing the site
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "page-navigations",
          networkTimeoutSeconds: 3,
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