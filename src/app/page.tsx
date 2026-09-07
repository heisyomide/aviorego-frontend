// app/page.tsx (The Root Gatekeeper)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicMarketingPage from './publicmarketing/page'; // or import your public components here

export default function RootGatekeeper() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aviore_token');
    const storedUser = localStorage.getItem('aviore_user');

    if (!token || !storedUser) {
      setIsChecking(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      switch (user.role) {
        case 'CUSTOMER':
          router.replace('/dashboard');
          break;
        case 'RIDER':
          router.replace('/rider/dashboard');
          break;
        case 'BUSINESS_OWNER':
          router.replace('/business/home');
          break;
        case 'ORGANIZER':
          router.replace('/organizer/home');
          break;
        case 'ADMIN':
        case 'SUPER_ADMIN':
          router.replace('/admin/dashboard');
          break;
        default:
          setIsChecking(false);
      }
    } catch (e) {
      console.error('Session check failed:', e);
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <PublicMarketingPage />;
}