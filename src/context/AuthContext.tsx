'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  phone?: string;
  phoneNumber?: string;
  lastName: string;
  role:
    | 'CUSTOMER'
    | 'RIDER'
    | 'BUSINESS_OWNER'
    | 'ORGANIZER'
    | 'ADMIN'
    | 'SUPER_ADMIN';

  status: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    token: string,
    user: User,
  ) => void;

  updateUser: (user: Partial<User>) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const storedToken =
      localStorage.getItem('aviore_token');

    const storedUser =
      localStorage.getItem('aviore_user');

    if (storedToken && storedUser) {
      setToken(storedToken);

      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    setLoading(false);
  }, []);

const login = (
    token: string,
    user: User,
  ) => {
    localStorage.setItem('aviore_token', token);
    localStorage.setItem('aviore_user', JSON.stringify(user));

    // 🌟 CRITICAL: Set cookies for Next.js Middleware to read
    document.cookie = `aviore_token=${token}; path=/; max-age=86400; SameSite=Strict`;
    document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Strict`;

    setToken(token);
    setUser(user);
  };

  const updateUser = (partialUser: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...partialUser };
      localStorage.setItem('aviore_user', JSON.stringify(updated));
      return updated;
    });
  };
const logout = () => {
    localStorage.removeItem('aviore_token');
    localStorage.removeItem('aviore_user');

    // 🌟 Clear cookies on logout
    document.cookie = 'aviore_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';

    setToken(null);
    setUser(null);

    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}