'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MessageSquare, ShieldCheck } from 'lucide-react';

import shipmentService from './services/shipment.service';

import type {
  ShipmentDetails,
  ShipmentStatus,
} from './types';

import PickupCard from './components/PickupCard';
import DestinationCard from './components/DestinationCard';
import DeliveryTimeline from './components/DeliveryTimeline';
import DeliveryFooter from './components/DeliveryFooter';
import StatusBadge from './components/StatusBadge';
import VerificationModal from './components/VerificationModal';

// --- FIXED SSR CRASH: Dynamically load LiveMap only inside the client-side browser ---
const LiveMap = dynamic(
  () => import('./components/LiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] bg-neutral-900 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs gap-2 border-b border-neutral-800">
        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
        Initializing Geolocation Satellite Hardware Engine...
      </div>
    )
  }
);

export default function ShipmentPage() {
  const params = useParams();
  const router = useRouter();
  
  // Extract shipment ID safely across different route folder structures ([id] or [shipmentId])
  const shipmentId = (params?.shipmentId as string) || (params?.id as string);

  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerification, setShowVerification] = useState(false);

  async function loadShipment() {
    try {
      const response = await shipmentService.getShipment(shipmentId);
      setShipment(response.shipment);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (shipmentId) {
      loadShipment();
    }
  }, [shipmentId]);

  // Navigate to live chat page for this shipment
  const handleOpenChat = () => {
    router.push(`/rider/dashboard/jobs/${shipmentId}/chat`);
  };

  async function handleNextStep() {
    if (!shipment) return;

    switch (shipment.status) {
      case 'ACCEPTED':
        await shipmentService.arrivedAtPickup(shipment.id);
        break;

      case 'PICKED_UP':
        await shipmentService.pickup(shipment.id);
        break;

      case 'IN_TRANSIT':
        await shipmentService.arrivedAtDestination(shipment.id);
        break;

      case 'OUT_FOR_DELIVERY':
        setShowVerification(true);
        return;
    }

    await loadShipment();
  }

  async function completeDelivery(pin: string) {
    if (!shipment) return;

    await shipmentService.complete(shipment.id, pin);
    setShowVerification(false);
    await loadShipment();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white font-sans">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-sm text-neutral-400">Loading shipment status...</span>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white gap-4">
        <p className="text-neutral-400">Shipment not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-950 text-white relative pb-24">

        {/* Dynamically loaded safe client component instance */}
        <LiveMap shipment={shipment} />

        <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">

          {/* Header Section with Live Chat Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {shipment.trackingCode}
                </h1>
                <StatusBadge status={shipment.status} />
              </div>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                <span>{shipment.packageCategory}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Comm Channel
                </span>
              </p>
            </div>

            {/* Top Chat Button */}
            <button
              onClick={handleOpenChat}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs rounded-xl transition shadow-lg shadow-emerald-950/40 border border-emerald-500/30"
            >
              <div className="relative flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              </div>
              <span>Live Chat & Call</span>
            </button>
          </div>

          <DeliveryTimeline shipment={shipment} />
          <PickupCard shipment={shipment} />
          <DestinationCard shipment={shipment} />

        </div>

        {/* Footer controls */}
        <DeliveryFooter
          shipment={shipment}
          loading={loading}
          onArrivedPickup={async () => {
            await shipmentService.arrivedAtPickup(shipment.id);
            loadShipment();
          }}
          onPickup={async () => {
            await shipmentService.pickup(shipment.id);
            loadShipment();
          }}
          onArrivedDestination={async () => {
            await shipmentService.arrivedAtDestination(shipment.id);
            loadShipment();
          }}
          onComplete={() => {
            setShowVerification(true);
          }}
        />

        {/* Floating Chat Quick Action Button (Mobile Friendly) */}
        <button
          onClick={handleOpenChat}
          className="fixed bottom-24 right-6 z-40 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition hover:scale-105 active:scale-95 border border-emerald-400/40 flex items-center gap-2 group"
          aria-label="Open Chat"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-semibold">
            Chat with Rider
          </span>
        </button>

      </div>

      <VerificationModal
        open={showVerification}
        loading={false}
        onClose={() => setShowVerification(false)}
        onSubmit={completeDelivery}
      />
    </>
  );
}