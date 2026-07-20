'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/admin/analytics/summary`);
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } catch (err) {
        console.error('Failed compiling matrix data streams:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [BACKEND_URL]);

  if (loading || !reportData) {
    return (
      <div className="text-xs text-center font-mono p-24 text-neutral-400 uppercase tracking-widest animate-pulse">
        Compiling analytical intelligence summaries...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950">Analytics & Intelligence</h2>

      {/* Financial Matrix Summary Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Shipments', val: reportData.monthlySummary.totalShipmentsGenerated },
          { label: 'GTV Volume', val: `₦${reportData.monthlySummary.grossTransactionVolume.toLocaleString()}` },
          { label: 'Platform Share', val: `₦${reportData.monthlySummary.netPlatformEarnings.toLocaleString()}` },
          { label: 'Rider Payouts', val: `₦${reportData.monthlySummary.riderPayoutAllocations.toLocaleString()}` },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-sm">
            <span className="text-[9px] font-black font-mono text-neutral-400 uppercase tracking-wider">{item.label}</span>
            <p className="text-lg font-black font-mono mt-1 text-neutral-900">{item.val}</p>
          </div>
        ))}
      </div>

      {/* 1. Time-Series Revenue Chart */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <h3 className="text-[10px] font-black uppercase text-neutral-400 mb-6 tracking-wider">Revenue Trend (7-Day Metric Window)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportData.chartData}>
              <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontWeight: 'bold' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontWeight: 'bold' }} tickFormatter={(val) => `₦${val >= 1000 ? (val / 1000) + 'k' : val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', fontFamily: 'monospace', fontSize: '11px' }}
                formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Platform Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2.5} fill="#f5f5f5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Three-Column Leaderboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Cities Distribution */}
        <Leaderboard title="Top Cities" data={reportData.topCities} />

        {/* Top Riders Gamification Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-[10px] text-neutral-400 mb-4 tracking-wider">Top Rider</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-950 rounded-full text-white flex items-center justify-center font-black text-sm tracking-tighter">
                {reportData.gamificationLeaderboards.riderOfTheMonth?.name?.slice(0, 2).toUpperCase() || 'RM'}
              </div>
              <div>
                <p className="font-black text-sm text-neutral-900">{reportData.gamificationLeaderboards.riderOfTheMonth?.name}</p>
                <p className="text-[10px] text-neutral-500 font-bold font-mono uppercase mt-0.5">
                  {reportData.gamificationLeaderboards.riderOfTheMonth?.tripsCompletedCount} Trips Completed
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono truncate">
            {reportData.gamificationLeaderboards.riderOfTheMonth?.email}
          </div>
        </div>

        {/* Customer Segments Card */}
        <div className="bg-neutral-950 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-black uppercase text-[10px] text-neutral-500 mb-4 tracking-wider">Top Customer Profile</h3>
            <div className="space-y-4">
              <CustomerRow 
                label="Highest Contributor" 
                value={reportData.gamificationLeaderboards.highestSpendingCustomer?.name || 'No Data'} 
              />
              <div className="border-t border-neutral-800 pt-3">
                <p className="text-[9px] uppercase text-neutral-400 font-bold tracking-wide">Total Invested Volume</p>
                <p className="font-black text-sm text-green-400 font-mono mt-0.5">
                  ₦{Number(reportData.gamificationLeaderboards.highestSpendingCustomer?.totalCapitalSpent || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono truncate">
            {reportData.gamificationLeaderboards.highestSpendingCustomer?.email}
          </div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ title, data }: { title: string; data: string[] }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
      <h3 className="font-black uppercase text-[10px] text-neutral-400 mb-4 tracking-wider">{title}</h3>
      <div className="space-y-2">
        {data.map((city, i) => (
          <div key={city} className="flex justify-between items-center py-1 border-b border-neutral-50 last:border-0">
            <p className="font-bold text-sm text-neutral-800">
              <span className="font-black text-neutral-400 font-mono mr-1.5">{i + 1}.</span> {city}
            </p>
            <span className="text-[9px] bg-neutral-100 text-neutral-600 font-bold font-mono px-2 py-0.5 rounded-md uppercase">Active Hub</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase text-neutral-400 font-bold tracking-wide">{label}</p>
      <p className="font-black text-sm text-white mt-0.5">{value}</p>
    </div>
  );
}