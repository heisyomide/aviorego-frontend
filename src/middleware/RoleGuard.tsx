'use client';

import React, {
  ReactNode,
  useEffect,
} from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '../context/AuthContext';
import AuthLoader from '../components/AuthLoader';

interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
}

export default function RoleGuard({
  children,
  roles,
}: RoleGuardProps) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) return;

    // User is not authenticated
    if (!user) {
      router.replace('/login');
      return;
    }

    // User doesn't have permission
    if (!roles.includes(user.role)) {
      router.replace('/unauthorized');
    }
  }, [
    loading,
    user,
    roles,
    router,
  ]);

  // Show loading screen while restoring session
  if (loading) {
    return <AuthLoader />;
  }

  // Prevent rendering while redirecting
  if (!user) {
    return null;
  }

  // Prevent rendering while redirecting
  if (!roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}