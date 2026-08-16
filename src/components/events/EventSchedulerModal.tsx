'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/src/lib/api';
import { Bus, X } from 'lucide-react';

interface EventSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
}

// Helper to format ISO date strings into 'YYYY-MM-DDTHH:mm' for datetime-local inputs
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

  // Automatically match departure and arrival times with organizer-created event dates when event changes
  useEffect(() => {
    if (event) {
      if (event.routes?.[0]?.id) {
        setSelectedRouteId(event.routes[0].id);
      }
      setTripLeg('OUTBOUND');
      setBusCount(1);

      // Fetch and format organizer start/end dates directly into the input fields
      const formattedStart = formatForDatetimeLocal(event.startDate);
      const formattedEnd = formatForDatetimeLocal(event.endDate || event.startDate);
      setDepartureTime(formattedStart);
      setArrivalTime(formattedEnd);
    }
  }, [event]);

  // Adjust times automatically when switching between Outbound and Return trip legs
  const handleTripLegChange = (newLeg: 'OUTBOUND' | 'RETURN') => {
    setTripLeg(newLeg);
    if (!event) return;

    if (newLeg === 'OUTBOUND') {
      const start = formatForDatetimeLocal(event.startDate);
      const end = formatForDatetimeLocal(event.endDate || event.startDate);
      setDepartureTime(start);
      setArrivalTime(end);
    } else {
      const start = formatForDatetimeLocal(event.startDate);
      const end = formatForDatetimeLocal(event.endDate || event.startDate);
      setDepartureTime(end);
      setArrivalTime(start);
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

      // Loop to create the specified number of individual bus trips matching CreateTripDto exactly
      for (let i = 0; i < busCount; i++) {
        await api.post('/admin/trips', {
          routeId: selectedRouteId,
          tripLeg,
          departureTime: new Date(departureTime).toISOString(),
          arrivalTime: new Date(arrivalTime).toISOString(),
        });
      }

      alert(`Successfully scheduled ${busCount} bus slot(s)!`);
      onClose();
    } catch (err: any) {
      console.error('Error creating trip schedule details:', err?.response?.data || err);
      const serverMessage = err?.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage) 
        ? serverMessage.join(', ') 
        : serverMessage || err.message || 'Error creating trip schedule.';
      alert(`Server Error (400): ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0b0f19] w-full max-w-lg rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-tight text-white">Configure Fleet & Buses</h3>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
              Times automatically match the organizer event schedule
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
          <form onSubmit={handleScheduleFleet} className="space-y-4 font-mono">
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
                onChange={(e) => setSelectedRouteId(e.target.value)}
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
                {submitting ? 'Allocating...' : 'Deploy Fleet & Open Slots'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}