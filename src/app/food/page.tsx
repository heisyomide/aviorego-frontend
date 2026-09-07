"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/src/lib/api";
import { 
  Flame, 
  Search, 
  ShoppingBag, 
  Sparkles 
} from "lucide-react";
import FoodProductGrid, { FoodProductCardData } from "@/src/components/MerchantCardGrid";

interface CategoryObj {
  id: string;
  name: string;
  slug: string;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  merchantId: string;
  merchant?: {
    id: string;
    businessName: string;
    address?: string;
    coverUrl?: string;
    logoUrl?: string;
    rating?: number | string;
    deliveryTime?: string;
    isOpen?: boolean;
  };
}

export default function FoodDirectoryPage() {
  const [categories, setCategories] = useState<CategoryObj[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/storefront/categories")
      .then((res) => {
        const data = res.data;
        setCategories(Array.isArray(data) ? data : []);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error("Failed to load database categories:", err);
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    setLoadingItems(true);
    api.get(`/storefront/food-items?category=${selectedCategory}`)
      .then((res) => {
        const data = res.data;
        setFoodItems(Array.isArray(data) ? data : []);
        setLoadingItems(false);
      })
      .catch((err) => {
        console.error("Failed to load food items:", err);
        setLoadingItems(false);
      });
  }, [selectedCategory]);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.merchant?.businessName && item.merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const formattedProducts: FoodProductCardData[] = filteredItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.merchant?.businessName || item.category || "Nigerian • Local",
    imageUrl: item.imageUrl || item.merchant?.coverUrl,
    price: item.price,
    href: `/food/item/${item.id}`,
  }));

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Flashy Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-700 text-[11px] font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>PREMIUM STOREFRONT DIRECTORY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Explore Available Dishes
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-semibold">
              Mouth-watering dishes, snacks, and top-rated local vendors near you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 bg-linear-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-neutral-900/15 transition-all hover:scale-102"
            >
              <ShoppingBag size={15} className="text-orange-400" />
              <span>My Food Orders</span>
            </Link>
          </div>
        </div>

        {/* Search & Flashy Horizontal Category Pills */}
        <div className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
            <input
              type="text"
              placeholder="Search foods, dishes, or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm font-bold text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`group relative flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shrink-0 cursor-pointer border ${
                selectedCategory === "all" 
                  ? "bg-linear-to-r from-neutral-900 to-neutral-800 text-white shadow-lg shadow-neutral-900/20 font-black border-transparent scale-105 ring-2 ring-orange-500/50" 
                  : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/80 shadow-xs font-bold hover:border-orange-200"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform group-hover:scale-110 ${selectedCategory === "all" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600 shadow-2xs"}`}>
                <Flame size={16} />
              </div>
              <span className="text-[11px] tracking-tight">All Dishes</span>
            </button>

            {!loadingCategories && categories.map((cat, idx) => {
              const categoryKey = cat.slug || cat.id || cat.name;
              const isSelected = selectedCategory === categoryKey;
              
              const themes = [
                "from-orange-500 to-amber-500 shadow-orange-500/25",
                "from-rose-500 to-pink-500 shadow-rose-500/25",
                "from-purple-500 to-indigo-500 shadow-purple-500/25",
                "from-emerald-500 to-teal-500 shadow-emerald-500/25",
                "from-blue-500 to-cyan-500 shadow-blue-500/25",
              ];
              const activeThemeClass = themes[idx % themes.length];

              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className={`group relative flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shrink-0 cursor-pointer border capitalize ${
                    isSelected 
                      ? `bg-linear-to-r ${activeThemeClass} text-white shadow-md font-black border-transparent scale-105 ring-2 ring-white/50` 
                      : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/80 shadow-xs font-bold hover:border-orange-200"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-transform group-hover:scale-110 ${isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600 shadow-2xs"}`}>
                    <Sparkles size={16} />
                  </div>
                  <span className="text-[11px] tracking-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Refactored Grid Component */}
        <div className="mt-4">
          <FoodProductGrid
            products={formattedProducts}
            loading={loadingItems}
            emptyTitle="No flashy dishes found under this category yet."
            emptySubtitle="Try switching back to 'All Dishes' or adjust your search term to see more delicious meals!"
          />
        </div>

      </div>
    </div>
  );
}