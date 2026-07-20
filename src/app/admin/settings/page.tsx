'use client';

import React, { useState } from 'react';

export default function AdminSettingsPage() {
  const [target, setTarget] = useState('Everyone');

  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-2xl font-black uppercase tracking-tight">Admin Hub</h2>

      {/* 1. Broadcast Engine */}
      <section className="bg-white p-6 rounded-3xl border border-neutral-200">
        <h3 className="font-black uppercase text-xs mb-4">Broadcast Notifications</h3>
        <div className="flex gap-2 mb-4">
          {['Customers', 'Riders', 'Everyone'].map((opt) => (
            <button 
              key={opt}
              onClick={() => setTarget(opt)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${target === opt ? 'bg-neutral-950 text-white' : 'bg-neutral-100'}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <textarea 
          placeholder="e.g., 🎉 Free delivery today!" 
          className="w-full p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm mb-4"
        />
        <button className="w-full py-3 bg-green-600 text-white rounded-xl font-black uppercase text-xs">Send Broadcast</button>
      </section>

      {/* 2. Support Ticket Queue */}
      <section>
        <h3 className="font-black uppercase text-xs mb-4">Support Tickets</h3>
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-xs">Delayed Delivery #{i}04</p>
                <p className="text-[9px] text-neutral-400">Sarah L. (Customer) • High Priority</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-neutral-100 rounded-lg text-[9px] font-black uppercase">Reply</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase">Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Live Support Link */}
      <button className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl font-black text-neutral-400 uppercase text-xs hover:border-neutral-400 hover:text-neutral-950 transition">
        Enter Live Support Chat
      </button>
    </div>
  );
}