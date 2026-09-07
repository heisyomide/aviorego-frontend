"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import FoodProductGrid, { FoodProductCardData } from "@/src/components/MerchantCardGrid";

export interface Merchant extends FoodProductCardData {
  description?: string;
  address?: string;
  distance?: string;
}

interface FeaturedRestaurantsProps {
  merchants: Merchant[];
  loading?: boolean;
}

export default function FeaturedRestaurantsSection({ merchants = [], loading = false }: FeaturedRestaurantsProps) {
  // Convert standard Merchant list into the exact shape expected by FoodProductGrid
  const formattedProducts: FoodProductCardData[] = merchants.map((spot) => ({
    id: spot.id,
    name: spot.name,
    description: spot.description || "Restaurant • Meals",
    imageUrl: spot.imageUrl,
    price: spot.distance ? `${spot.distance} away` : "₦500 delivery",
    href: spot.href || `/food/merchant/${spot.id}`,
  }));

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-100 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">Featured Spots</h2>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Flame size={10} className="fill-amber-500 text-amber-500" />
              Sponsored & Top Rated
            </span>
          </div>
          <p className="text-xs font-semibold text-neutral-500 mt-0.5">Handpicked partner restaurants delivering exceptional meals near you</p>
        </div>
        <Link 
          href="/food/featured" 
          className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>See All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <FoodProductGrid
        products={formattedProducts}
        loading={loading}
        emptyTitle="No featured spots available right now."
        emptySubtitle="Check back soon!"
      />
    </section>
  );
}