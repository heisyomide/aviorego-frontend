import { api } from '@/src/lib/api'; // Your configured Axios instance

export const eventsApi = {
  // Fetch all published events for the discovery feed
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get detailed info for a single event (including routes and pickup points)
  getEventById: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Book a trip and generate a QR token
  bookTrip: async (bookingData: {
    eventId: string;
    routeId: string;
    pickupPointId: string;
    tripId: string;
    amountPaid: number;
  }) => {
    const response = await api.post('/events/bookings', bookingData);
    return response.data;
  },

  // Fetch the customer's booked tickets
  getMyTickets: async () => {
    const response = await api.get('/events/bookings/my-tickets');
    return response.data;
  },

  // Fetch organizer events
  getOrganizerEvents: async () => {
    const response = await api.get('/events/organizer');
    return response.data;
  },

  // Initialize payment for event bookings
  initializePayment: async (data: { bookingId: string }) => {
    const response = await api.post('/flutterwave/initialize', data);
    return response.data;
  },

  // Join waitlist for a route when no trips are scheduled yet
  joinWaitlist: async (data: {
    eventId: string;
    routeId: string;
    pickupPointId?: string | null;
  }) => {
    const response = await api.post('/events/waitlist', data);
    return response.data;
  },
};