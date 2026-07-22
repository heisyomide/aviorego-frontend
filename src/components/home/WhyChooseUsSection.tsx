import Link from "next/link";
import { MapPin, ShieldCheck, Camera, Wallet, ArrowRight } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-neutral-50/80 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Why Choose Us Grid */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-black text-neutral-900">Why Choose Aviorè Go?</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <MapPin size={18} />
                </div>
                <h4 className="font-extrabold text-sm text-neutral-900">Real-time Tracking</h4>
                <p className="text-xs text-neutral-500">Track your package moving on street routes in real time.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="font-extrabold text-sm text-neutral-900">Secure & Trusted</h4>
                <p className="text-xs text-neutral-500">Your packages are in safe hands with fully verified couriers.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Camera size={18} />
                </div>
                <h4 className="font-extrabold text-sm text-neutral-900">Smart Delivery</h4>
                <p className="text-xs text-neutral-500">Proof-of-delivery options for maximum flexibility.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Wallet size={18} />
                </div>
                <h4 className="font-extrabold text-sm text-neutral-900">Affordable Pricing</h4>
                <p className="text-xs text-neutral-500">Competitive rates for reliable intra-state deliveries.</p>
              </div>
            </div>
          </div>

          {/* Bulk Banner */}
          <div className="lg:col-span-5 bg-amber-100/60 rounded-3xl p-6 border border-amber-200 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                BUSINESS DISCOUNTS
              </span>
              <h3 className="text-2xl font-black text-neutral-900">Send more, pay less!</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Enjoy custom bulk discounts for businesses, online vendors, and recurring corporate logistics.
              </p>
            </div>

            <div>
              <Link
                href="/for-business"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-full transition-all"
              >
                <span>Learn More</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}