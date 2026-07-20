'use client';

import type { AvailableJob } from '../types';

interface JobCardProps {
  job: AvailableJob;
  onClick: () => void;
}

export default function JobCard({
  job,
  onClick,
}: JobCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-emerald-600 transition-all p-5"
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-xs text-neutral-500 font-mono">
            {job.trackingCode}
          </p>

          <h3 className="text-white font-bold mt-1">
            {job.packageCategory.replaceAll(
              '_',
              ' ',
            )}
          </h3>

          <p className="text-sm text-neutral-400 mt-3">
            📍 {job.pickupAddress}
          </p>

          <p className="text-sm text-neutral-400 mt-1">
            🏁 {job.destinationAddress}
          </p>

        </div>

        <div className="text-right">

          <p className="text-emerald-400 font-black text-xl">
            ₦{job.payout.toLocaleString()}
          </p>

          <p className="text-xs text-neutral-500 mt-2">
            {job.distanceKm} km
          </p>

          <p className="text-xs text-neutral-500">
            {job.estimatedMinutes} mins
          </p>

        </div>

      </div>

      <div className="mt-5 flex items-center gap-2">

        {job.isExpress && (
          <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
            EXPRESS
          </span>
        )}

        <span className="px-2 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs">
          {job.deliveryType}
        </span>

      </div>

    </button>
  );
}