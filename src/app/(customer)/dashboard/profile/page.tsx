"use client";

import { useState } from "react";
import Link from "next/link";
import { Headset, ChevronRight, MapPin } from "lucide-react";

import ProfileHeader from "./components/ProfileHeader";
import ProfileCard from "./components/ProfileCard";
import PersonalInfo from "./components/PersonalInfo";
import SecurityCard from "./components/SecurityCard";
import LogoutCard from "./components/LogoutCard";
import EditProfileDrawer from "./drawers/EditProfileDrawer";

import { useProfile } from "./hooks/useProfile";

export default function ProfilePage() {
  const {
    loading,
    profile,
    refresh,
    updateProfile,
  } = useProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-base font-bold text-neutral-950">
          Unable to load profile
        </h2>
        <p className="mt-1.5 text-xs text-neutral-500">
          Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-4 text-sm">
      <ProfileHeader
        onRefresh={refresh}
        onEdit={() => setEditOpen(true)}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Side */}
        <div className="space-y-6">
          <ProfileCard profile={profile} />
        </div>

        {/* Right Side */}
        <div className="space-y-6 xl:col-span-2">
          <PersonalInfo
            profile={profile}
            onEdit={() => setEditOpen(true)}
          />
         
          {/* Delivery Address & Landmarks Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">
                    Delivery Address & Landmarks
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {profile.address?.street || "Set your Osogbo landmark and delivery street address."}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/profile/address"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shrink-0"
              >
                <span>Manage Address</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* My Event Tickets Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">
                    My Event Tickets & Passes
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    View your booked bus transit passes and boarding QR codes.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/profile/tickets"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shrink-0"
              >
                <span>View Tickets</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <SecurityCard
            onChangePassword={() => setPasswordOpen(true)}
            onTwoFactor={() => {}}
          />

          {/* Customer Support & Assistance Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                  <Headset className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">
                    Help & Support
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Need help with an order, account issue, or dispute?
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/supports"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 shrink-0"
              >
                <span>Contact Support</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <LogoutCard />
        </div>
      </div>

      <EditProfileDrawer
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={updateProfile}
      />
    </div>
  );
}