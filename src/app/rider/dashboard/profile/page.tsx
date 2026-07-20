'use client';

import { useEffect, useState } from 'react';

import profileService from './services/profileService';

import { RiderProfile } from './types';

import ProfileSkeleton from './components/ProfileSkeleton';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileInformation from './components/ProfileInformation';
import IdentityInformation from './components/IdentityInformation';
import BankInformation from './components/BankInformation';

import EditProfileModal from './components/EditProfileModal';
import EditBankModal from './components/EditBankModal';

export default function RiderProfilePage() {
  const [profile, setProfile] =
    useState<RiderProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [profileModalOpen, setProfileModalOpen] =
    useState(false);

  const [bankModalOpen, setBankModalOpen] =
    useState(false);

  async function loadProfile() {
    try {
      setLoading(true);

      const data =
        await profileService.getProfile();

      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/20 p-8 text-center">
        <h2 className="text-xl font-bold text-red-400">
          Unable to load profile.
        </h2>

        <button
          onClick={loadProfile}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">

        <ProfileHeader
          profile={profile}
          onEdit={() => setProfileModalOpen(true)}
        />

        <ProfileStats
          profile={profile}
        />

        <ProfileInformation
          profile={profile}
          onEdit={() =>
            setProfileModalOpen(true)
          }
        />

        <IdentityInformation
          profile={profile}
        />

        <BankInformation
          profile={profile}
          onEdit={() =>
            setBankModalOpen(true)
          }
        />

      </div>

<EditProfileModal
  open={profileModalOpen}
  profile={profile}
  onClose={() => setProfileModalOpen(false)}
  onSave={async (payload) => {
    await profileService.updateProfile(payload);

    setProfileModalOpen(false);

    await loadProfile();
  }}
/>

<EditBankModal
  open={bankModalOpen}
  profile={profile}
  onClose={() => setBankModalOpen(false)}
  onSuccess={() => {
    setBankModalOpen(false);
    loadProfile();
  }}
/>
    </>
  );
}