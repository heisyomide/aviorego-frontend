'use client';

import React, { useEffect, useState } from 'react';
import { eventsApi } from '@/src/lib/eventsApi';
import EventPaymentSheet from '@/src/components/events/EventPaymentSheet';

export default function CustomerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  
  // Sheet & payment states
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsApi.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentSheet = () => {
    if (!selectedEvent || !selectedRoute || !selectedPickup || !selectedTrip) return;
    setIsPaymentSheetOpen(true);
  };

  const handleFlutterwaveCheckout = async () => {
    if (!selectedEvent || !selectedRoute || !selectedPickup || !selectedTrip) {
      alert('Please complete all selection steps including the trip schedule.');
      return;
    }

    setPaymentLoading(true);
    setSuccessMessage('');

    try {
      // 1. Create the pending event booking using the actual selected trip ID
      const booking = await eventsApi.bookTrip({
        eventId: selectedEvent.id,
        routeId: selectedRoute.id,
        pickupPointId: selectedPickup.id,
        tripId: selectedTrip.id,
        amountPaid: Number(selectedRoute.price),
      });

      const bookingId = booking?.id || booking?.data?.id;
      if (!bookingId) {
        throw new Error('Booking ID was not returned from the server.');
      }

      // 2. Initialize Flutterwave payment using the bookingId
      const paymentResponse = await eventsApi.initializePayment({
        bookingId: bookingId,
      });

      const paymentLink = paymentResponse?.link || paymentResponse?.data?.link;
      if (paymentLink) {
        // Redirect user to Flutterwave gateway
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-neutral-950">AviorèGo Events & Transit</h1>
        <p className="text-sm text-neutral-500">Discover upcoming festivals, concerts, and secure your official transit bus seats.</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {loading ? (
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
                onClick={() => setSelectedEvent(event)}
                className="w-full bg-neutral-950 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-sm"
              >
                Select Bus Route & Book
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal / Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-neutral-950">Book Transit: {selectedEvent.title}</h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-950 font-bold text-sm">✕</button>
            </div>

            {/* Step 1: Select Route */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">1. Select Travel Route</label>
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
                    <span className="text-xs font-mono font-black text-green-600">₦{Number(route.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select Pickup Point */}
            {selectedRoute && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">2. Select Pickup Landmark</label>
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

            {/* Step 3: Select Trip Schedule */}
            {selectedPickup && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">3. Select Bus Trip Schedule</label>
                <div className="space-y-2">
                  {(!selectedRoute.trips || selectedRoute.trips.length === 0) ? (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
                      <p className="text-xs text-neutral-500 font-medium">No trips scheduled for this route yet.</p>
                    </div>
                  ) : (
                    selectedRoute.trips.map((trip: any) => (
                      <div
                        key={trip.id}
                        onClick={() => setSelectedTrip(trip)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedTrip?.id === trip.id ? 'border-green-600 bg-green-50/50' : 'border-neutral-200'}`}
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-950">Departure: {new Date(trip.departureTime).toLocaleString()}</p>
                          <p className="text-[10px] text-neutral-500">Vehicle: {trip.vehicle ? `${trip.vehicle.make} ${trip.vehicle.model} (${trip.vehicle.plateNumber})` : 'Assigned Bus'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Proceed to Payment Sheet Button */}
            <button
              disabled={!selectedRoute || !selectedPickup || !selectedTrip}
              onClick={handleOpenPaymentSheet}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-md"
            >
              {selectedTrip ? `Proceed to Pay ₦${Number(selectedRoute.price).toLocaleString()}` : 'Complete Selections to Continue'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Sheet Modal */}
      <EventPaymentSheet
        open={isPaymentSheetOpen}
        event={selectedEvent}
        route={selectedRoute}
        pickup={selectedPickup}
        loading={paymentLoading}
        onClose={() => setIsPaymentSheetOpen(false)}
        onFlutterwavePay={handleFlutterwaveCheckout}
      />
    </div>
  );
}