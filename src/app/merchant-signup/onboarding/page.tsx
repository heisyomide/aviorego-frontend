'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function MerchantOnboardingStepper() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Form payload states
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    cuisineType: 'GENERAL',
    phone: '',
    address: '',
    latitude: 9.0765,
    longitude: 7.3986,
    accountNumber: '',
    accountName: '',
    bankName: '',
    itemName: '',
    itemPrice: 0,
    itemCategory: 'Main',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/merchant/onboarding/profile');
      const currentStep = res.data.onboardingStep || 1;
      setStep(currentStep);
      setFormData(prev => ({
        ...prev,
        businessName: res.data.businessName || '',
      }));
    } catch (err) {
      console.error('Failed to load merchant profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (step === 1) {
        await api.patch('/merchant/onboarding/step-1', {
          businessName: formData.businessName,
          description: formData.description,
          cuisineType: formData.cuisineType,
          phone: formData.phone,
        });
        setStep(2);
      } else if (step === 2) {
        await api.patch('/merchant/onboarding/step-2', {
          address: formData.address,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        });
        // Auto-handle default hours & empty branding for smooth stepper flow
        await api.patch('/merchant/onboarding/step-3', {
          hours: [{ dayOfWeek: 'MONDAY', openingTime: '08:00', closingTime: '20:00', isClosed: false }]
        });
        await api.patch('/merchant/onboarding/step-4', {});
        setStep(5);
      } else if (step === 5) {
        await api.patch('/merchant/onboarding/step-5', {
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          bankName: formData.bankName,
        });
        setStep(6);
      } else if (step === 6) {
        await api.patch('/merchant/onboarding/step-6', {
          foodItem: {
            name: formData.itemName,
            price: Number(formData.itemPrice),
            category: formData.itemCategory,
            prepTimeMinutes: 15,
          }
        });
        router.push('/merchant/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update onboarding step.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">Loading onboarding...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
          <h1 className="text-xl font-bold text-zinc-900">Merchant Setup</h1>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Step {step > 4 ? step - 2 : step} of 4
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleNextStep} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Business Name</label>
                <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Store Description</label>
                <input type="text" name="description" required value={formData.description} onChange={handleChange} placeholder="Briefly describe what you sell" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="08000000000" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Street Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Enter physical store location" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Bank Name</label>
                <input type="text" name="bankName" required value={formData.bankName} onChange={handleChange} placeholder="e.g., Guaranty Trust Bank" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Account Number</label>
                <input type="text" name="accountNumber" required value={formData.accountNumber} onChange={handleChange} placeholder="0123456789" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Account Name</label>
                <input type="text" name="accountName" required value={formData.accountName} onChange={handleChange} placeholder="Business or Owner Name" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">First Menu Item / Product Name</label>
                <input type="text" name="itemName" required value={formData.itemName} onChange={handleChange} placeholder="e.g., Jollof Rice Combo" className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Price</label>
                <input type="number" name="itemPrice" required value={formData.itemPrice} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
              </div>
            </>
          )}

          <button type="submit" disabled={submitting} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50">
            {submitting ? 'Saving...' : step === 6 ? 'Complete Onboarding' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}