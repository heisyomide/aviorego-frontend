'use client';

import { useState } from 'react';

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
}

export default function VerificationModal({
  open,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [pin, setPin] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-xl w-full max-w-md p-6">

        <h2 className="text-xl font-bold mb-2">
          Delivery Verification
        </h2>

        <p className="text-neutral-400 text-sm mb-6">
          Ask the customer for their verification PIN.
        </p>

        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter 4-digit PIN"
          className="w-full rounded-lg bg-neutral-950 border border-neutral-700 px-4 py-3"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-neutral-700"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() => onSubmit(pin)}
            className="px-5 py-2 rounded-lg bg-emerald-600"
          >
            {loading ? 'Verifying...' : 'Complete Delivery'}
          </button>

        </div>

      </div>
    </div>
  );
}