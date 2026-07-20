import type { Metadata } from "next";
import "./globals.css";
import Providers from "../providers/ReactQueryProvider";
import { AuthProvider } from "../context/AuthContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://aviore.com"),

  title: {
    default: "Aviorè",
    template: "%s | Aviorè",
  },

  description:
    "Aviorè is Nigeria's premium commerce and logistics ecosystem. Shop from trusted vendors, create shipments, track deliveries in real time, and enjoy secure payments.",

  keywords: [
    "Aviorè",
    "Aviore",
    "Nigeria marketplace",
    "Nigeria logistics",
    "Delivery app",
    "Courier",
    "E-commerce",
    "Marketplace",
    "Online shopping",
    "Shipping",
    "Vendor marketplace",
    "Parcel delivery",
    "Same day delivery",
    "Smart delivery",
    "Express delivery",
  ],

  authors: [
    {
      name: "Aviorè",
    },
  ],

  creator: "Aviorè",

  publisher: "Aviorè",

  applicationName: "Aviorè",

  category: "Business",

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
    title: "Aviorè",
    description:
      "Nigeria's premium e-commerce and logistics platform.",

    url: "https://aviore.com",

    siteName: "Aviorè",

    locale: "en_NG",

    type: "website",

    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aviorè",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Aviorè",

    description:
      "Luxury e-commerce, shipping and logistics ecosystem.",

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
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <ReactQueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}