"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Headset, ChevronRight } from "lucide-react";

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
    changePassword,
  } = useProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-black" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center">
        <h2 className="text-xl font-bold">
          Unable to load profile
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfileHeader
        onRefresh={refresh}
        onEdit={() => setEditOpen(true)}
      />

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Left Side */}
        <div className="space-y-6">
          <ProfileCard profile={profile} />
          
          <LogoutCard />
        </div>

        {/* Right Side */}
        <div className="space-y-6 xl:col-span-2">
          <PersonalInfo
            profile={profile}
            onEdit={() => setEditOpen(true)}
          />

          <SecurityCard
            onChangePassword={() => setPasswordOpen(true)}
            onTwoFactor={() => {}}
          />

          {/* Customer Support & Assistance Card */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                  <Headset className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Help & Support
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Need help with an order, account issue, or dispute?
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/supports"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"
              >
                <span>Contact Support</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
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