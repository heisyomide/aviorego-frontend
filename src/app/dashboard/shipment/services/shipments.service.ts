import { Shipment } from "../types";

// Clean the API_URL to remove any accidental trailing slashes and provide a solid local fallback
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

export class ShipmentService {
  static async getDashboard(token: string) {
    const response = await fetch(
      `${API_URL}/shipments/customer/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load shipment dashboard.");
    }

    return response.json();
  }

  static async getShipment(
    id: string,
    token: string,
  ): Promise<Shipment> {
    const response = await fetch(
      `${API_URL}/shipments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to fetch shipment.");
    }

    return response.json();
  }

  static async trackShipment(
    trackingCode: string,
    token: string,
  ) {
    const response = await fetch(
      `${API_URL}/shipments/track/${trackingCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Shipment not found.");
    }

    return response.json();
  }

  static async cancelShipment(
    id: string,
    token: string,
  ) {
    const response = await fetch(
      `${API_URL}/shipments/${id}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to cancel shipment.");
    }

    return response.json();
  }
}