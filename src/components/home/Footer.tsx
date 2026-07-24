"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 font-sans">
      {/* Upper Newsletter & Call To Action Banner */}
      <div className="border-b border-neutral-900/80 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Stay updated with Aviorè Go
              </h3>
              <p className="text-xs text-neutral-400 max-w-md">
                Subscribe to our newsletter for product updates, route expansions, and operational insights across our logistics network.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-3.5 rounded-2xl w-full sm:w-auto">
                  <CheckCircle2 size={16} />
                  <span>Thank you for subscribing to our dispatch updates!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md">
                <Package size={20} />
              </div>
              <span className="font-black text-xl text-white tracking-tight">Aviorè Go</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Next-generation automated logistics infrastructure powering personal deliveries, e-commerce merchants, and enterprise dispatch routing across South-West Nigeria.
            </p>

            {/* Live Operational Badges */}
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>ESCROW Protected</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full">
                <Globe size={14} className="text-emerald-500" />
                <span>Real-time GPS Matrix</span>
              </div>
            </div>
          </div>

          {/* Logistics Solutions */}
          <div className="space-y-3.5 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Solutions</p>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link href="/dashboard/shipment/create" className="hover:text-white transition-colors">
                  Personal Shipping
                </Link>
              </li>
              <li>
                <Link href="/for-business" className="hover:text-white transition-colors">
                  Merchant Enterprise API
                </Link>
              </li>
              <li>
                <Link href="/#track" className="hover:text-white transition-colors">
                  Quick Package Tracking
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white transition-colors">
                  Become a Dispatch Rider
                </Link>
              </li>
            </ul>
          </div>

          {/* Active Regional Hubs */}
          <div className="space-y-3.5 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Active Hubs</p>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-neutral-200">Osun Hub</span>
                  <span className="text-[11px] text-neutral-500">Osogbo, Ede, Ilesa</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-neutral-200">Oyo Hub</span>
                  <span className="text-[11px] text-neutral-500">Ibadan, Ogbomoso, Oyo</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Support & Contact Details */}
          <div className="space-y-3.5 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Contact & Help</p>
            <ul className="space-y-2.5 font-medium">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-neutral-500" />
                <a href="mailto:support@aviore.com" className="hover:text-white transition-colors">
                  support@aviore.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-neutral-500" />
                <a href="tel:+2348000000000" className="hover:text-white transition-colors">
                  +234 (0) 800 AVIORÈ GO
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Help Center & Claims
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Legal, Socials & Copyright) */}
      <div className="border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            {/* Copyright */}
            <p className="text-[11px]">
              &copy; {new Date().getFullYear()} Aviorè Logistics Technologies Inc. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
              <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-neutral-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/security" className="hover:text-neutral-300 transition-colors">
                Security Policy
              </Link>
              <Link href="/cookies" className="hover:text-neutral-300 transition-colors">
                Cookie Settings
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4 text-neutral-400">
              {/* Twitter / X */}
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}