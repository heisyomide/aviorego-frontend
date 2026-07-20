'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [trackingId, setTrackingId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    // Route to tracking page or hit tracking API
    window.location.href = `/track?id=${encodeURIComponent(trackingId.trim())}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Aviorè<span className="inline-flex items-center bg-emerald-700 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-normal align-middle ml-1.5 shadow-sm">Go</span>
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/services" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Services
          </Link>
          <Link href="/business" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            For Business
          </Link>
          <Link href="/become-rider" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Become a Rider
          </Link>
          <Link
            href="/login"
            className="text-sm font-bold text-white bg-slate-950 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-98"
          >
            Authenticate
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-16 pt-16 pb-24 space-y-24">
        
        {/* Hero Segment */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Context Block */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 px-3 py-1 rounded-full text-emerald-800 text-xs font-bold tracking-wide">
                <span>⚡ Hyper-local Logistics Infrastructure</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-950">
                Deliver Anything.<br />
                <span className="text-emerald-700">Anywhere.</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium max-w-lg leading-relaxed">
                Fast, secure, and reliable fulfillment infrastructure built for modern commerce, independent vendors, and instant dispatch operations.
              </p>
            </div>

            {/* Live Track Execution Strip */}
            <form onSubmit={handleTrackSubmit} className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-md flex items-center max-w-md gap-2">
              <div className="flex-1 flex items-center gap-2 pl-3">
                <span className="text-slate-400 text-lg">📦</span>
                <input
                  type="text"
                  placeholder="Enter Waybill or Tracking ID..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
              >
                Track Now
              </button>
            </form>
          </div>

          {/* Feature Service Selection Terminal Matrix */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Action Card: Instant Dispatch */}
            <Link href="/send" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group hover:border-emerald-600/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L6 12Zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Instant Dispatch</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Send parcels, documents, or high-value commodities instantly with real-time tracking.</p>
            </Link>

            {/* Action Card: Third-Party Logistics */}
            <Link href="/business" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group hover:border-emerald-600/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75h-35a.75.75 0 0 0-.75.75v3.25c0 .414.336.75.75.75Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Vendor Fulfillment</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Scale your local e-commerce store with automated bulk processing and dedicated route couriers.</p>
            </Link>

            {/* Action Card: Home Mover */}
            <Link href="/move" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group hover:border-emerald-600/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-.447-.268-.852-.686-1.028l-2.684-1.13A1.125 1.125 0 0 0 15.396 9.75H13.5m-6 9V14.25m0 0v-4.125c0-.621.504-1.125 1.125-1.125H13.5m-6 5.25h6m-6-5.25V5.625c0-.621.504-1.125 1.125-1.125h4.875c.621 0 1.125.504 1.125 1.125v3.25" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Freight & Moving</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Book standard heavy trucks and certified moving teams for seamless home or office transfers.</p>
            </Link>

            {/* Action Card: Errand Logistics */}
            <Link href="/errands" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group hover:border-emerald-600/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Errand Executions</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Assign multi-stop target deliveries and customized collection errands to verified professionals.</p>
            </Link>

          </div>
        </section>

        {/* Operational Driver Opportunities Callout */}
        <section className="bg-emerald-950 text-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Earn on your own terms.</h2>
            <p className="text-emerald-200 font-medium max-w-xl text-base leading-relaxed">
              Join thousands of dispatch fleet partners and riders securing structural economic freedom through predictable network earnings every single day.
            </p>
            <div className="pt-4">
              <Link
                href="/rider/signup"
                className="inline-block bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all active:scale-97"
              >
                Become a Rider Partner
              </Link>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-4 text-right select-none opacity-20 transform translate-x-8 translate-y-8">
            <span className="text-[200px] leading-none">🚛</span>
          </div>
        </section>

      </main>

      {/* Trust Significance Footer Component */}
      <footer className="bg-white border-t border-slate-100 px-6 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider">Security Architecture</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">Fully vetted fleet networks with multi-factor verification frameworks ensuring complete cargo integrity.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider">Predictable Pricing</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">Transparent distance metrics calculate delivery rates exactly, eliminating volatile structural surges.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider">Continuous Support</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">Dedicated control console operators ensure immediate routing anomalies or customer claims resolve cleanly.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider">Real-time Visibility</h4>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">Continuous telemetry ensures tracking coordinates report directly back to sender and receiver windows.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-400 gap-4">
          <p>&copy; 2026 Aviorè. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Standard</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Operating Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}