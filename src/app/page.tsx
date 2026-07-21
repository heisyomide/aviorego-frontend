"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Building2,
  Bike,
  ShieldCheck,
  Clock,
  ArrowRight,
  Menu,
  X,
  MapPin,
  Lock,
  ChevronRight,
  Smartphone,
  CheckCircle2,
  Camera,
  Layers,
  Wallet,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      {/* ------------------------------------------------------------- */}
      {/* 1. NAVIGATION BAR                                             */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-2 rounded-xl">
              <Package size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 flex items-center gap-1">
                Aviorè <span className="text-emerald-600">Go</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 -mt-1">
                Smart . Secure . Reliable
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600">
            <Link href="/" className="text-emerald-600 font-bold">Home</Link>
            <Link href="#services" className="hover:text-emerald-600 transition-colors">Services</Link>
            <Link href="how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</Link>
            <Link href="#track" className="hover:text-emerald-600 transition-colors">Track Shipment</Link>
            <Link href="apply" className="hover:text-emerald-600 transition-colors">Become a Rider</Link>
            <Link href="#coverage" className="hover:text-emerald-600 transition-colors">Coverage</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              Login
            </Link>
            <Link
              href="/shipments/create"
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              Send Package
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
            <Link href="/" className="block py-2 text-sm font-bold text-emerald-600">Home</Link>
            <Link href="#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-neutral-700">Services</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-neutral-700">How it Works</Link>
            <Link href="#track" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-neutral-700">Track Shipment</Link>
            <Link href="apply" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-neutral-700">Become a Rider</Link>
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
              <Link href="/login" className="w-full text-center py-2.5 text-sm font-bold text-neutral-800 bg-neutral-100 rounded-xl">Login</Link>
              <Link href="/shipments/create" className="w-full text-center py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl shadow-md">Send a Package</Link>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold">
                <Sparkles size={14} className="text-emerald-600" />
                <span>Next-Gen Logistics in Nigeria</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1]">
                Delivering <br />
                <span className="text-emerald-600">What Matters</span> Most<span className="text-emerald-600">.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 font-medium max-w-xl mx-auto lg:mx-0">
                Fast, safe, and reliable delivery across <span className="font-bold text-neutral-900">Osun & Oyo State</span>. Track every step in real-time.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/shipments/create"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Package size={18} />
                  <span>Send a Package</span>
                </Link>
                <Link
                  href="#track"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <span>Track Shipment</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 border-t border-neutral-200/60 text-left">
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-100 shadow-2xs">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><MapPin size={14} /></div>
                  <span className="text-[11px] font-bold text-neutral-700">Real-time Tracking</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-100 shadow-2xs">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Lock size={14} /></div>
                  <span className="text-[11px] font-bold text-neutral-700">Secure Escrow</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-100 shadow-2xs">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheck size={14} /></div>
                  <span className="text-[11px] font-bold text-neutral-700">Verified Riders</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-100 shadow-2xs">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Clock size={14} /></div>
                  <span className="text-[11px] font-bold text-neutral-700">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Hero Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-emerald-900 p-6 text-white overflow-hidden shadow-2xl border border-emerald-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                        AG
                      </div>
                      <div>
                        <p className="font-bold text-sm">Aviorè Express Rider</p>
                        <p className="text-[10px] text-emerald-300">Active Duty • Oyo/Osun Hub</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">LIVE GPS</span>
                  </div>

                  <div className="space-y-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-300">Tracking ID:</span>
                      <span className="font-mono font-bold text-white">AVG-8829-OS</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-300">Estimated Arrival:</span>
                      <span className="font-bold text-emerald-400">14 Mins</span>
                    </div>
                    <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[70%] rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-emerald-200">
                    <span>Pickup: Osogbo Central</span>
                    <span>→</span>
                    <span>Drop: Ibadan Hub</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. "WHAT DO YOU WANT TO DO TODAY?" SECTION                     */}
      {/* ------------------------------------------------------------- */}
      <section id="services" className="py-14 bg-neutral-50/80 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              What do you want to do today?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Select a core service to get started immediately.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <Link
              href="/shipments/create"
              className="group bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 group-hover:text-emerald-600 transition-colors">Send a Package</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Deliver items safely to anyone anywhere across our coverage area.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="#track"
              className="group bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 group-hover:text-emerald-600 transition-colors">Track Shipment</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Follow your package trajectory live on the map in real-time.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href="/for-business"
              className="group bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 group-hover:text-emerald-600 transition-colors">Business Delivery</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Tailored logistics for merchants, e-commerce stores & bulk orders.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              href="apply"
              className="group bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Bike size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 group-hover:text-emerald-600 transition-colors">Become a Rider</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Earn guaranteed daily income by delivering packages on your schedule.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. COVERAGE MAP SECTION                                       */}
      {/* ------------------------------------------------------------- */}
      <section id="coverage" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-emerald-950 text-white overflow-hidden p-6 sm:p-10 border border-emerald-900 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Coverage Area</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                We currently operate in <br />
                <span className="text-emerald-400">Osun State & Oyo State</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
                Connecting major hubs including Osogbo, Ede, Ife, Ibadan, Ogbomoso, and surrounding territories with lightning-fast intra-state dispatch.
              </p>
              <div className="pt-2">
                <Link
                  href="/coverage"
                  className="inline-flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs px-5 py-3 rounded-full transition-all"
                >
                  <span>View Full Coverage Map</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm bg-emerald-900/60 border border-emerald-800 rounded-2xl p-5 space-y-4 text-center">
                <div className="flex justify-around items-center">
                  <div className="space-y-1">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/30">
                      <MapPin size={20} />
                    </div>
                    <p className="font-black text-sm text-white">Osun State</p>
                    <p className="text-[10px] text-emerald-300">Osogbo • Ede • Ife</p>
                  </div>

                  <div className="text-emerald-500 font-bold text-lg">← Hub →</div>

                  <div className="space-y-1">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                      <MapPin size={20} />
                    </div>
                    <p className="font-black text-sm text-white">Oyo State</p>
                    <p className="text-[10px] text-emerald-300">Ibadan • Ogbomoso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. APP ECOSYSTEM PREVIEW (PERSONAL, BUSINESS, PUBLIC TRACKING) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Designed for Everyone
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">Tailored dashboard interfaces optimized for individuals, business merchants, and public lookup.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal User Mockup */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Personal User</span>
                <h3 className="text-lg font-bold text-neutral-900">Send packages with ease</h3>
                <p className="text-xs text-neutral-500">Simple one-tap delivery requests for personal errands.</p>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-4 text-white space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>Dashboard</span>
                  <Smartphone size={14} />
                </div>
                <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700">
                  <p className="text-emerald-400 font-bold">+ Create Instant Delivery</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700">
                  <p className="text-neutral-300">Active Shipments (2)</p>
                </div>
              </div>
            </div>

            {/* Business User Mockup */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Business User</span>
                <h3 className="text-lg font-bold text-neutral-900">Manage all deliveries</h3>
                <p className="text-xs text-neutral-500">Bulk order uploads, API access, and automatic invoicing.</p>
              </div>

              <div className="bg-blue-950 rounded-2xl p-4 text-white space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-blue-300 text-[10px]">
                  <span>Business Hub</span>
                  <Building2 size={14} />
                </div>
                <div className="p-3 rounded-xl bg-blue-900/80 border border-blue-800">
                  <p className="text-blue-300 text-[10px]">Monthly Dispatch Volume</p>
                  <p className="text-xl font-bold text-white mt-1">124 Shipments</p>
                </div>
              </div>
            </div>

            {/* Public Tracking Mockup */}
            <div id="track" className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xs space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Track Shipment</span>
                <h3 className="text-lg font-bold text-neutral-900">Public Package Lookup</h3>
                <p className="text-xs text-neutral-500">Anyone can track their package status without logging in.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); if (trackingCode) window.location.href = `/dashboard/shipment/${trackingCode}`; }} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Enter Tracking Code (e.g. AVG123)"
                    className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  <span>Track Now</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. HOW DELIVERY WORKS                                         */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-16 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Workflow</span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">How Delivery Works</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {/* Step 1 */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">1</div>
              <h4 className="font-bold text-xs text-neutral-900">Create Order</h4>
              <p className="text-[11px] text-neutral-500">Sender creates a delivery request in seconds.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">2</div>
              <h4 className="font-bold text-xs text-neutral-900">Rider Accepts</h4>
              <p className="text-[11px] text-neutral-500">Nearest verified rider claims the job.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">3</div>
              <h4 className="font-bold text-xs text-neutral-900">Pickup</h4>
              <p className="text-[11px] text-neutral-500">Rider picks up item from sender location.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">4</div>
              <h4 className="font-bold text-xs text-neutral-900">In Transit</h4>
              <p className="text-[11px] text-neutral-500">Real-time GPS tracking enabled on map.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">5</div>
              <h4 className="font-bold text-xs text-neutral-900">Delivery</h4>
              <p className="text-[11px] text-neutral-500">Handed over or completed via Smart Proof.</p>
            </div>

            {/* Step 6 */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">6</div>
              <h4 className="font-bold text-xs text-neutral-900">Payment Released</h4>
              <p className="text-[11px] text-neutral-500">Escrow released upon successful confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. DELIVERY TYPES & SMART DELIVERY FEATURE                     */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-neutral-50/70 border-t border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Delivery Types */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-200 space-y-5">
              <h3 className="text-xl font-bold text-neutral-900">Delivery Options</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700"><Lock size={18} /></div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900">Hand to Receiver</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Receiver provides a secure verification PIN to rider upon arrival.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white"><Camera size={18} /></div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900">Smart Delivery</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Safely leave package if receiver is away with photo + GPS proof.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Delivery How it Works */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900">Smart Delivery <span className="text-xs text-emerald-600 font-semibold">(How it works)</span></h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CONTACTLESS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center mx-auto">1</div>
                  <p className="text-[11px] font-bold text-neutral-800">Receiver Away</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center mx-auto">2</div>
                  <p className="text-[11px] font-bold text-neutral-800">3 Photos Taken</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center mx-auto">3</div>
                  <p className="text-[11px] font-bold text-neutral-800">GPS Timestamp</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <CheckCircle2 size={18} className="text-emerald-600 mx-auto" />
                  <p className="text-[11px] font-bold text-emerald-900">Proof Submitted</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. SECURE PAYMENTS + BECOME A RIDER                            */}
      {/* ------------------------------------------------------------- */}
      <section id="rider" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Secure Payments Card */}
            <div className="lg:col-span-5 bg-neutral-50 rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <h3 className="text-2xl font-black text-neutral-900">Secure Payments</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  All funds are protected with escrow technology. Payment is held safely and only released when delivery is confirmed.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Escrow Protection Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Encrypted Bank & Card Gateways</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Instant Rider Payouts</span>
                </div>
              </div>
            </div>

            {/* Become a Rider CTA Card */}
            <div className="lg:col-span-7 bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between space-y-8">
              <div className="relative z-10 space-y-4 max-w-md">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider">NOW HIRING RIDERS</span>
                <h3 className="text-3xl font-black text-white leading-tight">Become a Rider Today!</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Earn on your own time with reliable daily/weekly payouts and be part of Nigeria's fastest growing logistics network.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> <span>Flexible Hours</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> <span>Great Weekly Earnings</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> <span>Instant Payouts</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> <span>Rider Insurance</span></div>
                </div>
              </div>

              <div className="relative z-10 pt-4">
                <Link
                  href="/rider/apply"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
                >
                  <span>Sign Up as Rider</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. WHY CHOOSE AVIORÈ GO + BULK BANNER                         */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-neutral-50/80 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Why Choose Us Grid */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl font-black text-neutral-900">Why Choose Aviorè Go?</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <MapPin size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-900">Real-time Tracking</h4>
                  <p className="text-xs text-neutral-500">Track your package moving on street routes in real time.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-900">Secure & Trusted</h4>
                  <p className="text-xs text-neutral-500">Your packages are in safe hands with fully verified couriers.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Camera size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-900">Smart Delivery</h4>
                  <p className="text-xs text-neutral-500">Proof-of-delivery options for maximum flexibility.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Wallet size={18} />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-900">Affordable Pricing</h4>
                  <p className="text-xs text-neutral-500">Competitive rates for reliable intra-state deliveries.</p>
                </div>
              </div>
            </div>

            {/* Bulk Banner */}
            <div className="lg:col-span-5 bg-amber-100/60 rounded-3xl p-6 border border-amber-200 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">BUSINESS DISCOUNTS</span>
                <h3 className="text-2xl font-black text-neutral-900">Send more, pay less!</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Enjoy custom bulk discounts for businesses, online vendors, and recurring corporate logistics.
                </p>
              </div>

              <div>
                <Link
                  href="/for-business"
                  className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-full transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. FOOTER                                                    */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
                  <Package size={18} />
                </div>
                <span className="font-black text-lg text-white tracking-tight">Aviorè Go</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Smart, secure, and reliable logistics across Osun State and Oyo State, Nigeria.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Links</p>
              <ul className="space-y-2">
                <li><Link href="/shipments/create" className="hover:text-white transition-colors">Send a Package</Link></li>
                <li><Link href="#track" className="hover:text-white transition-colors">Track Shipment</Link></li>
                <li><Link href="#rider" className="hover:text-white transition-colors">Become a Rider</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Coverage Hubs</p>
              <ul className="space-y-2">
                <li><span className="text-neutral-500">Osogbo / Ede (Osun State)</span></li>
                <li><span className="text-neutral-500">Ibadan / Ogbomoso (Oyo State)</span></li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Contact & Support</p>
              <p className="text-neutral-500">Support Email: support@aviore.com</p>
              <p className="text-neutral-500">Operating Hours: 24/7 Dispatch</p>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-900 text-center text-[11px] text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} Aviorè Go. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-neutral-400">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-neutral-400">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}