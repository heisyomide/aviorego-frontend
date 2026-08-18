'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Bus, User, Phone, ShieldCheck, Navigation, Clock, AlertCircle, MapPin } from 'lucide-react';
import { eventsApi } from '@/src/lib/eventsApi';

export default function TripLiveMapPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;

  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tripId) {
      fetchActiveTripDetails();
    }
  }, [tripId]);

  // Initialize Leaflet Map using pickup point coordinates
  useEffect(() => {
    if (!tripData || !mapContainerRef.current) return;

    const container = mapContainerRef.current;

    // Extract latitude & longitude from the pickup point (matching the rider flow)
    const pickupPoint = tripData.pickupPoint || tripData.route?.pickupPoints?.[0];
    const pickupLat = pickupPoint?.latitude ? Number(pickupPoint.latitude) : 6.5244;
    const pickupLng = pickupPoint?.longitude ? Number(pickupPoint.longitude) : 3.3792;

    // Load Leaflet dynamically on client side
    import('leaflet').then((L) => {
      // Fix default marker icon issue in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!mapRef.current && container) {
        const map = L.map(container).setView([pickupLat, pickupLng], 14);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Pickup Marker
        const pickupIcon = L.divIcon({
          className: 'custom-pickup-marker',
          html: `<div style="background-color: #2563eb; color: white; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([pickupLat, pickupLng], { icon: pickupIcon })
          .addTo(map)
          .bindPopup(`<b>Pickup Location:</b><br/>${pickupPoint?.name || 'Selected Station'}<br/><span style="font-size:11px; color:#666;">${pickupPoint?.address || ''}</span>`);

        // Bus / Live Telemetry Marker
        const busIcon = L.divIcon({
          className: 'custom-bus-marker',
          html: `<div style="background-color: #16a34a; color: white; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-1.6-1.2-3-2.8-3H3c-1.6 0-2.8 1.4-2.8 3 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        // Initially place the bus at the pickup point, moving towards destination as trip progresses
        L.marker([pickupLat, pickupLng], { icon: busIcon })
          .addTo(map)
          .bindPopup(`<b>Aviorè Transit Bus</b><br/>Status: En route from pickup.`)
          .openPopup();
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [tripData]);

  const fetchActiveTripDetails = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getActiveTripDetails(tripId);
      setTripData(data);
    } catch (err: any) {
      console.error('Failed to load trip details:', err);
      setError('Could not load live trip data. The trip may not have started yet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
        <p className="text-xs font-mono text-neutral-500">Syncing live GPS telemetry...</p>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="max-w-md mx-auto mt-12 rounded-3xl border border-neutral-200 bg-white p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900">Trip Feed Unavailable</h3>
          <p className="text-xs text-neutral-500 mt-1">{error || 'Unable to fetch active route telemetry.'}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-block rounded-2xl bg-neutral-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-neutral-900"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { trip, route, vehicle, driver } = tripData;
  const pickupPoint = tripData.pickupPoint || route?.pickupPoints?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 transition hover:bg-neutral-50 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-neutral-950">Live Transit Radar</h1>
            <p className="text-xs text-neutral-500 font-mono">Trip ID: {tripId.slice(0, 8)}...</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-mono font-bold text-green-800">
          <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
          Live Feed Active
        </span>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Interactive Map Display Box (2 Columns) */}
        <div className="md:col-span-2 rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm flex flex-col h-[450px] relative">
          <div ref={mapContainerRef} className="absolute inset-0 z-10 w-full h-full" />
          
          {/* Floating Live Badge Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 shadow-md flex items-center gap-2">
            <Navigation className="h-3.5 w-3.5 text-green-600 animate-pulse" />
            <span>Tracking Pickup to Destination</span>
          </div>
        </div>

        {/* Sidebar Info Panel (1 Column) */}
        <div className="space-y-4">
          
          {/* Route & Pickup Card */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">Route & Pickup</h3>
            <div>
              <p className="text-sm font-black text-neutral-950">{route?.originCity} ➔ {route?.destination}</p>
              {pickupPoint && (
                <p className="text-xs text-neutral-600 flex items-center gap-1.5 mt-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span><strong className="text-neutral-900">Pickup:</strong> {pickupPoint.name}</span>
                </p>
              )}
            </div>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Trip Status:</span>
              <span className="font-bold text-green-600 uppercase">{trip?.status}</span>
            </div>
          </div>

          {/* Vehicle Info Card */}
          {vehicle && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">Assigned Bus</h3>
                <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-bold">{vehicle.plateNumber}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-950">{vehicle.make} {vehicle.model} ({vehicle.color})</p>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Aviorè Transit Fleet</span>
                </p>
              </div>
            </div>
          )}

          {/* Driver Contact Card */}
          {driver && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 space-y-3 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">Driver Marshal</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-700">
                    {driver.user?.firstName?.[0] || <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-950">{driver.user?.firstName} {driver.user?.lastName}</p>
                    <p className="text-[11px] text-neutral-500">{driver.user?.phoneNumber || 'Official Driver'}</p>
                  </div>
                </div>
                {driver.user?.phoneNumber && (
                  <a
                    href={`tel:${driver.user.phoneNumber}`}
                    className="h-9 w-9 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-green-700 hover:bg-green-100 transition shadow-sm"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}