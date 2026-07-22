import Link from "next/link";
import { Send, ArrowRight, Store, ShieldCheck } from "lucide-react";

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Core Services
          </h2>
          <h3 className="text-3xl font-black text-neutral-900">
            What do you want to do today?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Send Package */}
          <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <Send size={20} />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">Send a Package</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Book instant doorstep pick-up and delivery for personal items, documents, or gifts across towns.
            </p>
            <Link
              href="/shipments/create"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Book Pickup</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Business Shipping */}
          <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
              <Store size={20} />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">Business Deliveries</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Tailored logistics for online merchants, SMEs, and enterprise retail stores with bulk rates.
            </p>
            <Link
              href="/for-business"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-black"
            >
              <span>Partner With Us</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Secure Escrow */}
          <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">Escrow Deliveries</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Protected transactions where payment is securely held until buyer inspects and approves parcel.
            </p>
            <Link
              href="/escrow-info"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>How Escrow Works</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}