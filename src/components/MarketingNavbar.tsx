'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-base shadow-md">
              A
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Avio<span className="text-emerald-600">Go</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://app.aviorego.com.ng"
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm"
            >
              Install App
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-emerald-600 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dark Drawer Menu (Matching your reference mobile menu screen) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#052c1e] text-white flex flex-col lg:hidden animate-in fade-in duration-200">
          <div className="px-4 h-16 flex items-center justify-between border-b border-emerald-900/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base">
                A
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Avio<span className="text-emerald-400">Go</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-emerald-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Food • Delivery • Events</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Quick Links</h4>
              <ul className="space-y-3 text-base font-medium text-gray-200">
                <li><Link href="#home" onClick={() => setIsOpen(false)} className="hover:text-emerald-400">Home</Link></li>
                <li><Link href="#about" onClick={() => setIsOpen(false)} className="hover:text-emerald-400">About Us</Link></li>
                <li><Link href="#services" onClick={() => setIsOpen(false)} className="hover:text-emerald-400">Services</Link></li>
                <li><Link href="#ambassadors" onClick={() => setIsOpen(false)} className="hover:text-emerald-400">Ambassadors</Link></li>
                <li><Link href="#blog" onClick={() => setIsOpen(false)} className="hover:text-emerald-400">Blog</Link></li>
                <li><Link href="#contact" onClick={() => setIsOpen(false)} className="hover:text-emerald-400">Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-emerald-900/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Support</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="#help" onClick={() => setIsOpen(false)}>Help Center</Link></li>
                <li><Link href="#faq" onClick={() => setIsOpen(false)}>FAQs</Link></li>
                <li><Link href="#privacy" onClick={() => setIsOpen(false)}>Privacy Policy</Link></li>
                <li><Link href="#terms" onClick={() => setIsOpen(false)}>Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          <div className="p-6 border-t border-emerald-900/60 bg-emerald-950/40">
            <a
              href="https://app.aviorego.com.ng"
              className="block w-full text-center bg-emerald-500 text-gray-950 font-bold py-3.5 rounded-xl shadow-lg"
            >
              Open PWA App →
            </a>
          </div>
        </div>
      )}
    </>
  );
}