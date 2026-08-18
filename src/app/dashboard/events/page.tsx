'use client';

import React, { useEffect, useState } from 'react';
import { eventsApi } from '@/src/lib/eventsApi';
import EventPaymentSheet from '@/src/components/events/EventPaymentSheet';
import { BellRing, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function CustomerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  
  // New Trip Type state: 'outbound' | 'return' | 'round-trip'
  const [selectedTripType, setSelectedTripType] = useState<string>('outbound');
  
  // Sheet & payment states
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Waitlist states
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      const data = await eventsApi.getEvents();
      const eventList = Array.isArray(data) ? data : [];
      setEvents(eventList);

      if (selectedEvent) {
        const updatedCurrentEvent = eventList.find((ev: any) => ev.id === selectedEvent.id);
        if (updatedCurrentEvent) {
          setSelectedEvent(updatedCurrentEvent);
          
          if (selectedRoute) {
            const updatedRoute = updatedCurrentEvent.routes?.find((r: any) => r.id === selectedRoute.id);
            if (updatedRoute) {
              setSelectedRoute(updatedRoute);
              
              if (selectedTrip) {
                const updatedTrip = updatedRoute.trips?.find((t: any) => t.id === selectedTrip.id);
                if (updatedTrip) {
                  setSelectedTrip(updatedTrip);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleOpenEventModal = async (event: any) => {
    setLoading(true);
    try {
      const data = await eventsApi.getEvents();
      const eventList = Array.isArray(data) ? data : [];
      setEvents(eventList);
      const freshEventData = eventList.find((ev: any) => ev.id === event.id) || event;
      setSelectedEvent(freshEventData);
    } catch (error) {
      setSelectedEvent(event);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic fare directly from the selected trip's pricing fields
  const calculateTotalFare = () => {
    if (!selectedTrip) return 0;

    const oneWayFare = Number(selectedTrip.customerOneWayFare || 0);
    const roundTripFare = Number(selectedTrip.customerRoundTripFare || (oneWayFare * 2));

    if (selectedTripType === 'round-trip') {
      return roundTripFare;
    }
    // Outbound or Return uses the one-way fare
    return oneWayFare;
  };

  const handleOpenPaymentSheet = () => {
    if (!selectedEvent || !selectedRoute || !selectedPickup || !selectedTrip) return;
    setIsPaymentSheetOpen(true);
  };

  const handleJoinWaitlist = async () => {
    if (!selectedEvent || !selectedRoute) {
      alert('Please select an event and route to join the waitlist.');
      return;
    }

    setWaitlistLoading(true);
    try {
      await eventsApi.joinWaitlist({
        eventId: selectedEvent.id,
        routeId: selectedRoute.id,
        pickupPointId: selectedPickup?.id || null,
      });

      setWaitlistSuccess(true);
      setSuccessMessage('You have successfully joined the waitlist! We will notify you via email and SMS as soon as buses are scheduled.');
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to join waitlist');
    } finally {
      setWaitlistLoading(false);
    }
  };

  const handleFlutterwaveCheckout = async () => {
    if (!selectedEvent || !selectedRoute || !selectedPickup || !selectedTrip) {
      alert('Please complete all selection steps including the trip schedule.');
      return;
    }

    setPaymentLoading(true);
    setSuccessMessage('');

    try {
      const totalAmount = calculateTotalFare();

      const paymentResponse = await eventsApi.initializePayment({
        eventId: selectedEvent.id,
        routeId: selectedRoute.id,
        pickupPointId: selectedPickup.id,
        tripId: selectedTrip.id,
        tripType: selectedTripType, // Passing outbound / return / round-trip
        amount: totalAmount,
        email: 'customer@aviorego.com.ng',
        name: 'Valued Customer',
      });

      const paymentLink = paymentResponse?.link || paymentResponse?.data?.link;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        throw new Error('Payment link could not be generated.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to initialize payment');
      setPaymentLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setSelectedRoute(null);
    setSelectedPickup(null);
    setSelectedTrip(null);
    setSelectedTripType('outbound');
    setWaitlistSuccess(false);
    setSuccessMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-950">AviorèGo Events & Transit</h1>
          <p className="text-sm text-neutral-500">Discover upcoming festivals, concerts, and secure your official transit bus seats.</p>
        </div>
        <button
          onClick={() => fetchEvents(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-all"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Schedules'}
        </button>
      </div>

      {successMessage && !selectedEvent && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {loading && events.length === 0 ? (
        <div className="py-20 text-center text-neutral-400 font-mono text-sm">Loading active events...</div>
      ) : events.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-12 text-center space-y-3">
          <p className="text-neutral-900 font-bold">No active events right now</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">Check back soon for upcoming concerts, road trips, and cultural festivals organized on Aviorè.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm hover:border-green-500 transition-all flex flex-col justify-between space-y-4">
              <div>
                <span className="bg-green-100 text-green-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                  {event.city}, {event.state}
                </span>
                <h3 className="text-lg font-black text-neutral-950 mt-3">{event.title}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{event.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-700">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" /></svg>
                  <span>{event.venue}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenEventModal(event)}
                className="w-full bg-neutral-950 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-sm"
              >
                Select Bus Route & Book / Waitlist
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-neutral-950">Book Transit: {selectedEvent.title}</h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-950 font-bold text-sm">✕</button>
            </div>

            {waitlistSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-950 text-base">You're on the Waitlist!</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{successMessage}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl text-xs hover:bg-neutral-800"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* 1. Trip Type Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">1. Select Trip Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'outbound', label: 'Outbound (One-way)' },
                      { id: 'return', label: 'Return (One-way)' },
                      { id: 'round-trip', label: 'Round Trip' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedTripType(type.id)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${selectedTripType === type.id ? 'border-green-600 bg-green-50 text-green-900 shadow-sm' : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Select Travel Route */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">2. Select Travel Route</label>
                  <div className="space-y-2">
                    {selectedEvent.routes?.map((route: any) => (
                      <div
                        key={route.id}
                        onClick={() => { 
                          setSelectedRoute(route); 
                          setSelectedPickup(null); 
                          setSelectedTrip(null); 
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedRoute?.id === route.id ? 'border-green-600 bg-green-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-950">{route.originCity} ➔ {route.destination}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Select Pickup Landmark */}
                {selectedRoute && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">3. Select Pickup Landmark</label>
                    <div className="space-y-2">
                      {selectedRoute.pickupPoints?.map((pickup: any) => (
                        <div
                          key={pickup.id}
                          onClick={() => setSelectedPickup(pickup)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedPickup?.id === pickup.id ? 'border-green-600 bg-green-50/50' : 'border-neutral-200'}`}
                        >
                          <p className="text-xs font-bold text-neutral-950">{pickup.name}</p>
                          <p className="text-[10px] text-neutral-500">{pickup.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Select Bus Trip Schedule */}
                {selectedPickup && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">4. Select Bus Trip Schedule & Fare</label>
                    <div className="space-y-2">
                      {(!selectedRoute.trips || selectedRoute.trips.length === 0) ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                            <BellRing size={15} />
                            <span>No schedules created for this route yet.</span>
                          </div>
                          <p className="text-[11px] text-amber-700">Join the waitlist to receive instant notifications and priority booking links the moment the organizer launches this bus schedule.</p>
                          <button
                            disabled={waitlistLoading}
                            onClick={handleJoinWaitlist}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                          >
                            {waitlistLoading ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Joining Waitlist...
                              </>
                            ) : (
                              'Join Route Waitlist'
                            )}
                          </button>
                        </div>
                      ) : (
                        selectedRoute.trips.map((trip: any) => {
                          const tripFare = selectedTripType === 'round-trip'
                            ? Number(trip.customerRoundTripFare || (trip.customerOneWayFare * 2))
                            : Number(trip.customerOneWayFare || 0);

                          return (
                            <div
                              key={trip.id}
                              onClick={() => setSelectedTrip(trip)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedTrip?.id === trip.id ? 'border-green-600 bg-green-50/50' : 'border-neutral-200'}`}
                            >
                              <div>
                                <p className="text-xs font-bold text-neutral-950">Departure: {new Date(trip.departureTime).toLocaleString()}</p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">
                                  Type: {trip.tripLeg} | Status: <span className="font-semibold uppercase">{trip.status}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono font-black text-green-600">
                                  ₦{tripFare.toLocaleString()}
                                </span>
                                <p className="text-[9px] text-neutral-400">
                                  {selectedTripType === 'round-trip' ? 'Round Trip Fare' : 'One-way Fare'}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {selectedRoute?.trips && selectedRoute.trips.length > 0 && (
                  <button
                    disabled={!selectedRoute || !selectedPickup || !selectedTrip}
                    onClick={handleOpenPaymentSheet}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-md flex items-center justify-between px-6"
                  >
                    <span>{selectedTrip ? 'Proceed to Payment' : 'Complete Selections to Continue'}</span>
                    {selectedTrip && (
                      <span className="font-mono font-black text-sm">
                        ₦{calculateTotalFare().toLocaleString()}
                      </span>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <EventPaymentSheet
        open={isPaymentSheetOpen}
        event={selectedEvent}
        route={selectedRoute}
        pickup={selectedPickup}
        tripType={selectedTripType}
        totalAmount={calculateTotalFare()}
        loading={paymentLoading}
        onClose={() => setIsPaymentSheetOpen(false)}
        onFlutterwavePay={handleFlutterwaveCheckout}
      />
    </div>
  );
}