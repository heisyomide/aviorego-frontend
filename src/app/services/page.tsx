'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Bike,
  Truck,
  Building2,
  Clock,
  ShieldCheck,
  Zap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  Navigation,
  Sparkles,
} from 'lucide-react';

// Import Footer from home components
import Footer from '../../components/home/Footer';

export default function ServicesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/services" className="text-emerald-700 font-bold">
              Services
            </Link>
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">
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
            <Link href="/services" className="block py-2 text-sm font-bold text-emerald-700">
              Services
            </Link>
            <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">
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
      {/* 2. HERO / PAGE HEADER                                         */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white border-b border-slate-200/80 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
            <Sparkles size={14} className="text-emerald-700" />
            <span>Tailored Logistics Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Delivery services designed for <br className="hidden sm:inline" />
            <span className="text-emerald-700">individuals, vendors, & enterprises.</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            From instant intra-city motorcycle dispatches to bulk commerce fulfillment and inter-state heavy cargo across Osun and Oyo State.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. DETAILED SERVICES CATALOG                                  */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Service 1: Intra-City Express */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Bike size={16} /> Instant Dispatch
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Intra-City Express Courier
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Need documents, food, groceries, or urgent items delivered within Osogbo, Ibadan, Ife, or Ede? Our network of vetted motorcycle dispatch riders picks up within minutes and delivers directly to your door with live GPS tracking.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Pickup within 15 minutes',
                'Live GPS telemetry tracking',
                'OTP delivery confirmation code',
                'Ideal for packages under 15kg',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/shipments/create"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-95"
              >
                Book Express Pickup <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Specs</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Avg. Delivery Time</span>
                  <span className="font-extrabold text-slate-900">30 - 60 Mins</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Supported Vehicle</span>
                  <span className="font-extrabold text-slate-900">Dispatch Motorbikes</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Max Weight</span>
                  <span className="font-extrabold text-slate-900">Up to 20kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage</span>
                  <span className="font-extrabold text-slate-900">Osogbo, Ibadan, Ife, Ede</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Inter-State Route Express */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Truck size={16} /> Regional Transit
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Osun & Oyo Inter-State Freight
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Connect your supply chain seamlessly between Osun State and Oyo State. We run daily scheduled shuttle routes transferring goods between major commercial hubs, guaranteeing same-day delivery across state borders.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Same-day inter-city transfer',
                'Covers Osogbo, Ibadan, Ogbomoso & Oyo Town',
                'Full item tracking log',
                'Insurance protection option available',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/shipments/create"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-95"
              >
                Send Inter-State Parcel <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Specs</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Avg. Transit Time</span>
                  <span className="font-extrabold text-slate-900">4 - 8 Hours (Same-day)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Fleet Options</span>
                  <span className="font-extrabold text-slate-900">Express Vans & Mini Trucks</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Supported Hubs</span>
                  <span className="font-extrabold text-slate-900">Ibadan, Osogbo, Ife, Oyo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification</span>
                  <span className="font-extrabold text-slate-900">Digital Waybill & OTP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 3: Merchant & E-Commerce Fulfillment */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-extrabold">
              <Building2 size={16} /> Business Solutions
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Merchant & E-Commerce Logistics
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Scale your online store, Instagram shop, or boutique without delivery headaches. Integrate our merchant console for automated order batching, scheduled daily shop pickups, and automated wallet payouts.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Batch order upload & route optimization',
                'Dedicated daily rider sweeps',
                'Same-day digital payouts',
                'Branded customer tracking links',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-xs active:scale-95"
              >
                Create Merchant Account <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Merchant Perks</div>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Discounted Rates</span>
                  <span className="font-extrabold text-slate-900">Up to 20% Tiered Savings</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Integration</span>
                  <span className="font-extrabold text-slate-900">CSV Bulk Upload / API</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Settlements</span>
                  <span className="font-extrabold text-slate-900">Instant / Daily Payouts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Support</span>
                  <span className="font-extrabold text-slate-900">Dedicated Account Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. VALUE PROPOSITION GRID                                     */}
        {/* ------------------------------------------------------------- */}
        <section className="bg-emerald-950 text-white rounded-[2.5rem] p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Why Choose Aviorè Go Services?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
              We leverage modern GPS technology and local expertise to deliver unparalleled logistics reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-900/40 border border-emerald-800/80 p-6 rounded-2xl space-y-3">
              <Clock size={24} className="text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">Automated Matching</h3>
              <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">
                Smart dispatch algorithms assign nearest available riders automatically, minimizing wait time.
              </p>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-800/80 p-6 rounded-2xl space-y-3">
              <ShieldCheck size={24} className="text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">End-to-End Security</h3>
              <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">
                Protected by OTP delivery verification, identity checks, and real-time route monitoring.
              </p>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-800/80 p-6 rounded-2xl space-y-3">
              <Navigation size={24} className="text-emerald-400" />
              <h3 className="font-extrabold text-base text-white">Transparent Telemetry</h3>
              <p className="text-xs text-emerald-100/70 font-medium leading-relaxed">
                Share live tracking links so customers can follow package movement on dynamic map view.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 5. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <Footer />

    </div>
  );
}