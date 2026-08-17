// app/rider/dashboard/jobs/events/[tripId]/active/page.tsx
'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
import { Html5QrcodeScanner } from 'html5-qrcode';
import jobsService from '../../../services/jobs.service';
import { useRiderTelemetry } from '../../../../hooks/useRiderTelemetry';

// Socket URL helper
const getSocketUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    if (envUrl && envUrl.includes('localhost')) {
      return `http://${window.location.hostname}:5000`;
    }
    if (envUrl) return envUrl;
    return `http://${window.location.hostname}:5000`;
  }
  return envUrl || 'http://localhost:5000';
};

let socket: Socket;

// Injecting true Google Maps blue flashlight & breathing ring styles
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes gpsPulse {
      0% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.5); }
      70% { transform: scale(1); opacity: 0.2; box-shadow: 0 0 0 20px rgba(0, 122, 255, 0); }
      100% { transform: scale(0.8); opacity: 0; box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
    }
    .gps-container {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gps-beam {
      position: absolute;
      top: -35px;
      width: 90px;
      height: 90px;
      background: radial-gradient(circle at 50% 100%, rgba(0, 122, 255, 0.45) 0%, rgba(0, 122, 255, 0.05) 75%, transparent 100%);
      clip-path: polygon(20% 0%, 80% 0%, 50% 100%);
      transform-origin: 50% 100%;
      transition: transform 0.1s linear;
      pointer-events: none;
    }
    .gps-dot {
      width: 16px;
      height: 16px;
      background-color: #007aff;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      z-index: 2;
    }
    .gps-pulse-ring {
      position: absolute;
      width: 32px;
      height: 32px;
      background-color: rgba(0, 122, 255, 0.25);
      border-radius: 50%;
      animation: gpsPulse 2.2s infinite ease-out;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
}

const targetDestinationIcon = L.divIcon({
  html: `<div style="background-color:#000; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapFocusUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

interface Booking {
  id: string;
  qrToken: string;
  boardingStatus: string;
  customer: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  pickupPoint?: {
    name: string;
  };
}

interface ActiveTripDetails {
  id: string;
  tripLeg: string;
  status: string;
  departureTime: string;
  arrivalTime: string;
  payout: number;
  route: {
    originCity: string;
    destination: string;
    originLatitude?: number;
    originLongitude?: number;
    destinationLat?: number;
    destinationLng?: number;
    pickupPoints: Array<{
      id: string;
      name: string;
      address: string;
      landmark?: string;
      maxCapacity: number;
      latitude?: number | string;
      longitude?: number | string;
      lat?: number | string;
      lng?: number | string;
    }>;
  };
  event: {
    title: string;
    venue: string;
    city: string;
    state: string;
  } | null;
  bookings: Booking[];
}

export default function ActiveEventTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;
  const router = useRouter();

  const [trip, setTrip] = useState<ActiveTripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrToken, setQrToken] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const [lastCheckedIn, setLastCheckedIn] = useState<any>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Map Navigation & Telemetry State
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const isTripActive = true;
  const { coords } = useRiderTelemetry(isTripActive);

  const fetchTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await jobsService.getActiveEventTripDetails(tripId);
      setTrip(data);
    } catch (error) {
      console.error('Failed to load active trip details:', error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  // Listen to physical device orientation for compass beam rotation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const heading = (e as any).webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(Math.round(heading));
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  // Initialize Socket Connection
  useEffect(() => {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Stream true GPS telemetry coordinates to Backend Gateway for Attendees & Organizers
  const displayHeading = coords?.heading !== null && coords?.heading !== undefined ? coords.heading : compassHeading;

  useEffect(() => {
    if (!coords || !tripId || !socket) return;
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('rider:updateLocation', {
      tripId: tripId,
      latitude: coords.latitude,
      longitude: coords.longitude,
      heading: displayHeading,
    });
  }, [coords, tripId, displayHeading]);

  // QR Scanner Effect Lifecycle
  useEffect(() => {
    if (!isScannerOpen) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(console.error);
        setIsScannerOpen(false);
        handleVerifyPassenger(decodedText);
      },
      () => {
        // Ignore scan frame decode errors
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear html5-qrcode scanner. ", error);
      });
    };
  }, [isScannerOpen]);

  // Determine Target Coordinates with robust parsing (handles string/number & alternate keys)
  const nextPickup = trip?.route?.pickupPoints?.find(
    p => (p.latitude !== null && p.latitude !== undefined) || (p.lat !== null && p.lat !== undefined)
  );

  const rawTargetLat = nextPickup?.latitude ?? nextPickup?.lat ?? trip?.route?.destinationLat ?? 6.5244;
  const rawTargetLng = nextPickup?.longitude ?? nextPickup?.lng ?? trip?.route?.destinationLng ?? 3.3792;

  const targetLat = typeof rawTargetLat === 'string' ? parseFloat(rawTargetLat) : rawTargetLat;
  const targetLng = typeof rawTargetLng === 'string' ? parseFloat(rawTargetLng) : rawTargetLng;

  const activeLat = coords?.latitude ?? trip?.route?.originLatitude ?? 6.4530;
  const activeLng = coords?.longitude ?? trip?.route?.originLongitude ?? 3.3958;

  // Calculate OSRM Road Polyline
  useEffect(() => {
    if (!activeLat || !activeLng || !targetLat || !targetLng) return;

    async function fetchTripRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${activeLng},${activeLat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const points = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(points);
        }
      } catch (err) {
        console.error('Trip path routing failed:', err);
      }
    }

    fetchTripRoute();
  }, [activeLat, activeLng, targetLat, targetLng]);

  async function handleVerifyPassenger(tokenToVerify?: string) {
    const targetToken = tokenToVerify || qrToken;
    if (!targetToken.trim()) return;
    try {
      setVerifying(true);
      const response = await jobsService.checkInPassenger(tripId, targetToken.trim());
      setLastCheckedIn(response);
      alert(response.message || 'Passenger checked in successfully!');
      setQrToken('');
      setIsScannerOpen(false);
      fetchTripDetails();
    } catch (err: any) {
      alert(err?.message || 'Invalid ticket or QR token not found.');
    } finally {
      setVerifying(false);
    }
  }

  const blueFlashlightIcon = L.divIcon({
    html: `
      <div class="gps-container">
        <div class="gps-beam" style="transform: rotate(${displayHeading}deg);"></div>
        <div class="gps-pulse-ring"></div>
        <div class="gps-dot"></div>
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] bg-neutral-950 flex items-center justify-center font-mono text-neutral-500 animate-pulse rounded-3xl">
        Loading active trip workspace...
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-5rem)] min-h-175 flex flex-col bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
      
      {/* =========================================================
          TOP HALF (50%): LIVE LEAFLET MAP WITH GPS FLASHLIGHT BEAM
          ========================================================= */}
      <div className="relative w-full h-1/2 bg-neutral-900 border-b border-neutral-800 overflow-hidden">
        
        {/* Real-time Telemetry Diagnostic Card */}
        <div className="absolute top-4 left-4 z-1000 bg-black/85 backdrop-blur-md px-3 py-2 rounded-lg text-[11px] font-mono border border-neutral-800 text-white flex flex-col gap-1 shadow-xl pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${coords ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="font-bold">GPS: {coords ? 'LIVE SYNCED' : 'ACQUIRING...'}</span>
          </div>
          <div>Lat: {coords?.latitude ? coords.latitude.toFixed(5) : activeLat.toFixed(5)}</div>
          <div>Lng: {coords?.longitude ? coords.longitude.toFixed(5) : activeLng.toFixed(5)}</div>
          <div>Heading: {displayHeading}°</div>
          <div>Target: {targetLat.toFixed(4)}, {targetLng.toFixed(4)}</div>
        </div>

        {/* Floating Top Control Actions (Scan, Help) */}
        <div className="absolute top-4 right-4 z-1000 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-full shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            📷 Scan Ticket
          </button>
          <button 
            onClick={() => alert('Support / Dispatch Help')}
            className="px-4 py-2 bg-white/90 backdrop-blur-md text-neutral-900 font-bold text-xs rounded-full shadow-lg hover:bg-white transition-all cursor-pointer border border-neutral-200"
          >
            Help
          </button>
        </div>

        {/* Leaflet Map Container */}
        <MapContainer center={[activeLat, activeLng]} zoom={15} zoomControl={false} className="w-full h-full z-0">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapFocusUpdater center={[activeLat, activeLng]} />

          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="#007aff" weight={6} opacity={0.85} />
          )}

          <Marker position={[targetLat, targetLng]} icon={targetDestinationIcon} />
          <Marker position={[activeLat, activeLng]} icon={blueFlashlightIcon} />
        </MapContainer>

        {/* Status Pill on Map */}
        <div className="absolute bottom-4 left-4 z-1000 bg-neutral-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            {trip?.status || 'BOARDING IN PROGRESS'}
          </span>
        </div>
      </div>

      {/* =========================================================
          BOTTOM HALF (50%): SCROLLABLE INFORMATION & MANIFEST PANEL
          ========================================================= */}
      <div className="w-full h-1/2 bg-white text-neutral-900 overflow-y-auto p-6 space-y-5">
        
        {/* Route Header & Payout */}
        <div className="flex justify-between items-start pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono font-semibold block mb-0.5">Route Corridor & Schedule Lat/Lng</span>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              {trip?.route?.originCity} ➔ {trip?.route?.destination}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block uppercase font-mono font-semibold">Total Payout</span>
            <span className="text-xl font-black text-emerald-600 font-mono">₦{trip?.payout?.toLocaleString() || '0'}</span>
          </div>
        </div>

        {/* Progress / Step Indicator Bar */}
        <div className="bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-200/60 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 font-medium">
            <span className="text-emerald-600 font-bold">Station</span>
            <span>Pickup</span>
            <span>Transit</span>
            <span>Destination</span>
          </div>
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute inset-x-0 h-1 bg-neutral-200 z-0" />
            <div className="absolute left-0 h-1 bg-emerald-500 z-0 w-1/3" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 z-10 border-2 border-white shadow-sm" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 z-10 border-2 border-white shadow-sm" />
            <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 z-10 border-2 border-white shadow-sm" />
            <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 z-10 border-2 border-white shadow-sm" />
          </div>
        </div>

        {/* Quick Check-In Input Bar */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block">
            Quick Passenger Check-In
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Paste ticket qrToken..."
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={() => handleVerifyPassenger()}
              disabled={verifying || !qrToken.trim()}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
            >
              {verifying ? 'Checking...' : 'Check-In'}
            </button>
          </div>
          {lastCheckedIn && (
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs text-emerald-700 font-mono">
              ✓ Verified: {lastCheckedIn.booking?.customer?.firstName} ({lastCheckedIn.status})
            </div>
          )}
        </div>

        {/* Event Assignment Info */}
        {trip?.event && (
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Event Assignment</span>
            <h4 className="font-bold text-neutral-900 text-sm">{trip.event.title}</h4>
            <p className="text-neutral-600">{trip.event.venue}, {trip.event.city}</p>
          </div>
        )}

        {/* Passenger Manifest Feed */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
              Passenger Manifest
            </h4>
            <span className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded-full text-[11px] font-mono font-semibold text-neutral-700">
              {trip?.bookings?.length || 0} Booked
            </span>
          </div>

          {!trip?.bookings || trip.bookings.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-2">No bookings recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {trip.bookings.map((booking: Booking) => (
                <div key={booking.id} className="bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 block">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </span>
                    <span className="text-neutral-500 text-[11px]">{booking.pickupPoint?.name || 'Main Station'}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md font-mono uppercase font-bold text-[10px] ${
                    booking.boardingStatus === 'CHECKED_IN' || booking.boardingStatus === 'BOARDED'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {booking.boardingStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Stops Feed */}
        <div className="space-y-3 pt-2 pb-6">
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
            Scheduled Stops & Coordinates ({trip?.route?.pickupPoints?.length || 0})
          </h4>
          <div className="space-y-2">
            {trip?.route?.pickupPoints?.map((point, index) => {
              const pLat = point.latitude ?? point.lat;
              const pLng = point.longitude ?? point.lng;
              return (
                <div key={point.id} className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono text-emerald-600 font-bold">Stop #{index + 1}</span>
                    <span className="text-neutral-400 font-mono">
                      {pLat && pLng ? `${Number(pLat).toFixed(4)}, ${Number(pLng).toFixed(4)}` : `Cap: ${point.maxCapacity}`}
                    </span>
                  </div>
                  <h5 className="font-bold text-neutral-900">{point.name}</h5>
                  <p className="text-neutral-600 text-[11px]">{point.address}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* =========================================================
          QR SCANNER MODAL OVERLAY (WITH HTML5-QRCODE CAMERA STREAM)
          ========================================================= */}
      {isScannerOpen && (
        <div className="absolute inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center text-neutral-900">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Camera QR Scanner</h3>
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-900 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Camera Stream Element */}
            <div id="reader" className="w-full overflow-hidden rounded-2xl bg-neutral-900"></div>

            <div className="space-y-3">
              <p className="text-xs text-neutral-500">Alternatively, enter ticket token manually:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste qrToken string..."
                  value={qrToken}
                  onChange={(e) => setQrToken(e.target.value)}
                  className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  onClick={() => handleVerifyPassenger()}
                  disabled={verifying || !qrToken.trim()}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}