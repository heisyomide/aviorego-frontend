'use client';

import {
  useEffect,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  useAuth,
} from '../context/AuthContext';

export function useProtectedRoute(
  allowedRoles?: string[],
) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) return;

    /**
     * No session
     */
    if (!user) {
      router.replace('/login');
      return;
    }

    /**
     * Invalid role
     */
    if (
      allowedRoles &&
      !allowedRoles.includes(
        user.role,
      )
    ) {
      router.replace(
        '/unauthorized',
      );
    }
  }, [
    user,
    loading,
    allowedRoles,
    router,
  ]);

  return {
    user,
    loading,
  };
}