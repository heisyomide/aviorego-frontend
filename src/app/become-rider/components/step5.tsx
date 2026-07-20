'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Fingerprint, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Step5Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onResolveBank: (accountNum: string, bankCode: string) => Promise<void> | void;
  onNext: () => void;
  onBack: () => void;
}

// Map the bank codes back to readable names so we can store both in the database schema!
const BANK_NAMES: { [key: string]: string } = {
  "058": "GTBank",
  "044": "Access Bank",
  "999992": "Opay",
  "50211": "Kuda Bank"
};

export default function Step5FinancialSettlement({ 
  formData, 
  updateField, 
  onResolveBank, 
  onNext, 
  onBack 
}: Step5Props) {
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionError, setResolutionError] = useState('');

  // 🌟 Trigger lookup whenever accountNumber or the explicit bankCode satisfies the criteria
  useEffect(() => {
    const triggerResolution = async () => {
      if (formData.accountNumber?.length === 10 && formData.bankCode) {
        setIsResolving(true);
        setResolutionError('');
        updateField('accountName', ''); 

        try {
          await onResolveBank(formData.accountNumber, formData.bankCode);
        } catch (error: any) {
          console.error("--- Bank Routing Proxy Exception ---", error);
          setResolutionError(
            error.response?.status === 404
              ? 'Verification gateway unavailable (Endpoint misconfigured).'
              : 'Unable to verify account details. Please cross-check entries.'
          );
        } finally {
          setIsResolving(false);
        }
      } else {
        if (formData.accountName) updateField('accountName', '');
        setResolutionError('');
      }
    };

    triggerResolution();
  }, [formData.accountNumber, formData.bankCode]); // 🌟 Now correctly watches bankCode

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    updateField('accountNumber', cleanValue);
  };

  // 🌟 Handle selection safely mapping both fields into state
  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = BANK_NAMES[code] || '';
    
    updateField('bankCode', code); // Sets "044" -> fixes the 400 Bad Request
    updateField('bankName', name); // Sets "Access Bank" -> matches your DB schema field
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.accountName) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Target Settlement Institution Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Settlement Bank</label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400"><Landmark className="h-4 w-4" /></span>
          <select 
            required 
            value={formData.bankCode || ''} // 🌟 Binds cleanly to bankCode
            onChange={handleBankChange} // 🌟 Handles double data property mapping
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          >
            <option value="">Select Target Institution</option>
            <option value="058">GTBank</option>
            <option value="044">Access Bank</option>
            <option value="999992">Opay</option>
            <option value="50211">Kuda Bank</option>
          </select>
        </div>
      </div>

      {/* Account Number Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Account Number</label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400"><Fingerprint className="h-4 w-4" /></span>
          <input 
            type="text" 
            maxLength={10} 
            required 
            placeholder="10 digit NUBAN number"
            value={formData.accountNumber || ''} 
            onChange={handleAccountNumberChange} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      {/* Dynamic Account Holder Status Input Display */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Account Holder Confirmation</label>
        <div className="relative flex items-center">
          <input 
            type="text" 
            disabled 
            readOnly 
            placeholder={isResolving ? "Querying interbank ledger records..." : "Awaiting verification lookups..."} 
            value={formData.accountName || ''} 
            className={`w-full rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none tracking-wide transition duration-200 ${
              formData.accountName 
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                : 'bg-zinc-100 border-zinc-200 text-zinc-500'
            }`} 
          />
          <div className="absolute right-4">
            {isResolving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
            {!isResolving && formData.accountName && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          </div>
        </div>
      </div>

      {/* Localized Step Warning Alert Banner */}
      {resolutionError && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <span className="font-medium tracking-wide">{resolutionError}</span>
        </div>
      )}

      {/* Navigation Buttons Row */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <button 
          type="button" 
          onClick={onBack} 
          disabled={isResolving}
          className="rounded-xl border border-zinc-200 text-zinc-700 py-3 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50 transition cursor-pointer"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isResolving || !formData.accountName} 
          className="col-span-2 rounded-xl bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer"
        >
          Continue
        </button>
      </div>
    </form>
  );
}