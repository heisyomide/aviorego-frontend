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

interface TrackingShipment extends Omit<Shipment, "rider"> {
  rider?: {
    id: string;
    name?: string;
    phone?: string;
    lastLat?: string | number | null;
    lastLng?: string | number | null;
  } | null;
}

export default function ShipmentPage() {
  const params = useParams();
  const { token } = useAuth();
  const shipmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shipment, setShipment] = useState<TrackingShipment | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  useEffect(() => {
    if (!token || !shipmentId) return;

    let isMounted = true;

    async function loadShipmentDetails() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const data = await ShipmentService.getShipment(shipmentId, token!);

        if (!isMounted) return;

        setShipment(data as unknown as TrackingShipment);

        const rawData = data as any;
        setLiveLocation({
          latitude: rawData.rider?.lastLat ? Number(rawData.rider.lastLat) : Number(rawData.pickupLat || 0),
          longitude: rawData.rider?.lastLng ? Number(rawData.rider.lastLng) : Number(rawData.pickupLng || 0),
        });
      } catch (error: any) {
        if (!isMounted) return;
        console.error("Failed loading target shipment matrix layout:", error);
        setErrorMessage(error.message || "Failed to load shipment details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadShipmentDetails();

    return () => {
      isMounted = false;
    };
  }, [shipmentId, token]);

  // Handle live WebSocket pipeline events
  useEffect(() => {
    if (!shipment?.id) return;

    socket.connect();
    socket.emit("customer:joinShipment", shipment.id);

    const handleTrackingUpdate = (payload: LiveLocation) => {
      setLiveLocation({
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
      });
    };

    socket.on("tracking:update", handleTrackingUpdate);

    return () => {
      socket.emit("customer:leaveShipment", shipment.id);
      socket.off("tracking:update", handleTrackingUpdate);
      socket.disconnect();
    };
  }, [shipment?.id]);

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
      </div>
    );
  }

  if (errorMessage || !shipment) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-neutral-800">
          {errorMessage || "Shipment record missing"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Please verify the shipment URL or check your token authentication status.
        </p>
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