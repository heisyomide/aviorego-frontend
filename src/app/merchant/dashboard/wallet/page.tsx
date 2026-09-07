"use client";

import React, { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, CheckCircle2, ShieldCheck, Search, X, Loader2 } from "lucide-react";
import { api } from "@/src/lib/api";

export default function MerchantWalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Withdrawal modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        api.get('/merchant/dashboard/wallet'),
        api.get('/merchant/dashboard/transactions'),
      ]);
      setWallet(walletRes.data);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error("Failed to load wallet data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/flutterwave/withdraw', {
        amount: parseFloat(amount),
        bankCode,
        accountNumber,
      });

      setIsModalOpen(false);
      setAmount("");
      setBankCode("");
      setAccountNumber("");
      fetchWalletData();
    } catch (err) {
      console.error("Withdrawal failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const availableBalance = wallet?.availableBalance ?? 0;

  if (loading && !wallet) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header matching Prototype */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Wallet</h1>
        <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm cursor-pointer hover:bg-neutral-50">
          <Search size={18} />
        </div>
      </div>

      {/* Main Available Balance Card matching Prototype */}
      <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-100">Available Balance</span>
          <h3 className="text-3xl font-black font-mono">₦{Number(availableBalance).toLocaleString()}</h3>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
        >
          Withdraw
        </button>
      </div>

      {/* Stats Breakdown Row matching Prototype */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-neutral-200/80 p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Today's Earnings</span>
          <h4 className="text-base font-black text-neutral-950 font-mono">₦{Number(wallet?.todayEarnings || 0).toLocaleString()}</h4>
          <span className="text-[10px] text-emerald-600 font-bold block">{wallet?.earningsGrowth || "+0%"}</span>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Pending Balance</span>
          <h4 className="text-base font-black text-neutral-950 font-mono">₦{Number(wallet?.pendingBalance || 0).toLocaleString()}</h4>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Total Earned</span>
          <h4 className="text-base font-black text-neutral-950 font-mono">₦{Number(wallet?.totalEarned || 0).toLocaleString()}</h4>
          <span className="text-[9px] text-neutral-400 block">This Month</span>
        </div>
      </div>

      {/* Recent Transactions List matching Prototype */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-neutral-950">Recent Transactions</h3>
          <button className="text-xs font-bold text-emerald-600 hover:underline">See all</button>
        </div>
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-6 text-xs text-neutral-400 font-medium">
              No recent transactions recorded.
            </div>
          ) : (
            transactions.map((tx: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-neutral-900 block">{tx.type}</span>
                  <span className="text-[10px] font-mono text-neutral-400 block">{tx.date}</span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                    {tx.amount > 0 ? `+₦${Number(tx.amount).toLocaleString()}` : `-₦${Math.abs(Number(tx.amount)).toLocaleString()}`}
                  </span>
                  <span className="block text-[10px] font-bold text-neutral-500 pt-0.5">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-neutral-950">Withdraw Funds</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Amount (₦)</label>
                <input 
                  type="number" 
                  required
                  max={availableBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to withdraw" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Bank Code</label>
                <input 
                  type="text" 
                  required
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  placeholder="e.g. 058 (GTB)" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Account Number</label>
                <input 
                  type="text" 
                  required
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0123456789" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}