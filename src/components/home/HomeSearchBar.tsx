'use client';

import React, { useState } from 'react';
import { Search, Package, Calendar, Bus, Briefcase, ArrowRight, MapPin, Loader2, ChevronDown } from 'lucide-react';
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
  const [currentAddress, setCurrentAddress] = useState('Home - Oke-Fia, Osogbo');
  const [isLocating, setIsLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const address = data.address;
          const detectedCity = address.city || address.town || address.village || address.state || 'Osogbo';
          const detectedNeighborhood = address.suburb || address.neighbourhood || address.road || '';
          
          const formattedLocation = detectedNeighborhood ? `${detectedNeighborhood}, ${detectedCity}` : detectedCity;
          setCurrentAddress(`Current - ${formattedLocation}`);
        } catch (error) {
          console.error('Failed to reverse geocode location', error);
          setCurrentAddress('Osogbo, Nigeria');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
        alert('Unable to retrieve your location. Please check your browser permissions.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const filteredLinks = searchQuickLinks.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full bg-white border-b border-neutral-100 py-6 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Location Selector (Freestanding) */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            title="Click to update your delivery location"
          >
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {isLocating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Deliver to</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
                <span>{isLocating ? 'Detecting location...' : currentAddress}</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>
          </button>
        </div>

        {/* Search Input Box & Conditional Quick Actions/Dropdown */}
        <div className="relative max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-emerald-600 h-5 w-5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search for restaurants, groceries, or services near you..."
              className="w-full bg-neutral-100/90 border border-neutral-200/80 rounded-2xl pl-12 pr-28 py-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 transition-all font-medium shadow-sm"
            />
            <div className="absolute right-3 hidden sm:block">
              <span className="text-[10px] font-mono bg-neutral-200/70 text-neutral-700 px-2.5 py-1.5 rounded-xl font-bold">
                Press Enter ↵
              </span>
            </div>
          </div>

          {/* Quick Actions / Search Suggestions (Shows ONLY when focused) */}
          {isFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-2">
              
              {/* Quick Action Grid (Shown when input is empty) */}
              {query.trim().length === 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 px-1">Quick Actions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchQuickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2.5 p-2.5 hover:bg-emerald-50/80 rounded-xl transition-colors group border border-neutral-100"
                        >
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-neutral-800 group-hover:text-emerald-700 transition-colors">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filtered Search Results (Shown when typing) */}
              {query.trim().length > 0 && (
                <div className="divide-y divide-neutral-100">
                  {filteredLinks.length > 0 ? (
                    filteredLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center justify-between p-3 hover:bg-emerald-50/80 transition-colors group rounded-xl"
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
                      No matching results for "<span className="text-neutral-900 font-bold">{query}</span>".
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}