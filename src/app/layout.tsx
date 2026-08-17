import type { Metadata, Viewport } from "next";
// 🟢 Import Fontsource fonts instead of next/font/google
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { AuthProvider } from "../context/AuthContext";
import SplashGate from "../components/SplashGate";
import PushNotificationManager from "../components/PushNotificationManager";
import RealtimeNotificationListener from "../components/RealtimeNotificationListener"; 
import AppUpdateBanner from "../components/AppUpdateBanner";

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// 🟢 Updated domain base URL
const DOMAIN_URL = "https://www.aviorego.com.ng";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: "Aviorè Go | High-End Logistics, Event Fulfillment & Smart Delivery across Osun & Oyo",
    template: "%s | Aviorè Go",
  },
  description:
    "Nigeria's premier high-end logistics and event fulfillment ecosystem. Specializing in secure express parcel delivery, dedicated event transit management, real-time GPS tracking, and corporate supply chain solutions across Osun and Oyo State.",
  keywords: [
    "Aviorè Go",
    "Aviore",
    "High-End Logistics Nigeria",
    "Event Logistics Osogbo",
    "Ibadan Corporate Logistics",
    "Event Fulfillment Oyo",
    "Osun State Courier Service",
    "Secure Parcel Delivery Nigeria",
    "Express Courier & Event Transit",
    "Same Day Delivery Osun",
    "Verified Courier Riders",
    "Smart Supply Chain Solutions",
  ],
  authors: [{ name: "Aviorè", url: DOMAIN_URL }],
  creator: "Aviorè",
  publisher: "Aviorè",
  applicationName: "Aviorè Go",
  category: "Logistics, Supply Chain & Event Operations",
  
  // 🟢 iOS / Safari PWA Installability Config
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aviorè Go",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Aviorè Go | High-End Logistics & Event Fulfillment Ecosystem",
    description:
      "Precision parcel delivery, robust event transit solutions, real-time GPS tracking, and enterprise-grade security across Osun & Oyo State.",
    url: DOMAIN_URL,
    siteName: "Aviorè Go",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: `${DOMAIN_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Aviorè Go High-End Logistics and Event Fulfillment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aviorego",
    creator: "@aviore",
    title: "Aviorè Go | High-End Logistics & Event Fulfillment",
    description:
      "Advanced parcel shipping, comprehensive event logistics, and real-time tracking across Osun & Oyo State.",
    images: [`${DOMAIN_URL}/images/og-image.jpg`],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🟢 Advanced Rich Schema.org Structured Data for Local Business & Logistics Enterprise
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LogisticsService",
        "@id": `${DOMAIN_URL}/#logistics`,
        name: "Aviorè Go",
        url: DOMAIN_URL,
        logo: `${DOMAIN_URL}/images/logo.png`,
        image: `${DOMAIN_URL}/images/og-image.jpg`,
        description:
          "High-end logistics, enterprise courier services, and specialized event fulfillment solutions across Osun and Oyo State.",
        areaServed: [
          { "@type": "AdministrativeArea", name: "Osun State" },
          { "@type": "AdministrativeArea", name: "Oyo State" },
        ],
        serviceType: [
          "Parcel Courier",
          "Express Delivery",
          "Event Logistics & Transit Management",
          "Corporate Supply Chain",
        ],
        provider: {
          "@type": "Organization",
          name: "Aviorè",
          url: DOMAIN_URL,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${DOMAIN_URL}/#website`,
        url: DOMAIN_URL,
        name: "Aviorè Go",
        publisher: {
          "@type": "Organization",
          name: "Aviorè",
          logo: {
            "@type": "ImageObject",
            url: `${DOMAIN_URL}/images/logo.png`,
          },
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* 🟢 Force browser to load Aviorè logo as favicon */}
        <link rel="icon" href="/images/logo.png" sizes="any" />
        <link rel="shortcut icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-neutral-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <ReactQueryProvider>
          <AuthProvider>
            <SplashGate>
              {/* 🟢 App Update & Notification Managers */}
              <AppUpdateBanner />
              <PushNotificationManager />
              <RealtimeNotificationListener />
              {children}
            </SplashGate>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}