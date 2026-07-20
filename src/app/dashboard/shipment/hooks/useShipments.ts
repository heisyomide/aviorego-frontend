'use client';

import { useEffect, useState } from "react";
import { ShipmentService } from "../services/shipments.service";
import { useAuth } from "@/src/context/AuthContext";

export function useShipments() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [shipments, setShipments] = useState([]);

  const [stats, setStats] = useState({
    active: 0,
    inTransit: 0,
    delivered: 0,
  });

  const loadDashboard = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response =
        await ShipmentService.getDashboard(token);

      setShipments(response.shipments);

      setStats(response.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  return {
    loading,
    shipments,
    stats,
    refresh: loadDashboard,
  };
}