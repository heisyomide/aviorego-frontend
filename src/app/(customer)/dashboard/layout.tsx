'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'CUSTOMER') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  const isActive = (route: string) => {
    if (route === '/dashboard') return pathname === route;
    return pathname.startsWith(route);
  };

  if (loading || !user || user.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950 font-sans flex flex-col justify-between antialiased">
      
      {/* Main Workspace Frame - Zero top padding so HeroBanner touches the top edge */}
      <main className="flex-1 w-full pt-0 pb-28">
        {children}
      </main>

      {/* Persistent Sticky Bottom Tab Bar (Mobile/App View) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] max-w-lg mx-auto sm:rounded-t-3xl sm:border-x">
        <div className="flex items-center justify-around">
          
          <Link href="/dashboard" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${isActive('/dashboard') && !isActive('/dashboard/shipment') && !isActive('/dashboard/events') && !isActive('/dashboard/wallet') && !isActive('/dashboard/profile') ? 'text-emerald-600 font-black' : 'text-neutral-400 hover:text-neutral-900'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          <Link href="/dashboard/shipment" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${isActive('/dashboard/shipment') ? 'text-emerald-600 font-black' : 'text-neutral-400 hover:text-neutral-900'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
            <span className="text-[10px] tracking-tight">Shipment</span>
          </Link>

          <Link href="/dashboard/events" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${isActive('/dashboard/events') ? 'text-emerald-600 font-black' : 'text-neutral-400 hover:text-neutral-900'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
            <span className="text-[10px] tracking-tight">Events</span>
          </Link>

          <Link href="/dashboard/wallet" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${isActive('/dashboard/wallet') ? 'text-emerald-600 font-black' : 'text-neutral-400 hover:text-neutral-900'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v3" /></svg>
            <span className="text-[10px] tracking-tight">Wallet</span>
          </Link>

          <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${isActive('/dashboard/profile') ? 'text-emerald-600 font-black' : 'text-neutral-400 hover:text-neutral-900'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            <span className="text-[10px] tracking-tight">Profile</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}