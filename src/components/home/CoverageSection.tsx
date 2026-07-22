import { MapPin, Navigation } from "lucide-react";

export default function CoverageSection() {
  return (
    <section id="coverage" className="py-16 bg-neutral-50 border-y border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Coverage Area
          </h2>
          <h3 className="text-3xl font-black text-neutral-900">
            Serving Key Hubs in Osun & Oyo State
          </h3>
          <p className="text-xs text-neutral-500">
            Connecting major cities and university communities with rapid same-day logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Osun State */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <MapPin size={20} />
              </div>
              <h4 className="text-xl font-extrabold text-neutral-900">Osun State Region</h4>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Osogbo Central", "Ede North & South", "OAU Campus / Ife", "Ilesa Metropolis"].map((hub) => (
                <span
                  key={hub}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold"
                >
                  {hub}
                </span>
              ))}
            </div>
          </div>

          {/* Oyo State */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Navigation size={20} />
              </div>
              <h4 className="text-xl font-extrabold text-neutral-900">Oyo State Region</h4>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Ibadan Central (Bodija/Ringroad)", "Ogbomoso LAUTECH Hub", "Oyo Town", "Iseyin Route"].map((hub) => (
                <span
                  key={hub}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold"
                >
                  {hub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}