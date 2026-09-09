'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicMarketingPage from './publicmarketing/page';

export default function RootGatekeeper() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aviore_token');
    const storedUser = localStorage.getItem('aviore_user');
    const savedLocation = localStorage.getItem('aviore_app_location');

    // 1. If an active session exists, route by role
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        switch (user.role) {
          case 'CUSTOMER':
            router.replace('/dashboard');
            return;
          case 'RIDER':
            router.replace('/rider/dashboard');
            return;
          case 'BUSINESS_OWNER':
            router.replace('/business/home');
            return;
          case 'ORGANIZER':
            router.replace('/organizer/home');
            return;
          case 'ADMIN':
          case 'SUPER_ADMIN':
            router.replace('/admin/dashboard');
            return;
          default:
            break;
        }
      } catch (e) {
        console.error('Session check failed:', e);
      }
    }

    // 2. If no active session, but app location hasn't been selected yet, send them to location setup first
    if (!savedLocation) {
      router.replace('/location');
      return;
    }

    // 3. Otherwise, let them see the public/customer marketing page
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <PublicMarketingPage />;
}