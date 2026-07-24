import Link from "next/link";
import { Wallet, CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentsAndRiderSection() {
  return (
    <section id="rider" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Secure Payments Card */}
          <div className="lg:col-span-5 bg-neutral-50 rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <h3 className="text-2xl font-black text-neutral-900">Secure Payments</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                All funds are protected with escrow technology. Payment is held safely and only released when delivery is confirmed.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Escrow Protection Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Encrypted Bank & Card Gateways</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Instant Rider Payouts</span>
              </div>
            </div>
          </div>

          {/* Become a Rider CTA Card */}
          <div className="lg:col-span-7 bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between space-y-8">
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                NOW HIRING RIDERS
              </span>
              <h3 className="text-3xl font-black text-white leading-tight">Become a Rider Today!</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Earn on your own time with reliable daily/weekly payouts and be part of Nigeria's fastest growing logistics network.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Flexible Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Great Weekly Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Instant Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Rider Insurance</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
              >
                <span>Sign Up as Rider</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}