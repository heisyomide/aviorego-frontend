import Link from "next/link";
import { ArrowRight, ShieldCheck, MapPin, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Serving Osun State & Oyo State, Nigeria
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1]">
              Fast, Reliable <br />
              <span className="text-emerald-600">Intra-State Logistics</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed">
              Send and receive parcels seamlessly across Osogbo, Ede, Ibadan, and Ogbomoso. Track your packages in real-time with verified couriers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shipments/create"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-full shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
              >
                <span>Send Package Now</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#track"
                className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs px-6 py-3.5 rounded-full transition-colors"
              >
                Track Shipment
              </Link>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/80 max-w-md">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-neutral-700">Verified Couriers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-neutral-700">Live GPS Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-neutral-700">Escrow Security</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-neutral-800 space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold tracking-wide uppercase text-neutral-300">
                    Active Delivery
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-800 px-2 py-1 rounded text-neutral-400">
                  AVG-9482-OS
                </span>
              </div>

              {/* Delivery Graphic Simulation */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-200">Pick-up Location</p>
                    <p className="text-neutral-400 text-[11px]">Oke-Fia, Osogbo, Osun State</p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-neutral-800 ml-1.5" />
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-200">Drop-off Destination</p>
                    <p className="text-neutral-400 text-[11px]">Bodija, Ibadan, Oyo State</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">Estimated Time</p>
                  <p className="font-extrabold text-emerald-400">45 Mins</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">Delivery Status</p>
                  <p className="font-extrabold text-white">In Transit</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}