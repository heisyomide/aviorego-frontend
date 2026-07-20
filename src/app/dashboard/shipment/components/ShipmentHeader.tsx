"use client";

import { Search, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ShipmentHeaderProps {
  onRefresh: () => void | Promise<void>;
  onTrack?: (trackingCode: string) => void;
}

export default function ShipmentHeader({
  onRefresh,
  onTrack,
}: ShipmentHeaderProps) {
  const [trackingCode, setTrackingCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!trackingCode.trim()) return;

    onTrack?.(trackingCode.trim().toUpperCase());
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-black tracking-tight text-neutral-950">
            Shipment Hub
          </h1>

          <p className="mt-2 text-neutral-500">
            Monitor logistics pipelines, delivery progress and live shipment
            tracking.
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <form
            onSubmit={handleSubmit}
            className="flex overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="flex items-center px-3 text-neutral-400">
              <Search size={18} />
            </div>

            <input
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Enter Tracking ID"
              className="w-64 border-none px-2 py-3 text-sm outline-none"
            />

              <button 
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0"
              >
                Track Cargo
              </button>
          </form>

          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-neutral-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>

      </div>

    </div>
  );
}