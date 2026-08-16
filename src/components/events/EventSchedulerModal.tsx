'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/src/lib/api';
import { Bus, X, MapPin } from 'lucide-react';

interface EventSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
}

const formatForDatetimeLocal = (dateInput?: string | Date) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function EventSchedulerModal({ isOpen, onClose, event }: EventSchedulerModalProps) {
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [tripLeg, setTripLeg] = useState<'OUTBOUND' | 'RETURN'>('OUTBOUND');
  const [busCount, setBusCount] = useState<number>(1);
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');

  // Coordinate Mapping State for Selected Route/Pickup Points
  const [destinationLat, setDestinationLat] = useState<string>('');
  const [destinationLng, setDestinationLng] = useState<string>('');
  const [pickupCoordinates, setPickupCoordinates] = useState<Record<string, { lat: string; lng: string }>>({});

  useEffect(() => {
    if (event && event.routes && event.routes.length > 0) {
      const defaultRoute = event.routes[0];
      setSelectedRouteId(defaultRoute.id);
      setTripLeg('OUTBOUND');
      setBusCount(1);

      const formattedStart = formatForDatetimeLocal(event.startDate);
      const formattedEnd = formatForDatetimeLocal(event.endDate || event.startDate);
      setDepartureTime(formattedStart);
      setArrivalTime(formattedEnd);

      // Initialize coordinates from the selected route if available
      setDestinationLat(defaultRoute.destinationLat !== null && defaultRoute.destinationLat !== undefined ? String(defaultRoute.destinationLat) : '');
      setDestinationLng(defaultRoute.destinationLng !== null && defaultRoute.destinationLng !== undefined ? String(defaultRoute.destinationLng) : '');

      const initialPickups: Record<string, { lat: string; lng: string }> = {};
      defaultRoute.pickupPoints?.forEach((p: any) => {
        initialPickups[p.id] = {
          lat: p.latitude !== null && p.latitude !== undefined ? String(p.latitude) : '',
          lng: p.longitude !== null && p.longitude !== undefined ? String(p.longitude) : '',
        };
      });
      setPickupCoordinates(initialPickups);
    }
  }, [event]);

  // Handle Route Selection Change to update coordinate inputs dynamically
  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    const route = event?.routes?.find((r: any) => r.id === routeId);
    if (route) {
      setDestinationLat(route.destinationLat !== null && route.destinationLat !== undefined ? String(route.destinationLat) : '');
      setDestinationLng(route.destinationLng !== null && route.destinationLng !== undefined ? String(route.destinationLng) : '');

      const newPickups: Record<string, { lat: string; lng: string }> = {};
      route.pickupPoints?.forEach((p: any) => {
        newPickups[p.id] = {
          lat: p.latitude !== null && p.latitude !== undefined ? String(p.latitude) : '',
          lng: p.longitude !== null && p.longitude !== undefined ? String(p.longitude) : '',
        };
      });
      setPickupCoordinates(newPickups);
    }
  };

  const handlePickupCoordChange = (pickupId: string, field: 'lat' | 'lng', value: string) => {
    setPickupCoordinates((prev) => ({
      ...prev,
      [pickupId]: {
        ...prev[pickupId],
        [field]: value,
      },
    }));
  };

  const handleTripLegChange = (newLeg: 'OUTBOUND' | 'RETURN') => {
    setTripLeg(newLeg);
    if (!event) return;

    if (newLeg === 'OUTBOUND') {
      setDepartureTime(formatForDatetimeLocal(event.startDate));
      setArrivalTime(formatForDatetimeLocal(event.endDate || event.startDate));
    } else {
      setDepartureTime(formatForDatetimeLocal(event.endDate || event.startDate));
      setArrivalTime(formatForDatetimeLocal(event.startDate));
    }
  };

  const handleScheduleFleet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteId || !departureTime || !arrivalTime) {
      alert('Please fill in all required scheduling fields.');
      return;
    }

    try {
      setSubmitting(true);

      // 1. Save / Update Route and Pickup Point Coordinates first via Admin Patch Endpoint
      const routePayload = {
        destinationLat: destinationLat ? parseFloat(destinationLat) : null,
        destinationLng: destinationLng ? parseFloat(destinationLng) : null,
        pickupPoints: Object.entries(pickupCoordinates).map(([id, coords]) => ({
          id,
          latitude: coords.lat ? parseFloat(coords.lat) : null,
          longitude: coords.lng ? parseFloat(coords.lng) : null,
        })),
      };

      await api.patch(`/admin/routes/${selectedRouteId}/coordinates`, routePayload).catch(() => {
        // Fallback or secondary pattern if endpoint route differs slightly
        return api.patch(`/admin/routes/${selectedRouteId}`, routePayload);
      });

      // 2. Loop to create the specified number of individual bus trips matching CreateTripDto exactly
      for (let i = 0; i < busCount; i++) {
        await api.post('/admin/trips', {
          routeId: selectedRouteId,
          tripLeg,
          departureTime: new Date(departureTime).toISOString(),
          arrivalTime: new Date(arrivalTime).toISOString(),
        });
      }

      alert(`Successfully updated route GPS coordinates & scheduled ${busCount} bus slot(s)!`);
      onClose();
    } catch (err: any) {
      console.error('Error configuring route coordinates or fleet schedule:', err?.response?.data || err);
      const serverMessage = err?.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage) 
        ? serverMessage.join(', ') 
        : serverMessage || err.message || 'Error processing request.';
      alert(`Server Error (400): ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRouteData = event?.routes?.find((r: any) => r.id === selectedRouteId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0b0f19] w-full max-w-2xl rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-white">Configure Fleet, Maps & GPS Coordinates</h3>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
              Pin exact destination coordinates and boarding points for rider and customer live tracking maps
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors border border-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!event ? (
          <div className="py-12 text-center text-neutral-400 font-mono text-xs">
            No event data available.
          </div>
        ) : (
          <form onSubmit={handleScheduleFleet} className="space-y-6 font-mono">
            <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80 text-xs space-y-1">
              <span className="text-neutral-500 text-[10px] block uppercase">Target Event & Organizer Timeline</span>
              <span className="font-bold text-emerald-400">{event.title}</span>
              <div className="text-[10px] text-neutral-400">
                Organizer Window: {event.startDate ? new Date(event.startDate).toLocaleString() : 'N/A'} ➔ {event.endDate ? new Date(event.endDate).toLocaleString() : 'N/A'}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-400 uppercase">Select Route</label>
              <select
                value={selectedRouteId}
                onChange={(e) => handleRouteChange(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition"
                required
              >
                {event.routes?.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.originCity} ➔ {r.destination} (₦{r.price?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Coordinates Setup Section */}
            <div className="space-y-4 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                <MapPin className="h-4 w-4" /> Destination & Pickup Map Calibration
              </div>
              
              {/* Destination Coordinates */}
              <div className="space-y-2 pt-1 border-t border-neutral-800/60">
                <span className="text-[11px] text-neutral-300 font-bold block">
                  Venue Destination ({selectedRouteData?.destination || 'Destination'}) Coordinates
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 uppercase mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 6.5244"
                      value={destinationLat}
                      onChange={(e) => setDestinationLat(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 uppercase mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 3.3792"
                      value={destinationLng}
                      onChange={(e) => setDestinationLng(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Points Coordinates */}
              <div className="space-y-3 pt-2 border-t border-neutral-800/60">
                <span className="text-[11px] text-neutral-300 font-bold block">Pickup Points Boarding Coordinates</span>
                {selectedRouteData?.pickupPoints && selectedRouteData.pickupPoints.length > 0 ? (
                  selectedRouteData.pickupPoints.map((point: any) => (
                    <div key={point.id} className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{point.name}</span>
                        <span className="text-neutral-400 text-[10px]">{point.address}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            value={pickupCoordinates[point.id]?.lat || ''}
                            onChange={(e) => handlePickupCoordChange(point.id, 'lat', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-[11px] text-white outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            value={pickupCoordinates[point.id]?.lng || ''}
                            onChange={(e) => handlePickupCoordChange(point.id, 'lng', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-[11px] text-white outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-neutral-500 italic">No pickup points registered for this route.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-400 uppercase">Trip Leg</label>
                <select
                  value={tripLeg}
                  onChange={(e) => handleTripLegChange(e.target.value as 'OUTBOUND' | 'RETURN')}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition"
                >
                  <option value="OUTBOUND">Outbound (To Event)</option>
                  <option value="RETURN">Return (Back from Event)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-400 uppercase">Number of Buses</label>
                <div className="relative flex items-center">
                  <Bus className="absolute left-3 h-4 w-4 text-emerald-400" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={busCount}
                    onChange={(e) => setBusCount(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 pl-9 text-xs text-white outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-400 uppercase flex items-center justify-between">
                  <span>Departure Time</span>
                  <span className="text-[9px] text-emerald-400 lowercase font-normal">matches organizer</span>
                </label>
                <input
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-400 uppercase flex items-center justify-between">
                  <span>Arrival Time</span>
                  <span className="text-[9px] text-emerald-400 lowercase font-normal">matches organizer</span>
                </label>
                <input
                  type="datetime-local"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition border border-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-bold text-xs transition shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Calibrating Maps & Allocating...' : 'Save GPS Coordinates & Open Slots'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}