"use client";

import type { ShipmentStats as ShipmentStatsType } from "../types";

interface Props {
  stats: ShipmentStatsType;
  loading?: boolean;
}

export default function ShipmentStats({
  stats,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 rounded-3xl bg-neutral-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const total =
    stats.active +
    stats.inTransit +
    stats.delivered;

  const cards = [
    {
      title: "ALL SHIPMENTS",
      value: total,
      color: "text-white",
      bg: "bg-neutral-950",
      line: "bg-green-500",
    },
    {
      title: "ACTIVE",
      value: stats.active,
      color: "text-amber-500",
      bg: "bg-white",
      line: "bg-amber-400",
    },
    {
      title: "IN TRANSIT",
      value: stats.inTransit,
      color: "text-blue-600",
      bg: "bg-white",
      line: "bg-blue-500",
    },
    {
      title: "DELIVERED",
      value: stats.delivered,
      color: "text-green-600",
      bg: "bg-white",
      line: "bg-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bg} rounded-3xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-lg transition`}
        >
          <div className="p-6">

            <p
              className={`text-[11px] font-black tracking-[0.2em] uppercase ${
                card.bg === "bg-neutral-950"
                  ? "text-neutral-400"
                  : "text-neutral-400"
              }`}
            >
              {card.title}
            </p>

            <h2
              className={`mt-5 text-5xl font-black tracking-tight ${
                card.bg === "bg-neutral-950"
                  ? "text-white"
                  : card.color
              }`}
            >
              {card.value}
            </h2>

          </div>

          <div className={`h-2 ${card.line}`} />
        </div>
      ))}
    </div>
  );
}