import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export function UpcomingEvents({ events }: { events: any[] }) {
  return (
    <section className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-extrabold text-neutral-900">Upcoming Event Trips</h2>
          <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Featured</span>
        </div>
        <Link href="/events" className="text-xs font-bold text-emerald-600 hover:underline">See all →</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md">{evt.badge}</span>
              <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                <Calendar size={13} className="text-purple-600" /> {evt.date}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-neutral-900">{evt.title}</h3>
              <p className="text-xs font-bold text-neutral-600 flex items-center gap-1.5 pt-0.5">
                <MapPin size={13} className="text-emerald-600" /> Route: <span className="text-neutral-900">{evt.route}</span>
              </p>
            </div>
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">{evt.status}</span>
              <Link href={`/events/${evt.id}`} className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                <span>View Event</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}