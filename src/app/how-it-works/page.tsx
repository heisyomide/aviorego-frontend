'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Zap,
  Navigation,
  Smartphone,
  Lock,
  UserCheck,
  HelpCircle,
  Truck,
  Building2,
  Bike,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'business' | 'rider'>('individual');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. NAVIGATION BAR                                            */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-700 text-white p-2 rounded-xl group-hover:bg-emerald-800 transition-colors">
              <Package size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight text-slate-900 flex items-center gap-1.5">
                Aviorè <span className="inline-flex items-center bg-emerald-700 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-normal align-middle shadow-xs">Go</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 -mt-0.5">
                Smart . Secure . Reliable
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/#services" className="hover:text-slate-900 transition-colors">
              Services
            </Link>
            <Link href="/how-it-works" className="text-emerald-700 font-bold">
              How it Works
            </Link>
            <Link href="/coverage" className="hover:text-slate-900 transition-colors">
              Coverage
            </Link>
            <Link href="/#rider" className="hover:text-slate-900 transition-colors">
              Become a Rider
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Login
            </Link>
            <Link
              href="/shipments/create"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95"
            >
              Send Package
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
              Home
            </Link>
            <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
              Services
            </Link>
            <Link href="/how-it-works" className="block py-2 text-sm font-bold text-emerald-700">
              How it Works
            </Link>
            <Link href="/coverage" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
              Coverage Network
            </Link>
            <Link href="/#rider" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
              Become a Rider
            </Link>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" className="w-full text-center py-2.5 text-sm font-bold text-slate-800 bg-slate-100 rounded-xl">
                Login
              </Link>
              <Link href="/shipments/create" className="w-full text-center py-2.5 text-sm font-bold text-white bg-emerald-700 rounded-xl shadow-xs">
                Send Package
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. PAGE HEADER / HERO                                         */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white border-b border-slate-200/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
            <Zap size={14} className="text-emerald-700" />
            <span>Seamless Delivery Workflow</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Fast, transparent dispatch <br className="hidden sm:inline" />
              <span className="text-emerald-700">built for Osun & Oyo State.</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">
              Discover how Aviorè Go connects senders, merchants, and riders with automated matching, real-time GPS tracking, and OTP security verification.
            </p>
          </div>

          {/* User Type Selector Tabs */}
          <div className="pt-4 flex justify-center lg:justify-start">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1">
              <button
                onClick={() => setActiveTab('individual')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'individual'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Senders
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'business'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Merchants & Business
              </button>
              <button
                onClick={() => setActiveTab('rider')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'rider'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Rider Partners
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. STEP-BY-STEP WORKFLOWS                                      */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-20">
        
        {/* TAB 1: INDIVIDUAL SENDERS */}
        {activeTab === 'individual' && (
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">How to Send a Package</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Book a pickup in under 60 seconds and track it live to destination.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">
                    01
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base">Enter Shipment Details</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Specify pickup and dropoff addresses across Osun or Oyo, choose package size, and view instant price estimates.
                    </p>
                  </div>
                </div>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Smartphone size={14} /> Mobile & Web Booking
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">
                    02
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base">Rider Dispatch Match</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Our dispatch system assigns the nearest verified rider to collect your item with average pickup times under 15 minutes.
                    </p>
                  </div>
                </div>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Bike size={14} /> Verified Fleet Network
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">
                    03
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base">Live Telemetry & Tracking</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Track movement live on full GPS telemetry maps. Share live tracking links directly with the parcel recipient.
                    </p>
                  </div>
                </div>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Navigation size={14} /> Real-time GPS Coordinates
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">
                    04
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base">OTP Code Verification</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Delivery is finalized when recipient provides a secure OTP confirmation code to ensure packages arrive in safe hands.
                    </p>
                  </div>
                </div>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Lock size={14} /> Secure Delivery Handshake
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: MERCHANTS & BUSINESS */}
        {activeTab === 'business' && (
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">How Vendor Fulfillment Works</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Power your online store, boutique, or enterprise with automated logistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">01</div>
                <h3 className="font-extrabold text-slate-900 text-base">Connect Merchant Console</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Integrate via business dashboard or upload bulk delivery spreadsheets in seconds.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">02</div>
                <h3 className="font-extrabold text-slate-900 text-base">Automated Route Grouping</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Our system groups multiple customer deliveries by destination clusters to optimize delivery costs.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">03</div>
                <h3 className="font-extrabold text-slate-900 text-base">Bulk Rider Pickups</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Dedicated courier riders arrive at your shop or warehouse for organized morning/afternoon sweeps.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">04</div>
                <h3 className="font-extrabold text-slate-900 text-base">Same-Day Settlement</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Receive real-time delivery status logs and daily wallet payouts directly into your bank account.</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: RIDERS & FLEET */}
        {activeTab === 'rider' && (
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">How Rider Partners Earn</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Turn your motorcycle, van, or haulage vehicle into steady daily income.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">01</div>
                <h3 className="font-extrabold text-slate-900 text-base">Verify Credentials</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Submit basic ID, driver's license, and vehicle documents for fast 24-hour verification.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">02</div>
                <h3 className="font-extrabold text-slate-900 text-base">Go Online & Accept</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Toggle active status in your rider app and accept delivery requests nearby in real time.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">03</div>
                <h3 className="font-extrabold text-slate-900 text-base">Pick Up & Deliver</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Follow turn-by-turn in-app turn routing maps from sender pickup to dropoff point.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100">04</div>
                <h3 className="font-extrabold text-slate-900 text-base">Instant Wallet Earnings</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Delivery payouts credit to your rider wallet immediately upon successful completion.</p>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. KEY SECURITY & TRUST PILLARS                               */}
        {/* ------------------------------------------------------------- */}
        <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Built with Security at the Core</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">How we protect every parcel, payment, and transaction across our network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Vetted Rider Fleet</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Every dispatch rider completes background identity checks, address verification, and safety protocol training before onboarding.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Secure OTP Confirmation</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Deliveries are protected with dynamic multi-digit confirmation codes sent directly to the recipient to prevent wrong dropoffs.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Navigation size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Live Telemetry Control</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Our centralized control desk monitors active routes across Osun and Oyo, stepping in immediately if route delays occur.</p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 5. FREQUENTLY ASKED QUESTIONS                                 */}
        {/* ------------------------------------------------------------- */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Everything you need to know about dispatching with Aviorè Go.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle size={16} className="text-emerald-700 shrink-0" />
                How fast are intra-city deliveries in Osogbo or Ibadan?
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed pl-6">
                Most intra-city deliveries in Osogbo, Ife, Ede, and Ibadan city centers complete within 30 to 60 minutes after rider pickup.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle size={16} className="text-emerald-700 shrink-0" />
                Do you support inter-state delivery between Osun and Oyo?
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed pl-6">
                Yes! We offer daily same-day express dispatch services between major Osun hubs (Osogbo, Ife, Ede) and Oyo hubs (Ibadan, Ogbomoso, Oyo Town).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle size={16} className="text-emerald-700 shrink-0" />
                How is delivery pricing calculated?
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed pl-6">
                Pricing is calculated transparently based on distance in kilometers between pickup and dropoff points, vehicle type, and package weight.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle size={16} className="text-emerald-700 shrink-0" />
                What items are prohibited on Aviorè Go?
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed pl-6">
                We strictly prohibit illegal narcotics, unregistered firearms, hazardous chemicals, stolen goods, and uncontained toxic liquids.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 6. CALL TO ACTION BANNER                                      */}
        {/* ------------------------------------------------------------- */}
        <section className="rounded-[2.5rem] bg-emerald-950 text-white p-8 sm:p-12 border border-emerald-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Ready to send your first package?</h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium max-w-md">Experience fast, secure, and trackable logistics across Osun and Oyo State today.</p>
          </div>
          <Link
            href="/shipments/create"
            className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0 active:scale-95"
          >
            Send Package Now
          </Link>
        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 7. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200/80 px-6 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-700 text-white p-1 rounded-lg">
              <Package size={16} />
            </div>
            <span className="font-extrabold text-slate-900">Aviorè Go</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/coverage" className="hover:text-slate-900 transition-colors">Coverage Network</Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}