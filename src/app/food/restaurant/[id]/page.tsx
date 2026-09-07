"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Search, 
  Plus, 
  Heart, 
  ShoppingBag,
  ArrowLeft,
  Share2,
  Loader2,
  UtensilsCrossed
} from "lucide-react";
import { api } from "@/src/lib/api";

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const merchantId = resolvedParams.id;
  
  const [merchant, setMerchant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (merchantId) {
      fetchStorefrontData();
      fetchCartData();
    }
  }, [merchantId]);

  const fetchStorefrontData = async () => {
    try {
      setLoading(true);
      const [merchantRes, menuRes] = await Promise.all([
        api.get(`/storefront/merchants/${merchantId}`),
        api.get(`/storefront/merchants/${merchantId}/menu`)
      ]);
      setMerchant(merchantRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error("Failed to load storefront data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    try {
      const { data } = await api.get('/cart');
      if (data && data.items) {
        setCart(data.items);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const addToCart = async (item: any) => {
    try {
      const { data } = await api.post('/cart/items', {
        foodItemId: item.id,
        quantity: 1
      });
      if (data && data.items) {
        setCart(data.items);
      }
    } catch (err) {
      console.error("Failed to add item to cart", err);
    }
  };

  const categories = ["All", ...Array.from(new Set(menuItems.map((i) => i.subCategory?.name).filter(Boolean)))];

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = activeTab === "All" || item.subCategory?.name === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center space-y-3">
        <UtensilsCrossed size={40} className="text-neutral-300" />
        <p className="text-sm font-bold text-neutral-900">Restaurant not found</p>
        <Link href="/" className="text-xs font-black text-emerald-600 hover:underline">Return home</Link>
      </div>
    );
  }

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartPrice = cart.reduce((sum, i) => sum + (Number(i.foodItem?.price || i.price || 0) * i.quantity), 0);

  return (
    <div className="min-h-screen bg-neutral-50 pb-36">
      {/* Top Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/85 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-sm font-black text-neutral-900 truncate">{merchant.businessName}</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors" aria-label="Share">
              <Share2 size={16} />
            </button>
            <button className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors relative" aria-label="Favorite">
              <Heart size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Cover Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-neutral-200 overflow-hidden">
        <img 
          src={merchant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"} 
          alt={merchant.businessName}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/30 to-transparent"></div>
      </div>

      {/* Dynamic Info Header Box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-600" />
                  Verified Kitchen
                </span>
                <span className="text-xs text-neutral-400 font-bold">• Freshly Prepared</span>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{merchant.businessName}</h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">{merchant.description || "Authentic meals freshly prepared and delivered straight to your doorstep."}</p>
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200/60 self-start sm:self-auto">
              <div className="flex items-center gap-1 text-base font-black text-neutral-900">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
              <div className="h-6 w-px bg-neutral-200"></div>
              <div className="flex flex-col text-[10px] font-bold text-neutral-500">
                <span>120+ Reviews</span>
                <span className="text-emerald-600">Tap to read</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-neutral-100 text-xs text-neutral-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-600" />
              Delivery: 25 - 40 mins
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-600" />
              {merchant.address || "Abuja, Nigeria"}
            </span>
            <span>•</span>
            <span className="text-emerald-600 font-extrabold">Open Now • Closes 10:00 PM</span>
          </div>
        </div>
      </div>

      {/* Menu & Search Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  activeTab === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search ${merchant.businessName} menu...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-neutral-200/80 p-4 shadow-2xs hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4 group"
              >
                <div className="flex flex-col flex-1 justify-between gap-2">
                  <div>
                    {item.subCategory && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                        {item.subCategory.name}
                      </span>
                    )}
                    <h3 className="font-black text-neutral-900 text-sm group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium line-clamp-2 mt-1">
                      Freshly made item ready for delivery.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-black text-neutral-900 text-base">₦{Number(item.price).toLocaleString()}</span>
                  </div>
                </div>

                <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <UtensilsCrossed size={24} className="text-neutral-300" />
                  )}
                  <button 
                    onClick={() => addToCart(item)}
                    className="absolute bottom-2 right-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-transform hover:scale-110 cursor-pointer"
                    aria-label="Add item"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-neutral-200">
              <p className="text-sm font-bold text-neutral-700">No items available for this filter right now.</p>
              <p className="text-xs text-neutral-400 mt-1">Try another category tab or search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Bar positioned cleanly above typical mobile navbars */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
          <Link
            href="/cart"
            className="bg-neutral-900 hover:bg-black text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center justify-between w-full max-w-md transition-all hover:scale-102 cursor-pointer border border-neutral-800 pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white h-7 w-7 rounded-full flex items-center justify-center font-black text-xs">
                {totalCartCount}
              </div>
              <span className="text-sm font-black tracking-tight">View Your Cart</span>
            </div>
            <div className="flex items-center gap-2 font-black text-emerald-400 text-sm">
              <span>₦{totalCartPrice.toLocaleString()}</span>
              <ShoppingBag size={16} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}