'use client';

import React, { useState } from 'react';
import { Search, Package, Calendar, Bus, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const searchQuickLinks = [
  { label: 'Send a Package', href: '/shipments/create', icon: Package, category: 'Delivery' },
  { label: 'Explore Events', href: '/events', icon: Calendar, category: 'Events' },
  { label: 'Book a Bus Ride', href: '/events/trips', icon: Bus, category: 'Transit' },
  { label: 'Organizer Portal', href: '/events/dashboard', icon: Briefcase, category: 'Business' },
];

export default function HomeSearchBarSection() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredLinks = searchQuickLinks.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="relative z-25 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-xl relative">
        
        {/* Search Input Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-emerald-600 h-5 w-5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="What would you like to do? (e.g. Send package, book ride, find events...)"
            className="w-full bg-white border border-emerald-200/80 rounded-2xl pl-12 pr-28 py-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium shadow-inner"
          />
          <div className="absolute right-2 hidden sm:block">
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
              Press Enter ↵
            </span>
          </div>
        </div>

        {/* Quick Suggestion Pills & Dropdown Results */}
        <div className="mt-4 pt-4 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-600 font-medium">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] mr-2">Quick Actions:</span>
            <span>Select below or type your intent</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {searchQuickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-600 text-neutral-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-[11px] font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-600 group-hover:text-white" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active Search Suggestions Dropdown Overlay (Displays when typing) */}
        {isFocused && query.trim().length > 0 && (
          <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-full mt-2 bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden z-30 divide-y divide-neutral-100">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-3.5 hover:bg-emerald-50/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">{item.label}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">Category: {item.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-neutral-500 font-medium">
                No matching results for "<span className="text-neutral-900 font-bold">{query}</span>". Try searching for deliveries, trips, or events.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}