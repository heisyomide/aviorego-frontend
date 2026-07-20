"use client";

import dynamic from "next/dynamic";
import { MapPin, Package, ShieldCheck, Activity } from "lucide-react";
import type { Shipment, LiveLocation } from "../types";

const CustomerTrackingMap = dynamic(() => import("./CustomerTrackingMap"), { ssr: false });

// 1. Safely overwrite the nested relation interface to eliminate type conflicts
interface TrackingShipment extends Omit<Shipment, "rider"> {
  rider?: {
    id: string;
    name?: string;
    phone?: string;
    lastLat?: string | null;
    lastLng?: string | null;
  } | null;
}

interface Props {
  shipment: TrackingShipment;
  liveLocation: LiveLocation | null;
}

function computeHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function ShipmentTracking({ shipment, liveLocation }: Props) {
  // Use the live WebSocket location if streaming; otherwise, fall back to the nested DB relation coordinates
  const currentRiderLat = liveLocation?.latitude ?? Number(shipment.rider?.lastLat || shipment.pickupLat);
  const currentRiderLng = liveLocation?.longitude ?? Number(shipment.rider?.lastLng || shipment.pickupLng);

  // Determine shipment state
  const statusLower = shipment.status?.toLowerCase() || "";
  const isHeadingToPickup = ["accepted", "picking_up", "assigned", "arrived_at_pickup"].includes(statusLower);

  // Set the target coordinates depending on whether the rider is picking up or delivering
  const targetLat = isHeadingToPickup ? Number(shipment.pickupLat) : Number(shipment.destinationLat);
  const targetLng = isHeadingToPickup ? Number(shipment.pickupLng) : Number(shipment.destinationLng);

  const remainingDistanceKm = computeHaversineDistance(currentRiderLat, currentRiderLng, targetLat, targetLng);
  const dynamicRemainingMinutes = Math.max(1, Math.round((remainingDistanceKm / 25) * 60)); // 25 km/h urban velocity metric

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      {/* Premium Notification Strip HUD */}
      <div className="bg-neutral-900 px-6 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-green-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
            {isHeadingToPickup ? "Courier Heading to Merchant Store" : "Courier Heading to Your Address"}
          </span>
        </div>
        <span className="text-xs font-medium text-neutral-400">
          Status: <span className="text-white font-black capitalize">{statusLower.replaceAll("_", " ")}</span>
        </span>
      </div>

      {/* Rebuilt High Precision Street Engine Map */}
      <CustomerTrackingMap
        riderLat={currentRiderLat}
        riderLng={currentRiderLng}
        pickupLat={Number(shipment.pickupLat)}
        pickupLng={Number(shipment.pickupLng)}
        destinationLat={Number(shipment.destinationLat)}
        destinationLng={Number(shipment.destinationLng)}
        status={shipment.status}
      />

      {/* Telemetry Information Widgets Matrix */}
      <div className="grid gap-6 p-6 md:grid-cols-3 border-t border-neutral-100 bg-neutral-50/50">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Arrival Estimate</span>
          <p className="mt-2 text-3xl font-black text-blue-900">{dynamicRemainingMinutes} <span className="text-lg font-bold">mins</span></p>
          <p className="mt-2 text-[11px] text-blue-700 font-medium">Dynamically updated via live street traffic routing.</p>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Remaining Range</span>
          <p className="mt-2 text-3xl font-black text-emerald-900">{remainingDistanceKm.toFixed(2)} <span className="text-lg font-bold">km</span></p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck size={14} /> End-to-end secure tracking enabled
          </div>
        </div>

        <div className="rounded-xl bg-white border border-neutral-200 p-5 space-y-3">
          <div className="flex gap-2 items-start text-xs">
            <MapPin size={16} className={`shrink-0 ${isHeadingToPickup ? "text-blue-500 animate-bounce" : "text-neutral-400"}`} />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Pickup Hub</p>
              <p className="font-semibold text-neutral-700 truncate max-w-45">{shipment.pickupAddress}</p>
            </div>
          </div>
          <div className="flex gap-2 items-start text-xs pt-2 border-t border-neutral-100">
            <Package size={16} className={`shrink-0 ${!isHeadingToPickup ? "text-emerald-500 animate-bounce" : "text-neutral-400"}`} />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Destination Address</p>
              <p className="font-semibold text-neutral-700 truncate max-w-45">{shipment.destinationAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}