'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

// 1. Interactive verification sub-component using searchParams
function PaymentVerifyContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const transactionId = params.get('transaction_id');

      if (!transactionId) {
        throw new Error('Missing transaction ID.');
      }

      const token = localStorage.getItem('accessToken');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/flutterwave/verify/${transactionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setStatus('success');
      setMessage('Payment verified successfully.');

      setTimeout(() => {
        router.replace('/dashboard/shipment');
      }, 2500);
    } catch (err: any) {
      console.error(err);

      setStatus('failed');
      setMessage(err.message || 'Verification failed.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
          <h2 className="mt-5 text-2xl font-bold">Verifying Payment</h2>
          <p className="mt-2 text-gray-500">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-5 text-2xl font-bold text-green-700">Payment Successful</h2>
          <p className="mt-2 text-gray-500">{message}</p>
        </>
      )}

      {status === 'failed' && (
        <>
          <XCircle className="mx-auto h-16 w-16 text-red-600" />
          <h2 className="mt-5 text-2xl font-bold text-red-700">Verification Failed</h2>
          <p className="mt-2 text-gray-500">{message}</p>

          <button
            onClick={() => router.push('/dashboard/shipments')}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

// 2. Main layout export wrapping content in Suspense for static pre-rendering compliance
export default function PaymentVerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Suspense fallback={
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
          <h2 className="mt-5 text-2xl font-bold">Loading Page...</h2>
        </div>
      }>
        <PaymentVerifyContent />
      </Suspense>
    </div>
  );
}