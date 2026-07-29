'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('Transactions');
  
  const [stats, setStats] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadFinanceData(signal?: AbortSignal) {
    try {
      setLoading(true);
      const [statsRes, txRes, wdRes] = await Promise.all([
        api.get('/admin/finances/overview', { signal }),
        api.get('/admin/finances/transactions', { signal }),
        api.get('/admin/finances/withdrawals', { signal })
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (txRes.data) setTransactions(txRes.data);
      if (wdRes.data) setWithdrawals(wdRes.data);
    } catch (err: any) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Failed syncing system ledger matrices:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadFinanceData(controller.signal);

    return () => controller.abort();
  }, []);

  async function handleInstantApproval(id: string) {
    try {
      await api.patch(`/admin/finances/withdrawals/${id}/approve`);
      // Hot-reload components states securely
      await loadFinanceData();
    } catch (err: any) {
      console.error('Failed to approve withdrawal:', err);
      alert(err?.response?.data?.message || 'Disbursement validation error occurred.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-black uppercase tracking-tight">Finances</h2>
        <Link href="/admin/finances/withdrawals" className="text-[10px] font-black uppercase underline text-neutral-900">
          View All Requests
        </Link>
      </div>

      {/* Stats Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && stats.length === 0 ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 animate-pulse h-24" />
          ))
        ) : (
          stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black mt-1 text-neutral-950 font-mono">{s.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Tab Controls Navigation */}
      <div className="flex gap-4 border-b border-neutral-200">
        {['Transactions', 'Pending Withdrawals'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[10px] font-black uppercase tracking-wide transition-all ${
              activeTab === tab ? 'border-b-2 border-neutral-950 text-neutral-950' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conditional Interface Elements Grid */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-neutral-400 uppercase tracking-widest animate-pulse">
            Streaming structural transactions matrix logs...
          </div>
        ) : activeTab === 'Transactions' ? (
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-[10px] font-black uppercase text-neutral-400">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Entity</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-xs font-mono text-neutral-400 uppercase">
                    No transactions documented.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="text-sm hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-mono text-neutral-500 text-xs">{tx.reference}</td>
                    <td className="p-4 font-bold text-neutral-800">{tx.user}</td>
                    <td className={`p-4 text-right font-black font-mono ${tx.isCredit ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="divide-y divide-neutral-100">
            {withdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-neutral-400 uppercase tracking-wider">
                No active pending payouts found.
              </div>
            ) : (
              withdrawals.map((w) => (
                <div key={w.id} className="p-4 flex justify-between items-center hover:bg-neutral-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{w.user}</p>
                    <p className="text-[9px] font-mono text-neutral-400 uppercase">{w.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-red-600 font-mono">{w.amount}</span>
                    <button 
                      onClick={() => handleInstantApproval(w.id)}
                      className="px-3 py-1.5 bg-neutral-950 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-neutral-800 shadow-sm transition-all"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}