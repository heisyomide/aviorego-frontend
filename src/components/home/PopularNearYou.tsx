"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import MerchantCardGrid, { MerchantCardData } from "@/src/components/MerchantCardGrid";

interface PopularNearYouSectionProps {
  merchants?: any[];
  loading?: boolean;
}

export default function PopularNearYouSection({ merchants = [], loading }: PopularNearYouSectionProps) {
  const safeItems = Array.isArray(merchants) ? merchants : [];

  // Map incoming merchant objects to MerchantCardData structure expected by MerchantCardGrid
  const formattedMerchants: MerchantCardData[] = safeItems.map((merchant) => ({
    id: merchant.id,
    businessName: merchant.businessName,
    coverUrl: merchant.coverUrl || merchant.logoUrl,
    logoUrl: merchant.logoUrl,
    rating: merchant.rating || "4.8",
    deliveryTime: merchant.deliveryTime || "20-30 min",
    cuisineType: merchant.cuisineType || merchant.address || "Restaurant Partner",
    isOpen: merchant.isOpen ?? true,
  }));

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-100 mt-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">Popular Near You</h2>
          <p className="text-xs font-semibold text-neutral-500 mt-0.5">Top-rated merchant spots open and operating around your location</p>
        </div>
        <Link 
          href="/food/popular" 
          className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>View More</span>
        </Link>
      </div>

      <MerchantCardGrid
        merchants={formattedMerchants}
        loading={loading}
        emptyTitle="No merchant spots found near your location right now."
        emptySubtitle="Check back shortly as new restaurants join Avyago!"
      />
    </section>
  );
}