"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Store, Search, ArrowRight, CheckCircle2 } from "lucide-react";

export default function EcosystemSection() {
  const [trackingId, setTrackingId] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = `/track/${trackingId.trim()}`;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Complete Ecosystem
          </h2>
          <h3 className="text-3xl font-black text-neutral-900">
            Tailored Logistics Solutions
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Personal */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <User size={20} />
              </div>
              <h4 className="text-xl font-bold text-neutral-900">Personal Users</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Send personal parcels, food items, laundry, or store orders across town effortlessly.
              </p>
              <div className="space-y-2 pt-2">
                {["Doorstep Pickup", "PIN Hand-off Security", "Live Route Tracking"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/shipments/create"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-full transition-all"
            >
              <span>Send Personal Package</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Business */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-white text-neutral-900 flex items-center justify-center">
                <Store size={20} />
              </div>
              <h4 className="text-xl font-bold text-white">Merchants & Businesses</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Automate your delivery workflows with batch shipping, dashboard analytics, and escrow protection.
              </p>
              <div className="space-y-2 pt-2">
                {["Automated Bulk Orders", "Merchant Dashboard", "Scheduled Weekly Payouts"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/register/business"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs py-3 rounded-full transition-all"
            >
              <span>Open Business Account</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Track Box */}
          <div id="track" className="lg:col-span-4 p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <Search size={20} />
              </div>
              <h4 className="text-xl font-bold text-neutral-900">Quick Track Shipment</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Got a tracking number? Enter your shipment code below to see real-time status.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="e.g., AVG-8932-OS"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all"
                >
                  Track Package
                </button>
              </form>
            </div>
            <p className="text-[11px] text-neutral-500 text-center">
              Enter tracking ID without spaces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}