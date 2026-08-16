'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Navigation, 
  Users, 
  Bus, 
  ShieldCheck, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell
} from 'lucide-react';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/events/dashboard', icon: LayoutDashboard },
    { label: 'Events', href: '/events/dashboard/events', icon: Calendar },
    { label: 'Trips', href: '/events/trips', icon: Navigation },
    { label: 'Passengers', href: '/events/passengers', icon: Users },
    { label: 'Vehicles', href: '/events/vehicles', icon: Bus },
    { label: 'Drivers', href: '/events/drivers', icon: ShieldCheck },
   { label: 'Notifications', href: '/events/notifications', icon: Bell },
    { label: 'Reports', href: '/events/reports', icon: BarChart3 },
    { label: 'Settings', href: '/events/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-neutral-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0e131f] border-r border-neutral-800/60 hidden md:flex flex-col p-6 sticky top-0 h-screen justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-neutral-950 p-2 rounded-xl font-black">
              <Navigation className="h-5 w-5 fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Aviorè<span className="text-emerald-500">Go</span></span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-medium text-xs transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navigation Bar */}
        <header className="h-20 border-b border-neutral-800/60 bg-[#0e131f]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-white tracking-tight">Ibadan Summer Festival</h1>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Event
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300">
              🔔
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
              <div className="text-right">
                <span className="block text-xs font-bold text-white">{user?.firstName || 'Grace Events'}</span>
                <span className="block text-[10px] text-neutral-400 font-mono">Organizer</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                GE
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}