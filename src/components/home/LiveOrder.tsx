'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LiveOrder {
  id: string;
  restaurantName: string;
  riderName: string;
  riderImage: string;
  distanceAway: string;
  eta: string;
  statusText: string;
}

export default function LiveOrderTrackerBanner() {
  const [activeOrder, setActiveOrder] = useState<LiveOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch active order from backend API endpoint (e.g., GET /orders/active)
    async function fetchActiveOrder() {
      try {
        const res = await fetch('/api/orders/active', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setActiveOrder(data.order || null);
        } else {
          // Fallback or simulated active order for prototyping if API is pending
          setActiveOrder({
            id: 'ord_12345',
            restaurantName: "Mama's Kitchen",
            riderName: 'Adeola',
            riderImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            distanceAway: '3.2 km away',
            eta: 'Arriving in ~12 min',
            statusText: 'Your order is on the way 🚴',
          });
        }
      } catch (err) {
        console.error('Failed to fetch active order', err);
        // Set mock data matching your prototype for seamless frontend testing
        setActiveOrder({
          id: 'ord_12345',
          restaurantName: "Mama's Kitchen",
          riderName: 'Adeola',
          riderImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          distanceAway: '3.2 km away',
          eta: 'Arriving in ~12 min',
          statusText: 'Your order is on the way 🚴',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchActiveOrder();
  }, []);

  // Return nothing if loading or if there's no live order (Conditional render)
  if (loading || !activeOrder) {
    return null;
  }

  return (
    <div className="w-full px-4 py-9 mb-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-white p-4 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Order Details & Status Info */}
          <div className="space-y-1">
            <h4 className="text-xs font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>{activeOrder.statusText}</span>
            </h4>
            <p className="text-xs font-bold text-gray-800">{activeOrder.restaurantName}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
              <span>Rider is {activeOrder.distanceAway}</span>
              <span>•</span>
              <span className="font-bold text-emerald-700">{activeOrder.eta}</span>
            </div>
          </div>

          {/* Visual Progress Connector & Rider Graphic */}
          <div className="hidden md:flex items-center gap-3 px-4">
            <div className="relative flex items-center">
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-emerald-500 shadow-xs">
                <img src={activeOrder.riderImage} alt="Rider" className="h-full w-full object-cover" />
              </div>
              <div className="w-16 border-t-2 border-dashed border-emerald-300 mx-1 flex items-center justify-center">
                <span className="bg-emerald-50 text-[10px] px-1 text-emerald-600">🚴</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm shadow-xs">
                🏠
              </div>
            </div>
          </div>

          {/* Track Order Action Button */}
          <div>
            <Link
              href={`/dashboard/orders/${activeOrder.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-2xs hover:bg-emerald-600 hover:text-white transition-all w-full sm:w-auto"
            >
              Track Order
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}