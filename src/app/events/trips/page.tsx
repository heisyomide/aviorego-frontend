'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Compass, MapPin, Calendar, Clock, DollarSign, Users, Search, Truck } from 'lucide-react';
import {api} from '@/src/lib/api';

interface RouteItem {
  id: string;
  originCity: string;
  destination: string;
  price: number;
  pickupPoints: Array<{
    id: string;
    name: string;
    address: string;
    landmark?: string;
    maxCapacity: number;
  }>;
}

interface TripEvent {
  id: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  routes: RouteItem[];
  _count?: {
    bookings: number;
  };
}

export default function TripsPage() {
  const [trips, setTrips] = useState<TripEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch organizer events/trips with configured transit routes
      const response = await api.get('/events/organizer');
      setTrips(response.data || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch trips catalog.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) =>
    trip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Trips & Transit Convoys</h1>
          <p className="text-xs text-neutral-400">Monitor active travel itineraries, convoy allocations, and route pricing structures.</p>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4 bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by title, city, or destination..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
        <span className="text-xs font-mono text-neutral-400">Total Itineraries: {filteredTrips.length}</span>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      {/* Trips Grid / List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-xs font-mono text-neutral-400 animate-pulse">Syncing transport itineraries...</p>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-neutral-700 transition-colors">
              
              {/* Trip Header info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <Truck className="h-3 w-3" /> ACTIVE CONVOY
                  </span>
                  <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                    {new Date(trip.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white font-mono leading-snug">{trip.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-neutral-500 flex-shrink-0" />
                    <span>{trip.venue}, {trip.city}, {trip.state}</span>
                  </p>
                </div>
              </div>

              {/* Associated Routes & Pickup Points Section */}
              <div className="space-y-3 pt-4 border-t border-neutral-800/60">
                <h4 className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Configured Routes & Pricing</h4>
                
                {trip.routes && trip.routes.length > 0 ? (
                  <div className="space-y-3">
                    {trip.routes.map((route, rIndex) => (
                      <div key={route.id || rIndex} className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-white font-bold flex items-center gap-1.5">
                            <Compass className="h-3.5 w-3.5 text-emerald-400" />
                            {route.originCity} $\rightarrow$ {route.destination}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            ₦{route.price?.toLocaleString()}
                          </span>
                        </div>

                        {/* Pickup Breakdown */}
                        <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">Pickup Points ({route.pickupPoints?.length || 0}):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {route.pickupPoints?.map((p, pIdx) => (
                              <div key={p.id || pIdx} className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] space-y-0.5">
                                <div className="font-bold text-white truncate">{p.name}</div>
                                <div className="text-neutral-400 truncate text-[10px]">{p.address}</div>
                                <div className="text-[10px] font-mono text-emerald-400">Cap: {p.maxCapacity} seats</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 font-mono italic">No transit routes configured for this itinerary.</p>
                )}
              </div>

              {/* Footer Metrics */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60 text-xs text-neutral-300 font-mono">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-500" />
                  <span>Total Bookings: <strong className="text-white">{trip._count?.bookings || 0}</strong></span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Ends: {new Date(trip.endDate).toLocaleDateString()}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-12 text-center space-y-4">
          <Compass className="h-10 w-10 text-neutral-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">No Trips Found</h3>
            <p className="text-xs text-neutral-400">Create an event with connected travel routes to view active transit convoys here.</p>
          </div>
        </div>
      )}
    </div>
  );
}