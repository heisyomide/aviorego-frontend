"use client";

import { useState } from "react";

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
  const [passwordOpen, setPasswordOpen] =
  useState(false);

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

          <ProfileCard
            profile={profile}
          />

          <LogoutCard />

        </div>

        {/* Right Side */}
        <div className="space-y-6 xl:col-span-2">

          <PersonalInfo
            profile={profile}
            onEdit={() => setEditOpen(true)}
          />




<SecurityCard
  onChangePassword={() =>
    setPasswordOpen(true)
  }
  onTwoFactor={() => {}}
/>

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