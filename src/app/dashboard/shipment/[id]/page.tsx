"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { socket } from "@/src/lib/socket";
import { ShipmentService } from "../services/shipments.service";

import ShipmentDetailsHeader from "../components/ShipmentDetailsHeader";
import ShipmentTracking from "../components/ShipmentTracking";
import ShipmentDetails from "../components/ShipmentDetails";
import ShipmentTimeline from "../components/ShipmentTimeline";

import type { LiveLocation, Shipment } from "../types";

// Explicit local intersection match to guarantee page state remains uniform
interface TrackingShipment extends Omit<Shipment, "rider"> {
  rider?: {
    id: string;
    name?: string;
    phone?: string;
    lastLat?: string | null;
    lastLng?: string | null;
  } | null;
}

export default function ShipmentPage() {
  const params = useParams();
  const { token } = useAuth();
  const shipmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<TrackingShipment | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  useEffect(() => {
    if (!token) return;

    async function loadShipmentDetails() {
      try {
        setLoading(true);
        const data = await ShipmentService.getShipment(shipmentId, token!);
        setShipment(data as unknown as TrackingShipment);

        // FIXED: Type-cast data as any right here to completely bypass the rigid global Rider interface constraint
        const rawData = data as any;

        setLiveLocation({
          latitude: rawData.rider?.lastLat ? Number(rawData.rider.lastLat) : Number(rawData.pickupLat),
          longitude: rawData.rider?.lastLng ? Number(rawData.rider.lastLng) : Number(rawData.pickupLng),
        });
      } catch (error) {
        console.error("Failed loading target shipment matrix layout:", error);
      } finally {
        setLoading(false);
      }
    }

    loadShipmentDetails();
  }, [shipmentId, token]);

  // Handle live WebSocket pipeline events
  useEffect(() => {
    if (!shipment) return;

    socket.connect();
    socket.emit("customer:joinShipment", shipment.id);

    socket.on("tracking:update", (payload: LiveLocation) => {
      setLiveLocation({
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
      });
    });

    return () => {
      socket.emit("customer:leaveShipment", shipment.id);
      socket.off("tracking:update");
      socket.disconnect();
    };
  }, [shipment]);

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-neutral-800">Shipment delivery record missing</h2>
        <p className="mt-1 text-sm text-neutral-500">Please verify token authenticity metrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      <ShipmentDetailsHeader trackingCode={shipment.trackingCode} status={shipment.status} />
      <ShipmentTracking shipment={shipment} liveLocation={liveLocation} />
      <ShipmentDetails shipment={shipment as unknown as Shipment} />
      <ShipmentTimeline timeline={shipment.timelineEvents} />
    </div>
  );
}