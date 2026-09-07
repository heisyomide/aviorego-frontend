"use client";

import React, { useState, useEffect } from "react";
import {api} from "../../../../lib/api";
import { ShoppingBag, CheckCircle2, Clock, Truck, Search, Loader2 } from "lucide-react";

export default function MerchantOrdersPage() {
  const [activeTab, setSearchTab] = useState<string>("new");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/merchant/dashboard");
      setOrders(data.orders || []);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Merchant profile not found. Please complete your onboarding.");
      } else {
        setError("Failed to fetch orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      await api.patch(`/merchant/dashboard/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  // Map tabs to shipment statuses
  const tabs = [
    { id: "new", label: "New", count: orders.filter(o => o.status === "PENDING" || o.status === "NEW").length },
    { id: "preparing", label: "Preparing", count: orders.filter(o => o.status === "ACCEPTED" || o.status === "PREPARING").length },
    { id: "ready", label: "Ready", count: orders.filter(o => o.status === "ARRIVED_AT_HUB" || o.status === "READY").length },
    { id: "completed", label: "Completed", count: orders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED").length },
  ];

  const filteredOrders = orders.filter(o => {
    const st = (o.status || "").toLowerCase();
    if (activeTab === "new") return st === "pending" || st === "new";
    if (activeTab === "preparing") return st === "accepted" || st === "preparing";
    if (activeTab === "ready") return st === "arrived_at_hub" || st === "ready";
    if (activeTab === "completed") return st === "delivered" || st === "completed";
    return false;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-3xl text-center space-y-2">
        <h2 className="text-sm font-black">Orders Notice</h2>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Orders</h1>
        <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 shadow-sm cursor-pointer">
          <Search size={18} />
        </div>
      </div>

      {/* Filter Tabs with Counters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center space-y-3">
            <ShoppingBag size={32} className="mx-auto text-neutral-300" />
            <p className="text-sm font-bold text-neutral-900">No orders found in this category</p>
            <p className="text-xs text-neutral-500">Incoming shipments will display here dynamically.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div key={ord.id} className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase ${
                    ord.status === 'PENDING' || ord.status === 'NEW' ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.status}
                  </span>
                  <span className="text-xs font-mono font-black text-neutral-900">#{ord.id.slice(-6)}</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-900">{ord.deliveryAddress || "Standard Delivery Order"}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="text-sm font-mono font-black text-neutral-950">Total: ₦{Number(ord.totalPrice || 0).toLocaleString()}</span>

                {(ord.status === 'PENDING' || ord.status === 'NEW') && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateOrderStatus(ord.id, 'CANCELLED')}
                      className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors border border-neutral-200"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(ord.id, 'ACCEPTED')}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Accept
                    </button>
                  </div>
                )}

                {(ord.status === 'ACCEPTED' || ord.status === 'PREPARING') && (
                  <button 
                    onClick={() => updateOrderStatus(ord.id, 'ARRIVED_AT_HUB')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    Mark as Ready
                  </button>
                )}

                {(ord.status === 'ARRIVED_AT_HUB' || ord.status === 'READY') && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Truck size={13} /> Rider assigned & arriving...
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}