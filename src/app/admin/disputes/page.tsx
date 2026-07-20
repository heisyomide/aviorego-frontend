'use client';

import React from 'react';
import Link from 'next/link';

export default function DisputesPage() {
  const disputes = [
    { id: 'DSP-5001', orderId: 'ORD-992', user: 'Sarah L.', reason: 'Item Damaged', status: 'Pending' },
    { id: 'DSP-5002', orderId: 'ORD-881', user: 'Ayomide K.', reason: 'Delayed Delivery', status: 'In Review' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase tracking-tight">Dispute Resolution</h2>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-[10px] font-black uppercase text-neutral-400">
            <tr>
              <th className="p-4">Dispute ID</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {disputes.map((d) => (
              <tr key={d.id} className="text-sm">
                <td className="p-4 font-mono font-bold">{d.id}</td>
                <td className="p-4">{d.reason}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${d.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/disputes/${d.id}`} className="font-black text-[10px] uppercase underline">Resolve</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}