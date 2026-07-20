'use client';

import React from 'react';
import { RiderProfile } from '../types';

interface Props {
  profile: RiderProfile;
  onEdit: () => void;
}

export default function ProfileHeader({
  profile,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">

      <div className="relative p-8">

        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">

          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-neutral-800 bg-neutral-950">

            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.firstName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-5xl">
                🧑🏾‍✈️
              </span>
            )}

          </div>

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-black text-white">
                {profile.firstName} {profile.lastName}
              </h1>

              <span className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                {profile.status}
              </span>

            </div>

            <p className="mt-3 text-neutral-400">
              {profile.email}
            </p>

            <p className="text-neutral-500">
              {profile.phoneNumber}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                onClick={onEdit}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Edit Profile
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}