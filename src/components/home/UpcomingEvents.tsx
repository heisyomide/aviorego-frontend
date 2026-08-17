"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Sparkles, Ticket } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  category?: string;
  price?: string;
}

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || data || []);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <section className="py-16 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Live & Upcoming</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Upcoming Events & Trips
            </h3>
          </div>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Content States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-neutral-100 animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="group rounded-3xl bg-neutral-50 border border-neutral-200/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                      {event.category || "Event Trip"}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 font-mono">
                      {event.price || "Free Entry"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-black text-lg text-neutral-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                      <Calendar size={13} className="text-emerald-600 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                      <MapPin size={13} className="text-orange-500 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-white border-t border-neutral-200/60 flex items-center justify-between text-xs font-bold text-neutral-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <span>Book Ride & Ticket</span>
                  <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Fallback Empty State (When no live backend events are active yet) */
          <div className="rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-emerald-950 p-8 sm:p-12 text-white text-center space-y-6 border border-neutral-800 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Ticket size={28} />
            </div>

            <div className="space-y-2 max-w-md mx-auto relative z-10">
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Exciting Event Trips Loading Soon!
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                We are curating upcoming concerts, festivals, and exclusive group shuttles across Lagos. Check back shortly or head to your dashboard to stay notified.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                href="/dashboard/events"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
              >
                <span>Explore Events Hub</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}