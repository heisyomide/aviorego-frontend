"use client";

import { useState } from "react";

import type { RiderSummary } from "../types";
import riderDashboardService from "../services/dashboard.service";

interface RiderStatusCardProps {
  rider: RiderSummary;
}

export default function RiderStatusCard({
  rider,
}: RiderStatusCardProps) {
  const [isOnline, setIsOnline] = useState(
    rider.isOnline,
  );

async function handleToggle() {
  try {
    const newStatus = !isOnline;

    await riderDashboardService.updateAvailability(
      newStatus,
    );

    setIsOnline(newStatus);
  } catch (error) {
    console.error(error);
  }
}
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">

          <img
            src={
              rider.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${rider.firstName} ${rider.lastName}`,
              )}`
            }
            alt={`${rider.firstName} ${rider.lastName}`}
            className="h-16 w-16 rounded-full border border-neutral-700 object-cover"
          />

          <div>

            <div className="flex items-center gap-2">

              <span
                className={`h-3 w-3 rounded-full ${
                  isOnline
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-neutral-500"
                }`}
              />

              <h2 className="text-2xl font-black text-white">
                {rider.firstName} {rider.lastName}
              </h2>

            </div>

            <p className="mt-1 text-sm text-neutral-400">

              {isOnline
                ? "You are currently online and available for deliveries."
                : "You are offline. Turn on availability to receive delivery requests."}

            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <span
            className={`text-sm font-bold ${
              isOnline
                ? "text-emerald-400"
                : "text-neutral-400"
            }`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>

          <button
            type="button"
            onClick={handleToggle}
            className={`relative h-8 w-16 rounded-full transition ${
              isOnline
                ? "bg-emerald-600"
                : "bg-neutral-700"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                isOnline
                  ? "translate-x-9"
                  : "translate-x-1"
              }`}
            />
          </button>

        </div>

      </div>

    </div>
  );
}