"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/src/lib/api";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Sparkles,
  MapPin,
  Utensils
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  foodItem: {
    name: string;
  };
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  restaurant: {
    businessName: string;
  };
}

export default function FoodOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/food-orders")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
            <Clock size={12} /> Preparing
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-orange-500/10 text-orange-600 border border-orange-500/20">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link 
              href="/food" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Storefront</span>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">My Food Orders</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                <Sparkles size={10} className="mr-1" /> Live tracking
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 font-semibold">
              Track the live status and history of your delicious meal deliveries.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 rounded-3xl bg-neutral-200/60 animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link 
                key={order.id}
                href={`/food-orders/${order.id}`}
                className="block bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-extrabold text-neutral-400">{order.restaurant?.businessName ?? 'Restaurant'}</span>
                      <h3 className="text-sm font-black text-neutral-900">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </h3>
                    </div>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">Order Summary</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-xl text-xs font-bold text-neutral-800">
                        <span className="truncate">{item.quantity}x {item.foodItem?.name}</span>
                        <span className="font-mono text-orange-600">₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-semibold truncate">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    <span className="truncate">{order.deliveryAddress || "Standard Delivery Address"}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-neutral-400 font-bold">Total:</span>
                    <span className="text-base font-black font-mono text-neutral-900">₦{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-neutral-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Utensils size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-neutral-900">No active orders yet</h3>
              <p className="text-xs text-neutral-500 font-semibold">Explore our storefront dishes and place your first delicious order today!</p>
            </div>
            <div>
              <Link 
                href="/food"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-neutral-900/15 transition-all hover:scale-102"
              >
                <span>Browse Storefront</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}