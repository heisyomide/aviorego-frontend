"use client";

import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";

export interface FoodProductCardData {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  isAvailable?: boolean;
  prepTimeMinutes?: number;
  category?: {
    id: string;
    name: string;
  };
  href?: string;
}

interface FoodProductGridProps {
  products?: FoodProductCardData[];
  loading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export default function FoodProductGrid({
  products = [],
  loading = false,
  emptyTitle = "No items available in this category.",
  emptySubtitle = "Check back soon for freshly updated menu choices.",
}: FoodProductGridProps) {
  const safeItems = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="py-6 flex justify-center items-center">
        <Loader2 className="animate-spin text-orange-600" size={22} />
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="py-5 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
        <p className="text-xs font-bold text-neutral-700">{emptyTitle}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 animate-in fade-in duration-300">
      {safeItems.map((product, index) => {
        const uniqueKey = `${product.id}-${index}`;
        const formattedPrice = typeof product.price === 'number' 
          ? `₦${product.price.toLocaleString()}` 
          : product.price;

        const isAvailable = product.isAvailable ?? true;

        return (
          <div
            key={uniqueKey}
            className={`group bg-white rounded-lg border border-neutral-200/80 overflow-hidden shadow-2xs hover:shadow-xs hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between ${
              !isAvailable ? "opacity-75 bg-neutral-50/50" : ""
            }`}
          >
            <div>
              {/* Product Image Container - Ultra-Compact Thumbnail */}
              <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                <img
                  src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {!isAvailable && (
                  <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-3xs flex items-center justify-center">
                    <span className="bg-neutral-900 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider shadow-xs">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Text Information - Micro Typography */}
              <div className="p-1.5 pb-1">
                <Link 
                  href={product.href || `/food/item/${product.id}`}
                  className="block font-bold text-neutral-900 text-[10px] leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors"
                >
                  {product.name}
                </Link>

                {product.description && (
                  <p className="text-[9px] text-neutral-400 line-clamp-1 mt-0.5 font-medium">
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            {/* Price & Action Footer - Minimal Layout */}
            <div className="p-1.5 pt-0 flex items-center justify-between gap-1 mt-auto">
              <div className="flex flex-col truncate">
                <span className="font-black text-neutral-900 text-[10px] leading-none truncate">
                  {formattedPrice}
                </span>
                {product.prepTimeMinutes && (
                  <span className="text-[8px] text-neutral-400 font-semibold mt-0.5">
                    {product.prepTimeMinutes}m
                  </span>
                )}
              </div>

              {isAvailable ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="h-5 w-5 flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <Plus size={10} strokeWidth={2.5} />
                </button>
              ) : (
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">
                  N/A
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}