import Link from "next/link";
import { Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
                <Package size={18} />
              </div>
              <span className="font-black text-lg text-white tracking-tight">Aviorè Go</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Smart, secure, and reliable logistics across Osun State and Oyo State, Nigeria.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Links</p>
            <ul className="space-y-2">
              <li><Link href="/shipments/create" className="hover:text-white transition-colors">Send a Package</Link></li>
              <li><Link href="#track" className="hover:text-white transition-colors">Track Shipment</Link></li>
              <li><Link href="#rider" className="hover:text-white transition-colors">Become a Rider</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Coverage Hubs</p>
            <ul className="space-y-2">
              <li><span className="text-neutral-500">Osogbo / Ede (Osun State)</span></li>
              <li><span className="text-neutral-500">Ibadan / Ogbomoso (Oyo State)</span></li>
            </ul>
          </div>

          <div className="space-y-2.5 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Contact & Support</p>
            <p className="text-neutral-500">Support Email: support@aviore.com</p>
            <p className="text-neutral-500">Operating Hours: 24/7 Dispatch</p>
          </div>

        </div>

        <div className="pt-8 border-t border-neutral-900 text-center text-[11px] text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Aviorè Go. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-neutral-400">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-neutral-400">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}