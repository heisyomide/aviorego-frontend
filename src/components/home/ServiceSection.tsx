'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Utensils, Package, ShoppingBag, Pill, Grid, ArrowRight, Sparkles, BellRing } from 'lucide-react';

const serviceCategories = [
  {
    title: 'Food Delivery',
    description: 'Order meals from top local restaurants.',
    href: '/food',
    icon: Utensils,
    badge: 'Coming Soon',
    isLive: false,
    bgLight: 'bg-orange-50 hover:bg-orange-100/80',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    iconBg: 'bg-orange-500 text-white',
  },
  {
    title: 'Send Package',
    description: 'Fast, secure parcel delivery across cities.',
    href: '/shipments/create',
    icon: Package,
    badge: 'Express',
    isLive: true,
    bgLight: 'bg-emerald-50 hover:bg-emerald-100/80',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-900',
    iconBg: 'bg-emerald-500 text-white',
  },
  {
    title: 'Marketplace',
    description: 'Shop items and creator merchandise.',
    href: '/marketplace',
    icon: ShoppingBag,
    badge: 'Coming Soon',
    isLive: false,
    bgLight: 'bg-purple-50 hover:bg-purple-100/80',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    iconBg: 'bg-purple-500 text-white',
  },
  {
    title: 'Pharmacy',
    description: 'Get medications and health essentials.',
    href: '/pharmacy',
    icon: Pill,
    badge: 'Coming Soon',
    isLive: false,
    bgLight: 'bg-rose-50 hover:bg-rose-100/80',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-900',
    iconBg: 'bg-rose-500 text-white',
  },
  {
    title: 'More Services',
    description: 'Explore event tickets, transit rides & more.',
    href: '/services',
    icon: Grid,
    badge: 'Explore',
    isLive: true,
    bgLight: 'bg-blue-50 hover:bg-blue-100/80',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    iconBg: 'bg-blue-500 text-white',
  },
];

export default function HorizontalServicesSection() {
  const [modalService, setModalService] = useState<string | null>(null);

  const handleCardClick = (service: typeof serviceCategories[0], e: React.MouseEvent) => {
    if (!service.isLive) {
      e.preventDefault();
      setModalService(service.title);
    }
  };

  return (
    <section className="py-12 bg-white text-neutral-900 overflow-hidden relative">
      
      {/* Coming Soon Modal Popup */}
      {modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center space-y-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles size={32} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider">
                Coming Soon
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {modalService}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                We are currently building high-performance infrastructure for <span className="font-bold text-slate-800">{modalService}</span> on **AVIORÈ**. Stay tuned for our upcoming launch!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => setModalService(null)}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2"
              >
                <BellRing size={16} /> Got it, notify me!
              </button>
              <button
                onClick={() => setModalService(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              Explore Our <span className="text-emerald-600">Core Services</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Everything you need, delivered straight to your door or event.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>View all services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid: Scrollable horizontally on mobile/tablet, 5-col grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {serviceCategories.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.href}
                onClick={(e) => handleCardClick(service, e)}
                className={`group flex flex-col justify-between p-4 sm:p-5 rounded-3xl ${service.bgLight} border ${service.borderColor} transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 shrink-0 w-[240px] sm:w-auto`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border ${
                      service.isLive 
                        ? 'bg-white/80 text-neutral-800 border-neutral-200/50' 
                        : 'bg-orange-100 text-orange-800 border-orange-200'
                    }`}>
                      {service.badge}
                    </span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-black ${service.textColor} mb-1`}>
                    {service.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-medium line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-neutral-800 group-hover:text-emerald-700">
                  <span>{service.isLive ? 'Get Started' : 'Coming Soon'}</span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-800" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}