'use client';

import React from 'react';
import { User, Calendar, MapPin, ShieldAlert, Mail, Phone } from 'lucide-react';

interface Step1Props {
  formData: any;
  updateField: (key: string, value: any) => void;
  onNext: () => void;
}

export default function Step1PersonalDetails({ formData, updateField, onNext }: Step1Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input Grid Matrix */}
      <div className="grid grid-cols-3 gap-3">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">First Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400"><User className="h-4 w-4" /></span>
            <input 
              type="text" 
              required
              placeholder="John"
              value={formData.firstName || ''} 
              onChange={e => updateField('firstName', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Middle Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Middle Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400"><User className="h-4 w-4" /></span>
            <input 
              type="text" 
              placeholder="e.g. Alao"
              value={formData.middleName || ''} 
              onChange={e => updateField('middleName', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Last Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-zinc-400"><User className="h-4 w-4" /></span>
            <input 
              type="text" 
              required
              placeholder="Doe"
              value={formData.lastName || ''} 
              onChange={e => updateField('lastName', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Date Of Birth */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Date of Birth</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Calendar className="h-4 w-4" /></span>
            <input 
              type="date" 
              required 
              value={formData.dateOfBirth} 
              onChange={e => updateField('dateOfBirth', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Gender Select Grid Option */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Gender</label>
          <select 
            value={formData.gender} 
            onChange={e => updateField('gender', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      {/* 🌟 NEW: Core Identity Pipeline Section (Email & Phone Number) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Mail className="h-4 w-4" /></span>
            <input 
              type="email" 
              required 
              placeholder="john.doe@example.com"
              value={formData.email || ''} 
              onChange={e => updateField('email', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-zinc-400"><Phone className="h-4 w-4" /></span>
            <input 
              type="tel" 
              required 
              placeholder="e.g. +2348012345678"
              value={formData.phoneNumber || ''} 
              onChange={e => updateField('phoneNumber', e.target.value)} 
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
            />
          </div>
        </div>
      </div>

      {/* Residential Street Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Residential Address</label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-zinc-400"><MapPin className="h-4 w-4" /></span>
          <input 
            type="text" 
            required 
            placeholder="House Number, Street Name, Landmark"
            value={formData.residentialAddress} 
            onChange={e => updateField('residentialAddress', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      {/* Geolocation Region Split Info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">State</label>
          <input 
            type="text" 
            required 
            placeholder="Lagos"
            value={formData.state} 
            onChange={e => updateField('state', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">City</label>
          <input 
            type="text" 
            required 
            placeholder="Ikeja"
            value={formData.city} 
            onChange={e => updateField('city', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">LGA</label>
          <input 
            type="text" 
            required 
            placeholder="Ikeja"
            value={formData.lga} 
            onChange={e => updateField('lga', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      {/* Emergency Anchor Contact Module Frame */}
      <div className="border-t border-zinc-100 pt-4 space-y-3">
        <div className="flex items-center gap-2 text-zinc-800">
          <ShieldAlert className="h-4 w-4 text-emerald-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Emergency Contact Protocols</h3>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <input 
            type="text" 
            required 
            placeholder="Full Name" 
            value={formData.emergencyContactName} 
            onChange={e => updateField('emergencyContactName', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
          <input 
            type="tel" 
            required 
            placeholder="Phone Line" 
            value={formData.emergencyContactPhone} 
            onChange={e => updateField('emergencyContactPhone', e.target.value)} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
          <input 
            type="text" 
            required 
            placeholder="e.g. Brother" 
            value={formData.emergencyContactRelationship} 
            onChange={e => {
              // 🌟 Syncs both keys so the backend logic remains perfectly unbroken!
              updateField('emergencyContactRelationship', e.target.value);
              updateField('emergencyRelationship', e.target.value);
            }} 
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none focus:border-emerald-600 focus:bg-white transition" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 text-sm transition shadow-sm tracking-wide mt-2"
      >
        Continue
      </button>
    </form>
  );
}