'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/lib/api';

interface Shipment {
  id: string;
  recipient: string;
  destination: string;
  status: 'Active' | 'In Transit' | 'Delivered';
  date: string;
}

export default function CustomerDashboardOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ active: 0, inTransit: 0, delivered: 0 });
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [statsResult, recentResult] = await Promise.allSettled([
          api.get('/shipments/dashboard-stats'),
          api.get('/shipments/recent'),
        ]);

        if (statsResult.status === 'fulfilled') {
          setStats(statsResult.value.data || { active: 0, inTransit: 0, delivered: 0 });
        } else {
          console.warn('Stats load failed:', statsResult.reason);
        }

        if (recentResult.status === 'fulfilled') {
          setRecentShipments(recentResult.value.data || []);
        } else {
          console.warn('Recent shipments load failed:', recentResult.reason);
        }
      } catch (error) {
        console.error('Dashboard Sync Failed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const filteredShipments = recentShipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-sm font-mono p-6">Syncing engine...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-neutral-950 tracking-tight">
            Good morning
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Welcome to your Aviorè dashboard overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/shipment/create"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Create Shipment
          </Link>
        </div>
      </div>

      <div className="max-w-2xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search shipment..."
          className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-xs font-mono shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm">
          <p className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider font-bold">
            Active
          </p>
          <p className="text-3xl font-black text-neutral-950 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm">
          <p className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider font-bold">
            In Transit
          </p>
          <p className="text-3xl font-black text-neutral-950 mt-1">{stats.inTransit}</p>
        </div>
        <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm">
          <p className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider font-bold">
            Delivered
          </p>
          <p className="text-3xl font-black text-green-600 mt-1">{stats.delivered}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black text-neutral-950 uppercase font-mono tracking-wider">
          Recent Shipments
        </h2>
        <div className="space-y-2">
          {filteredShipments.length === 0 ? (
            <p className="text-xs text-neutral-400 font-mono p-4 bg-white border border-dashed border-neutral-200 rounded-xl">
              No recent shipments recorded.
            </p>
          ) : (
            filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="bg-white border border-neutral-200 p-4 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-mono font-black">{shipment.id}</p>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(
                      shipment.status
                    )}`}
                  >
                    {shipment.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-700">
                  To: {shipment.recipient}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}