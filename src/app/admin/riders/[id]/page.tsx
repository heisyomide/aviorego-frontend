'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface RiderDetail {
  id: string;
  name: string;
  status: string;
  vehicle: string;
  wallet: string;
  stats: { total: number; rating: number };
  kyc: { nin: string; license: string; selfie: string };
}

export default function RiderProfilePage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const { id } = useParams();
  
  const [rider, setRider] = useState<RiderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchRiderProfile() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        const res = await fetch(`${BACKEND_URL}/admin/riders/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Profile retrieval failed with status code: ${res.status}`);
        }

        const data = await res.json();
        setRider(data);
      } catch (err: any) {
        console.error('Fatal retrieval crash from operational logs:', err);
        setErrorMessage(err.message || 'Network connection failed processing database query.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRiderProfile();
  }, [id, BACKEND_URL]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono uppercase tracking-widest text-neutral-400 animate-pulse">
        Mounting operational records ledger...
      </div>
    );
  }

  if (errorMessage || !rider) {
    return (
      <div className="space-y-4 p-6 text-center">
        <div className="text-xs font-mono uppercase text-red-500">
          ⚠️ {errorMessage || 'Rider profile tracking match could not be parsed.'}
        </div>
        <Link href="/admin/riders" className="inline-block text-xs font-black uppercase text-neutral-950 underline">
          Return to Fleet Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Navigation breadcrumb link */}
      <div>
        <Link href="/admin/riders" className="text-[10px] font-black uppercase text-neutral-400 hover:text-neutral-950 transition-colors duration-150">
          ← Back to Fleet Registry
        </Link>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-neutral-950">{rider.name}</h2>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">{rider.vehicle}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
          rider.status === 'Online' 
            ? 'bg-green-50 text-green-600 border border-green-100' 
            : 'bg-neutral-100 text-neutral-500'
        }`}>
          {rider.status}
        </span>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Metric label="Deliveries" value={rider.stats.total.toString()} />
        <Metric label="Rating" value={`★ ${rider.stats.rating}`} />
      </div>

      {/* KYC & Verification Details */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-4 shadow-sm">
        <h3 className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Verification Data</h3>
        <InfoRow label="NIN" value={rider.kyc.nin} />
        <InfoRow label="License" value={rider.kyc.license} />
        <InfoRow label="Selfie Check" value={rider.kyc.selfie} />
      </div>

      {/* Wallet Section */}
      <div className="bg-neutral-950 text-white p-6 rounded-3xl flex justify-between items-center shadow-md">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase font-black tracking-wider">Wallet Balance</p>
          <p className="text-2xl font-black font-mono tracking-tight">{rider.wallet}</p>
        </div>
      </div>

      {/* Operations Panel */}
      <div className="grid grid-cols-2 gap-3">
        <ActionButton label="Message" color="bg-neutral-100 text-neutral-800 hover:bg-neutral-200" />
        <ActionButton label="Suspend" color="bg-amber-600 text-white hover:bg-amber-700" />
        <ActionButton label="Approve" color="bg-green-600 text-white hover:bg-green-700" />
        <ActionButton label="Ban Rider" color="bg-red-600 text-white hover:bg-red-700" />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-neutral-200 text-center shadow-sm">
      <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">{label}</p>
      <p className="text-lg font-black text-neutral-900">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-neutral-50 pb-2 items-center">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-xs font-bold font-mono text-neutral-900">{value}</p>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`${color} py-4 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-150 shadow-sm`}
    >
      {label}
    </button>
  );
}