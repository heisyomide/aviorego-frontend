"use client";

import Link from "next/link";
import { Star, Heart, Loader2, Clock } from "lucide-react";

export interface MerchantCardData {
  id: string;
  businessName: string;
  coverUrl?: string;
  logoUrl?: string;
  rating?: number | string;
  deliveryTime?: string;
  cuisineType?: string;
  isOpen?: boolean;
}

interface MerchantCardGridProps {
  merchants?: MerchantCardData[];
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export default function MerchantCardGrid({
  merchants = [],
  loading = false,
  emptyTitle = "No merchant spots found near your location right now.",
  emptySubtitle = "Check back shortly as new restaurants join Avyago!",
}: MerchantCardGridProps) {
  const safeItems = Array.isArray(merchants) ? merchants : [];

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-orange-600" size={28} />
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="col-span-full py-12 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
        <p className="text-xs font-bold text-neutral-700">{emptyTitle}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-in fade-in duration-300">
      {safeItems.map((merchant, index) => {
        // Explicitly check if the merchant is open (handles true, undefined, or missing fields by defaulting to open, but correctly detects explicit false)
        const isOpen = merchant.isOpen === true;
        const uniqueKey = `${merchant.id}-${index}`;

        return (
          <Link
            key={uniqueKey}
            href={`/food/restaurant/${merchant.id}`}
            className="group bg-white rounded-2xl border border-neutral-200/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Compact Image Container */}
              <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-neutral-100">
                <img
                  src={merchant.coverUrl || merchant.logoUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60"}
                  alt={merchant.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50" />

                {/* Open / Closed Status Badge over Image */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs ${
                    isOpen 
                      ? "bg-emerald-600 text-white" 
                      : "bg-rose-600 text-white"
                  }`}>
                    {isOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>

                {/* Favorite Button */}
                <button 
                  onClick={(e) => { e.preventDefault(); }}
                  className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white text-neutral-600 hover:text-rose-500 rounded-full backdrop-blur-md transition-colors shadow-2xs cursor-pointer"
                  aria-label="Save to favorites"
                >
                  <Heart size={12} />
                </button>
              </div>

              {/* Compact Content Section */}
              <div className="p-2.5 flex flex-col gap-1">
                <h3 className="font-bold text-neutral-900 text-xs line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {merchant.businessName}
                </h3>

                {/* Rating & Delivery Time Row */}
                <div className="flex items-center gap-1 text-[10px] text-neutral-600 font-medium">
                  <span className="flex items-center gap-0.5 text-neutral-900 font-bold">
                    <Star size={10} className="fill-amber-400 text-amber-400 inline" />
                    {merchant.rating || "4.7"}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="flex items-center gap-0.5 text-neutral-500">
                    <Clock size={10} className="text-orange-600" />
                    {merchant.deliveryTime || "20-30 min"}
                  </span>
                </div>

                {/* Cuisine Tags */}
                <p className="text-[10px] text-neutral-400 font-normal truncate">
                  {merchant.cuisineType || "Nigerian • Local"}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}