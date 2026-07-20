'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

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
  const shipmentId = params.shipmentId as string;

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
    loadShipment();
  }, []);

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
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        Loading shipment...
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        Shipment not found.
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-950 text-white">

        {/* Dynamically loaded safe client component instance */}
        <LiveMap shipment={shipment} />

        <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {shipment.trackingCode}
              </h1>
              <p className="text-neutral-400">
                {shipment.packageCategory}
              </p>
            </div>
            <StatusBadge status={shipment.status} />
          </div>

          <DeliveryTimeline shipment={shipment} />
          <PickupCard shipment={shipment} />
          <DestinationCard shipment={shipment} />

        </div>

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