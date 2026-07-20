"use client";

import ShipmentHeader from "./components/ShipmentHeader";
import ShipmentStats from "./components/ShipmentStats";
import ShipmentOverview from "./components/ShipmentOverview";
import { useShipments } from "./hooks/useShipments";

export default function ShipmentDashboardPage() {
  const {
    loading,
    shipments,
    stats,
    refresh,
  } = useShipments();

return (
  <div className="space-y-8">

    <ShipmentHeader
      onRefresh={refresh}
      onTrack={(trackingCode) => {
        console.log(trackingCode);
      }}
    />

    <ShipmentStats
      stats={stats}
      loading={loading}
    />

    <ShipmentOverview
      shipments={shipments}
      loading={loading}
    />

  </div>
);
}