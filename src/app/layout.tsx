import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { AuthProvider } from "../context/AuthContext";
import SplashGate from "../components/SplashGate";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aviore.com"),
  title: {
    default: "Aviorè Go | Smart, Secure & Reliable Logistics across Osun & Oyo",
    template: "%s | Aviorè Go",
  },
  description:
    "Fast, safe, and reliable parcel delivery across Osun State and Oyo State. Real-time GPS tracking, secure escrow payments, verified riders, and smart delivery options.",
  keywords: [
    "Aviorè Go",
    "Aviore",
    "Logistics Nigeria",
    "Delivery App Osogbo",
    "Ibadan Logistics",
    "Osun State Delivery",
    "Oyo State Delivery",
    "Parcel Delivery Nigeria",
    "Express Courier",
    "Same Day Delivery Osun",
    "Verified Courier Riders",
  ],
  authors: [{ name: "Aviorè" }],
  creator: "Aviorè",
  publisher: "Aviorè",
  applicationName: "Aviorè Go",
  category: "Logistics & Commerce",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Aviorè Go | Delivering What Matters Most",
    description: "Fast, safe, and reliable parcel delivery across Osun & Oyo State. Real-time GPS tracking & escrow security.",
    url: "https://aviore.com",
    siteName: "Aviorè Go",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aviorè Go Logistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aviorè Go",
    description: "Smart, secure & reliable parcel delivery across Osun & Oyo State.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LogisticsService",
    name: "Aviorè Go",
    url: "https://aviore.com",
    logo: "https://aviore.com/images/logo.png",
    description: "Fast, safe and reliable parcel delivery across Osun and Oyo State.",
    areaServed: [
      { "@type": "AdministrativeArea", name: "Osun State" },
      { "@type": "AdministrativeArea", name: "Oyo State" }
    ],
    serviceType: "Parcel Courier, Express Delivery, Smart Delivery",
  };

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-neutral-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <ReactQueryProvider>
          <AuthProvider>
            <SplashGate>{children}</SplashGate>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}