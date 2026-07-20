'use client';

import React, { use } from 'react'; // 1. Import 'use'

// 2. Adjust the Props interface to accept a Promise
export default function ForensicDisputePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 3. Unwrap the params using the React.use() hook
  const { id } = use(params);

  // Mock data representing the "Black Box" of the shipment
  const dispute = {
    id: id, // Now id is safely extracted
    shipmentId: 'A1023',
    status: 'In Investigation',
    entities: { sender: 'Femi O.', receiver: 'Sarah L.', rider: 'John S.' },
    timeline: ['Created', 'Picked Up', 'Dispute Raised'],
    evidence: { gps: 'Active', photos: 3, chat: 'Log Attached', pin: 'Verified' }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black uppercase">Dispute #{dispute.id}</h2>
          <p className="text-[10px] text-neutral-500 font-bold uppercase underline">Shipment #{dispute.shipmentId}</p>
        </div>
        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          {dispute.status}
        </span>
      </div>

      {/* Forensic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(dispute.evidence).map(([key, val]) => (
          <div key={key} className="bg-white p-4 rounded-2xl border border-neutral-200">
            <p className="text-[9px] uppercase font-bold text-neutral-400">{key}</p>
            <p className="text-sm font-black">{val}</p>
          </div>
        ))}
      </div>

      {/* Forensic Timeline & Data */}
      <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
        <h3 className="text-[10px] font-black uppercase text-neutral-400 mb-4">Investigative Timeline</h3>
        <div className="space-y-4">
          {dispute.timeline.map((event, i) => (
            <div key={i} className="flex items-center gap-4 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {event}
            </div>
          ))}
        </div>
      </div>

      {/* Action Panel */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-green-600 text-white py-4 rounded-xl font-black uppercase text-xs">Resolve</button>
        <button className="bg-neutral-950 text-white py-4 rounded-xl font-black uppercase text-xs">Refund</button>
        <button className="bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs">Ban Rider</button>
        <button className="bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs">Ban Customer</button>
      </div>
    </div>
  );
}