'use client';

import React, { useState } from 'react';

export default function PricingSettingsPage() {
  const [config, setConfig] = useState({
    bikeBase: 1500,
    bikePerKm: 250,
    platformCommission: 15,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase">Pricing Engine</h2>

      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        {/* Vehicle Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Bike Base Fee (₦)" value={config.bikeBase} />
          <Input label="Bike Per-KM (₦)" value={config.bikePerKm} />
        </div>

        {/* Revenue Strategy */}
        <div className="bg-neutral-950 p-6 rounded-2xl text-white">
          <p className="text-[10px] font-black uppercase text-neutral-400">Platform Commission (%)</p>
          <input 
            type="range" 
            min="5" max="30" 
            value={config.platformCommission}
            onChange={(e) => setConfig({...config, platformCommission: parseInt(e.target.value)})}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer mt-4"
          />
          <p className="text-3xl font-black mt-2">{config.platformCommission}%</p>
        </div>

        <button className="w-full py-4 bg-green-600 text-white rounded-xl font-black uppercase text-sm">Save Global Config</button>
      </div>
    </div>
  );
}

function Input({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase text-neutral-400 mb-1">{label}</p>
      <input type="number" defaultValue={value} className="w-full p-3 bg-neutral-50 rounded-xl font-bold border border-neutral-200" />
    </div>
  );
}