"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSmoothMarker } from "../hooks/useSmoothMarker";
import { Loader2, Bike } from "lucide-react";

// --- INLINED OVERLAY COMPONENT ---
function FindingRiderOverlay() {
  return (
    <div className="flex h-[480px] w-full items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-white border border-neutral-800 rounded-2xl shadow-sm">
      <div className="max-w-sm text-center px-4">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>

        <h2 className="text-2xl font-bold">
          Finding Your Rider
        </h2>

        <p className="mt-3 text-sm text-neutral-300 leading-6">
          Please wait while we assign the nearest delivery
          partner to your shipment.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <Bike className="text-green-400" />

            <div className="text-left">
              <p className="font-semibold">
                Searching Nearby Riders
              </p>

              <p className="text-xs text-neutral-400">
                This usually takes less than 2 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- LEAFLET MAP DECORATORS ---
const storeIcon = L.divIcon({
  html: `<div style="background-color:#000; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const houseIcon = L.divIcon({
  html: `<div style="background-color:#000; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const vehicleIcon = L.divIcon({
  html: `<div style="background-color:#ff3b30; color:#fff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(255,59,48,0.6); border:3px solid #fff;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1s.67-1 1.5-1 1.5.67 1.5 1-.67 1-1.5 1zm11 0c-.83 0-1.5-.67-1.5-1s.67-1 1.5-1 1.5.67 1.5 1-.67 1-1.5 1zM5 11l1.27-3.82c.14-.4.52-.68.95-.68h9.56c.43 0 .81.28.95.68L19 11H5z"/></svg></div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapViewManager({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true });
    }
  }, [points, map]);
  return null;
}

interface MapProps {
  riderLat: number;
  riderLng: number;
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  status: string;
}

export default function CustomerTrackingMap({
  riderLat,
  riderLng,
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
  status,
}: MapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [smoothLat, smoothLng] = useSmoothMarker(riderLat, riderLng, 1200);

  const statusLower = status?.toLowerCase() || "";
  const isHeadingToPickup = ["accepted", "picking_up", "assigned", "arrived_at_pickup"].includes(statusLower);

  // 1. CONDITIONAL GUARD: Intercept pending status updates and render the searching card view
  if (statusLower === "pending") {
    return <FindingRiderOverlay />;
  }

  // 2. STAGE RESET HUD: If status changes to delivered, present confirmation notice
  if (statusLower === "delivered") {
    return (
      <div className="w-full h-[480px] bg-neutral-50 flex flex-col items-center justify-center text-neutral-500 border border-neutral-200 rounded-2xl shadow-sm">
        <div className="bg-emerald-50 p-4 rounded-full mb-3 text-emerald-600 border border-emerald-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <span className="font-black text-neutral-800 tracking-tight text-lg">Package Delivered Successfully</span>
        <p className="text-xs text-neutral-400 mt-1">Thank you for using AviorèGo logistics systems.</p>
      </div>
    );
  }

  // 3. Telemetry path tracking route engine
  useEffect(() => {
    const endLat = isHeadingToPickup ? pickupLat : destinationLat;
    const endLng = isHeadingToPickup ? pickupLng : destinationLng;

    async function fetchStreetRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${riderLng},${riderLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(coords);
        }
      } catch (err) {
        console.error("OSRM call routing failed:", err);
      }
    }

    fetchStreetRoute();
  }, [riderLat, riderLng, pickupLat, pickupLng, destinationLat, destinationLng, isHeadingToPickup, statusLower]);

  return (
    <div className="relative w-full h-[480px] bg-[#e5e9f0] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <MapContainer
        center={[smoothLat, smoothLng]}
        zoom={14}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapViewManager 
          points={[[smoothLat, smoothLng], [pickupLat, pickupLng], [destinationLat, destinationLng]]} 
        />

        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            color="#171717" 
            weight={4} 
            opacity={0.8}
            dashArray="2, 8"
          />
        )}

        {isHeadingToPickup && <Marker position={[pickupLat, pickupLng]} icon={storeIcon} />}
        <Marker position={[destinationLat, destinationLng]} icon={houseIcon} />
        <Marker position={[smoothLat, smoothLng]} icon={vehicleIcon} />
      </MapContainer>
    </div>
  );
}