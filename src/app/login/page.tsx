'use client';

import React, { useState, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const getRedirectUrl = (user: { role: string; status?: string }): string => {
  switch (user.role) {
    case 'CUSTOMER':
      return '/dashboard';
    case 'RIDER':
      return user.status === 'PENDING_VERIFICATION' || user.status === 'PENDING'
        ? '/rider/onboarding'
        : '/rider/dashboard';
    case 'MERCHANT':
      return user.status === 'PENDING_VERIFICATION'
        ? '/merchant/onboarding'
        : '/merchant/dashboard';
    case 'ORGANIZER':
      return user.status === 'PENDING_VERIFICATION'
        ? '/organizer/onboarding'
        : '/organizer/dashboard';
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

const OnboardingLinks = [
  { href: '/customer-onboarding', label: 'Customer', iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { href: '/apply', label: 'Rider', iconPath: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
  { href: '/merchant-signup', label: 'Merchant', iconPath: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.621 1.62a3.004 3.004 0 01-.621 4.72m-13.5 0h13.5' },
  { href: '/organizer', label: 'Organizer', iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z' }
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_, startTransition] = useTransition();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: identifier,
        passwordRaw: password,
      });

      const user = res.data.user;
      const token = res.data.access_token || res.data.token;

      if (!token || !user) {
        throw new Error('Incomplete session payload returned from server.');
      }

      login(token, user);
      
      const destination = getRedirectUrl(user);
      startTransition(() => {
        router.push(destination);
        router.refresh();
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password.'
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome Back!</h2>
        <p className="mt-1 text-sm text-zinc-500">Login to continue</p>
      </div>

      {registered && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-700 font-medium text-center">
          Account created successfully! Please login.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Email or Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </span>
            <input 
              type="text" 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone number" 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-2.25 10.5h13.5c1.125 0 2.25-1.125 2.25-2.25v-6.75c0-1.125-1.125-2.25-2.25-2.25H5.25c-1.125 0-2.25 1.125-2.25 2.25v-6.75C3 11.625 4.125 10.5 5.25 10.5Z" /></svg>
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-12 py-3.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer" 
            />
            <span className="text-xs text-zinc-600 font-medium">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 text-sm tracking-wide transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-50 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #a7f3d0 0%, transparent 50%)' }} />
        
        <div className="z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-emerald-700 text-white p-2.5 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Aviorè Go</h1>
          </div>

          <div className="relative w-80 h-80 mx-auto mb-8">
            <Image 
              src="/images/logo.png" 
              alt="Delivery Rider"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Fast, Reliable Deliveries</h2>
          <p className="text-zinc-600 leading-relaxed">
            Join thousands of users, riders, and vendors making logistics seamless. Whether you're sending a package, selling items, or organizing events, Aviorè Go has you covered.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4 text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">Aviorè Go</span>
            </div>
            <div className="w-48 h-32 relative">
               <Image 
                src="/images/logo.png" 
                alt="Delivery Rider"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
          }>
            <LoginFormContent />
          </Suspense>

          <div className="flex items-center gap-3 my-8">
            <div className="h-px w-full bg-zinc-200"></div>
            <span className="text-xs text-zinc-400 font-medium lowercase">or</span>
            <div className="h-px w-full bg-zinc-200"></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-zinc-500 mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {OnboardingLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="flex flex-col items-center text-center rounded-xl border border-zinc-200 bg-white p-3 hover:border-emerald-600 hover:bg-emerald-50 transition group cursor-pointer relative z-10"
                >
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition mb-1.5 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 pointer-events-none">
                      <path strokeLinecap="round" strokeLinejoin="round" d={link.iconPath} />
                    </svg>
                  </div>
                  <span className="block text-[11px] font-bold text-zinc-800 group-hover:text-emerald-700 transition pointer-events-none">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}