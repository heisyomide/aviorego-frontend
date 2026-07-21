'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../lib/api'; // Adjust path based on your structure
import { useAuth } from '../../context/AuthContext'; // 🌟 Added Auth Context hook import

// 1. Move the interactive login form elements here so they can safely read query params
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const { login } = useAuth(); // 🌟 Destructured login method from Context

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate with backend matching your NestJS DTO expectations 🌟
      const res = await api.post('/auth/login', {
        email: identifier,         // 🌟 Map 'identifier' state to 'email' field
        passwordRaw: password,     // 🌟 Map 'password' state to 'passwordRaw' field
      });

      const { user, access_token } = res.data; // Note: Destructure access_token matching your AuthService signature

      // 🌟 FIX: Trigger global state login session so RoleGuards see the session values
      if (access_token && user) {
        login(access_token, user);
      } else {
        throw new Error('Incomplete session payload returned from server.');
      }
      
      // 2. Intelligent Routing based on Role & Status
      if (user.role === 'CUSTOMER') {
        router.push('/dashboard');
      } else if (user.role === 'RIDER') {
        if (user.status === 'PENDING_VERIFICATION' || user.status === 'PENDING') {
          router.push('/rider/onboarding'); 
        } else if (user.status === 'APPROVED' || user.status === 'VERIFIED') {
          router.push('/rider/dashboard');
        } else {
          router.push('/rider/dashboard'); // Fallback route
        }
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Titles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome Back!</h2>
        <p className="mt-1 text-sm text-zinc-500">Login to continue</p>
      </div>

      {/* Success Banner (If redirected from registration) */}
      {registered && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-700 font-medium text-center">
          Account created successfully! Please login.
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600 font-medium text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Identifier (Email/Phone) */}
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

        {/* Password */}
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

        {/* Remember Me & Forgot Password Row */}
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

        {/* Submit Button */}
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

// 2. Main Page Layout Wrapper
export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      
      {/* DESKTOP LEFT COLUMN: Marketing & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-50 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #a7f3d0 0%, transparent 50%)' }} />
        
        <div className="z-10 text-center max-w-md">
          {/* Large Desktop Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-emerald-700 text-white p-2.5 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Aviorè Go</h1>
          </div>

          {/* Desktop Illustration Placeholder */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <Image 
              src="/images/delivery-illustration.svg" 
              alt="Delivery Rider"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Fast, Reliable Deliveries</h2>
          <p className="text-zinc-600 leading-relaxed">
            Join thousands of users and riders making logistics seamless. Whether you're sending a package or earning on the go, Aviorè Go has you covered.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN / MOBILE CENTER: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          
          {/* MOBILE HEADER: Shows only on mobile */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4 text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">Aviorè Go</span>
            </div>
            {/* Mobile Illustration */}
            <div className="w-48 h-32 relative">
               <Image 
                src="/images/delivery-illustration-mobile.svg" 
                alt="Delivery Rider"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* 🌟 Wrapped form logic inside Suspense to fix the prerender crash */}
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
          }>
            <LoginFormContent />
          </Suspense>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="h-px w-full bg-zinc-200"></div>
            <span className="text-xs text-zinc-400 font-medium lowercase">or</span>
            <div className="h-px w-full bg-zinc-200"></div>
          </div>

          {/* Registration Section */}
          <div className="text-center">
            <p className="text-sm text-zinc-500 mb-4">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Register Customer Card */}
              <Link href="/customer-onboarding" className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 hover:border-emerald-600 hover:bg-emerald-50 transition group cursor-pointer">
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-zinc-800 group-hover:text-emerald-700 transition">Register as</span>
                  <span className="block text-[11px] text-zinc-500 group-hover:text-emerald-600 transition">Customer</span>
                </div>
              </Link>

              {/* Register Rider Card */}
              <Link href="/become-rider" className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 hover:border-emerald-600 hover:bg-emerald-50 transition group cursor-pointer">
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-zinc-800 group-hover:text-emerald-700 transition">Register as</span>
                  <span className="block text-[11px] text-zinc-500 group-hover:text-emerald-600 transition">Rider</span>
                </div>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}