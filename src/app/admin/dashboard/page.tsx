'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// ============================================================================
// TYPE ARCHITECTURE
// ============================================================================
export type AdminTab = 'OVERVIEW' | 'SHIPMENTS' | 'RIDER_KYC' | 'PRICING_ENGINE';

export interface DashboardMetrics {
  activeDispatches: number;
  unassignedPipeline: number;
  netFeesToday: number;
  escrowVaultSecure: number;
}

export interface ShipmentRecord {
  id: string;
  trackingCode: string;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  weight: number;
  totalPrice: number;
  platformShare: number;
  pickupAddress: string;
  dropoffAddress: string;
  recipientPhone: string;
  createdAt: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  rider?: {
    user?: {
      firstName?: string;
      lastName?: string;
    };
  } | null;
}

export interface RiderApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface PricingConfig {
  BASE_FARE: string;
  PER_KM_CHARGE: string;
  PLATFORM_SHARE_PERCENTAGE: string;
  SURGE_MULTIPLIER: string;
  [key: string]: string;
}

export default function AdminControlTower() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Navigation & Filtering States
  const [currentTab, setCurrentTab] = useState<AdminTab>('OVERVIEW');
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });

  // Core Dynamic Data Storage
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [pendingKYC, setPendingKYC] = useState<RiderApplication[]>([]);
  const [pricingParams, setPricingParams] = useState<PricingConfig>({
    BASE_FARE: '500',
    PER_KM_CHARGE: '150',
    PLATFORM_SHARE_PERCENTAGE: '15',
    SURGE_MULTIPLIER: '1.0',
  });

  // Modal & Processing States
  const [selectedApplication, setSelectedApplication] = useState<RiderApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Infrastructure Controllers
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper for safety formatting currency numbers
  const formatCurrency = (val?: number) => {
    if (typeof val !== 'number' || isNaN(val)) return '₦0';
    return `₦${val.toLocaleString()}`;
  };

  // ============================================================================
  // REAL-TIME GATEWAY (SOCKET.IO)
  // ============================================================================
  useEffect(() => {
    const socketInstance = io(`${BACKEND_URL}/admin-operations`, {
      transports: ['websocket'],
      query: { role: 'ADMIN' },
    });

    socketInstance.on('connect', () => setIsSocketConnected(true));
    socketInstance.on('disconnect', () => setIsSocketConnected(false));
    socketInstance.on('metrics_update', (updatedMetrics: DashboardMetrics) => {
      setMetrics(updatedMetrics);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [BACKEND_URL]);

  // ============================================================================
  // REST HYDRATION WITH ABORT CONTROLLER (RACE-CONDITION SAFE)
  // ============================================================================
// ============================================================================
  // REST HYDRATION WITH ABORT CONTROLLER (RACE-CONDITION SAFE)
  // ============================================================================
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchTabData() {
      try {
        setIsLoading(true);
        setError(null);

        if (currentTab === 'OVERVIEW') {
          const res = await fetch(`${BACKEND_URL}/admin/dashboard/overview`, { signal });
          if (!res.ok) throw new Error('Could not fetch overview metrics.');
          const data = await res.json();
          setMetrics(data);
        } else if (currentTab === 'SHIPMENTS') {
          let url = `${BACKEND_URL}/admin/shipments?page=${page}&limit=20`;
          if (shipmentStatusFilter !== 'all') url += `&status=${shipmentStatusFilter}`;
          if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

          const res = await fetch(url, { signal });
          if (!res.ok) throw new Error('Failed to load shipment records.');
          const data = await res.json();
          setShipments(data.records || []);
          setMeta(data.meta || { total: 0, page: 1, limit: 20 });
        } else if (currentTab === 'RIDER_KYC') {
          const res = await fetch(`${BACKEND_URL}/admin/riders/pending-kyc?page=${page}&limit=20`, { signal });
          if (!res.ok) throw new Error('Failed to load pending KYC requests.');
          const data = await res.json();
          setPendingKYC(data || []);
        } else if (currentTab === 'PRICING_ENGINE') {
          const res = await fetch(`${BACKEND_URL}/admin/pricing-engine/current`, { signal });
          if (res.ok) {
            const data = await res.json();
            setPricingParams((prev) => ({ ...prev, ...data }));
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Fatal Gateway Interface Disconnect.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTabData();
    return () => controller.abort();
  }, [BACKEND_URL, currentTab, shipmentStatusFilter, page, searchQuery]);

  // ============================================================================
  // KYC ACTION HANDLER
  // ============================================================================
  const handleEvaluateKYC = async (applicationId: string, approve: boolean) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${BACKEND_URL}/admin/riders/kyc/${applicationId}/evaluate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensures session cookie or auth token is sent automatically
        body: JSON.stringify({
          approve,
          reason: approve ? undefined : rejectionReason || 'Submitted credentials could not be verified.',
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'KYC application update failed.');
      }

      setPendingKYC((prev) => prev.filter((app) => app.id !== applicationId));
      setSelectedApplication(null);
      setRejectionReason('');
    } catch (err: any) {
      alert(`KYC Evaluation Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // PRICING ENGINE HANDLER
  // ============================================================================
  const handleSavePricingConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch(`${BACKEND_URL}/admin/pricing-engine/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pricingParams),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Configuration update failed.');
      }

      const resData = await response.json();
      alert(resData.message || 'Pricing parameters updated.');

      const resMetrics = await fetch(`${BACKEND_URL}/admin/dashboard/overview`);
      if (resMetrics.ok) setMetrics(await resMetrics.json());
    } catch (err: any) {
      alert(`Pricing Save Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateConfigKey = (key: string, val: string) => {
    setPricingParams((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-900 antialiased font-mono text-xs">
      {/* KYC Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="text-sm font-black text-neutral-950">KYC Assessment Console</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">ID: {selectedApplication.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="text-neutral-400 hover:text-neutral-950 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border space-y-1.5 text-[11px]">
              <p><span className="text-neutral-400 font-bold">Applicant Name:</span> {selectedApplication.firstName} {selectedApplication.lastName}</p>
              <p><span className="text-neutral-400 font-bold">Verified Email:</span> {selectedApplication.email}</p>
              <p><span className="text-neutral-400 font-bold">NIN Code:</span> <span className="underline font-bold text-neutral-950">{selectedApplication.idNumber}</span></p>
              <p><span className="text-neutral-400 font-bold">Bank Entity:</span> {selectedApplication.bankName} ({selectedApplication.bankCode})</p>
              <p><span className="text-neutral-400 font-bold">Account:</span> {selectedApplication.accountNumber} — {selectedApplication.accountName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400">Rejection Reason (If Denying)</label>
              <input
                type="text"
                placeholder="Required for application denial..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[11px] outline-none font-mono focus:border-neutral-950"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleEvaluateKYC(selectedApplication.id, false)}
                className="border border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-40 font-bold p-2.5 rounded-xl uppercase tracking-wide text-center"
              >
                Deny
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleEvaluateKYC(selectedApplication.id, true)}
                className="bg-neutral-950 hover:bg-neutral-900 text-white disabled:opacity-40 font-bold p-2.5 rounded-xl uppercase tracking-wide text-center shadow-sm"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-neutral-200 pb-5 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black uppercase tracking-tight text-neutral-950">Aviago Control Engine</h1>
            <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-widest border transition-colors ${
              isSocketConnected ? 'bg-neutral-950 text-green-400 border-neutral-800' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              ● {isSocketConnected ? 'LIVE SOCKET CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">Live administrative management tower.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center bg-neutral-100 border p-1 rounded-xl font-bold text-[11px] overflow-x-auto max-w-full">
          {[
            { id: 'OVERVIEW', label: 'Overview Metrics' },
            { id: 'SHIPMENTS', label: 'Shipments Pipeline' },
            { id: 'RIDER_KYC', label: 'Rider Onboarding' },
            { id: 'PRICING_ENGINE', label: 'Pricing Config' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setCurrentTab(tab.id as AdminTab); setPage(1); }}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                currentTab === tab.id ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 font-bold rounded-xl text-[11px]">
          ⚠️ Notice: {error}
        </div>
      )}

      {/* Loader */}
      {isLoading ? (
        <div className="py-20 text-center font-bold tracking-widest text-neutral-400 animate-pulse">
          INGESTING SYSTEM TELEMETRY DATA...
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'OVERVIEW' && metrics && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Active Dispatches', val: metrics.activeDispatches, color: 'text-neutral-950' },
                  { title: 'Unassigned Pipeline', val: metrics.unassignedPipeline, color: metrics.unassignedPipeline > 0 ? 'text-amber-500 font-black' : 'text-neutral-400' },
                  { title: 'Net Fees Captured Today', val: formatCurrency(metrics.netFeesToday), color: 'text-green-600' },
                  { title: 'Escrow Vault Secure Balance', val: formatCurrency(metrics.escrowVaultSecure), color: 'text-blue-600' },
                ].map((metric, i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <p className="text-[9px] uppercase font-bold text-neutral-400">{metric.title}</p>
                    <p className={`text-xl font-black mt-2 tracking-tight ${metric.color}`}>{metric.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SHIPMENTS */}
          {currentTab === 'SHIPMENTS' && (
            <div className="border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search tracking code or customer name..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none text-[11px] font-mono focus:border-neutral-950"
                  />
                </div>
                <div className="flex bg-neutral-50 border p-0.5 rounded-lg text-[10px] font-bold overflow-x-auto">
                  {['all', 'PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => { setShipmentStatusFilter(status); setPage(1); }}
                      className={`px-3 py-1.5 rounded-md transition-all uppercase whitespace-nowrap ${
                        shipmentStatusFilter === status ? 'bg-neutral-950 text-white' : 'text-neutral-400 hover:text-neutral-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] text-neutral-400 uppercase font-black">
                      <th className="py-3 px-4">Shipment Key / Status</th>
                      <th className="py-3 px-4">Tracking Code</th>
                      <th className="py-3 px-4">Customer Account</th>
                      <th className="py-3 px-4">Trajectory Path</th>
                      <th className="py-3 px-4">Transporter Node</th>
                      <th className="py-3 px-4 text-right">Fee Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-[11px]">
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-neutral-50/50">
                        <td className="py-3.5 px-4 font-black text-neutral-950">
                          <p className="tracking-tight">{shipment.id}</p>
                          <span className={`inline-block text-[8px] uppercase font-black px-1 rounded mt-0.5 ${
                            shipment.status === 'DELIVERED' ? 'text-green-600 bg-green-50' :
                            shipment.status === 'PENDING' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-neutral-700">{shipment.trackingCode}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-neutral-900">{shipment.customer?.firstName ?? 'N/A'} {shipment.customer?.lastName ?? ''}</p>
                          <p className="text-[10px] text-neutral-400 font-sans">{shipment.customer?.email ?? 'No email'}</p>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 max-w-xs truncate">
                          <p><span className="text-neutral-400 font-bold">A:</span> {shipment.pickupAddress || 'N/A'}</p>
                          <p className="mt-0.5"><span className="text-neutral-400 font-bold">B:</span> {shipment.dropoffAddress || 'N/A'}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          {shipment.rider?.user ? (
                            <span className="font-bold text-neutral-800">
                              👤 {shipment.rider.user.firstName} {shipment.rider.user.lastName}
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic text-[10px]">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <p className="font-black text-neutral-950">{formatCurrency(shipment.totalPrice)}</p>
                          <p className="text-[9px] text-green-600">Share: {formatCurrency(shipment.platformShare)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="p-4 border-t border-neutral-100 flex items-center justify-between font-bold text-neutral-500">
                <span className="text-[10px]">Total Records: {meta.total}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-40 text-[10px] text-neutral-950"
                  >
                    ◀ Prev
                  </button>
                  <button
                    type="button"
                    disabled={page * meta.limit >= meta.total}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 border rounded-lg bg-white disabled:opacity-40 text-[10px] text-neutral-950"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RIDER KYC */}
          {currentTab === 'RIDER_KYC' && (
            <div className="border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] text-neutral-400 uppercase font-black">
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Applicant Name</th>
                      <th className="py-3 px-4">NIN Code</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-[11px]">
                    {pendingKYC.map((app) => (
                      <tr key={app.id} className="hover:bg-neutral-50/50">
                        <td className="py-3.5 px-4 font-black text-neutral-950">{app.id}</td>
                        <td className="py-3.5 px-4 font-bold text-neutral-900">{app.firstName} {app.lastName}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-neutral-600 underline">{app.idNumber}</td>
                        <td className="py-3.5 px-4 text-neutral-400">{new Date(app.submittedAt).toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(app)}
                            className="bg-neutral-950 hover:bg-neutral-900 text-white font-bold px-3 py-2 rounded-xl text-[10px] uppercase shadow-sm"
                          >
                            Inspect Credentials
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingKYC.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-neutral-400 italic">
                          No pending KYC applications.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING ENGINE */}
          {currentTab === 'PRICING_ENGINE' && (
            <div className="max-w-2xl mx-auto border border-neutral-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <form onSubmit={handleSavePricingConfig} className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Base Currency Fare (₦)</label>
                    <input
                      type="number"
                      value={pricingParams.BASE_FARE || ''}
                      onChange={(e) => updateConfigKey('BASE_FARE', e.target.value)}
                      className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Charge Rate Per Kilometer (₦)</label>
                    <input
                      type="number"
                      value={pricingParams.PER_KM_CHARGE || ''}
                      onChange={(e) => updateConfigKey('PER_KM_CHARGE', e.target.value)}
                      className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Platform Cut Split Percentage (%)</label>
                    <input
                      type="number"
                      value={pricingParams.PLATFORM_SHARE_PERCENTAGE || ''}
                      onChange={(e) => updateConfigKey('PLATFORM_SHARE_PERCENTAGE', e.target.value)}
                      className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Dynamic Surge Multiplier</label>
                    <input
                      type="text"
                      value={pricingParams.SURGE_MULTIPLIER || ''}
                      onChange={(e) => updateConfigKey('SURGE_MULTIPLIER', e.target.value)}
                      className="w-full bg-neutral-50 border rounded-xl p-2.5 outline-none font-mono text-neutral-950 focus:border-neutral-950"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-neutral-950 hover:bg-neutral-900 text-white disabled:opacity-40 font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider text-center shadow-sm"
                  >
                    {isSubmitting ? 'Saving Matrix...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}