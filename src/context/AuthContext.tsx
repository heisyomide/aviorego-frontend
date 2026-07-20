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
  lastName: string;
  role:
    | 'CUSTOMER'
    | 'RIDER'
    | 'BUSINESS_OWNER'
    | 'ADMIN'
    | 'SUPER_ADMIN';

  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    token: string,
    user: User,
  ) => void;

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

  /**
   * Restore session
   */
  useEffect(() => {
    const storedToken =
      localStorage.getItem('aviore_token');

    const storedUser =
      localStorage.getItem('aviore_user');

    if (storedToken && storedUser) {
      setToken(storedToken);

      setUser(
        JSON.parse(storedUser),
      );
    }

    setLoading(false);
  }, []);

  /**
   * Login
   */
  const login = (
    token: string,
    user: User,
  ) => {
    localStorage.setItem(
      'aviore_token',
      token,
    );

    localStorage.setItem(
      'aviore_user',
      JSON.stringify(user),
    );

    setToken(token);
    setUser(user);
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem(
      'aviore_token',
    );

    localStorage.removeItem(
      'aviore_user',
    );

    setToken(null);
    setUser(null);

    window.location.href =
      '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
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