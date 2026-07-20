export type DeliverySpeed =
  | "STANDARD"
  | "EXPRESS"
  | "SCHEDULED";

export type DeliveryMethod =
  | "hand"
  | "smart";

  export type DeliveryType =

  | "PARCEL"

  | "FOOD"

  | "GROCERY"

  | "PHARMACY"

  | "DOCUMENT";

export type WeightRange =
  | "UNDER_1KG"
  | "FROM_1_3KG"
  | "FROM_3_5KG"
  | "FROM_5_10KG"
  | "FROM_10_20KG"
  | "ABOVE_20KG";

export type PackageCategory =
  | "SMALL_PARCEL"
  | "MEDIUM_PARCEL"
  | "LARGE_PARCEL"
  | "FRAGILE_ITEM"
  | "CLOTHING"
  | "ELECTRONICS";

export interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

export interface ReceiverInformation {
  receiverName: string;
  receiverPhone: string;
}

// Main Form Data - Using Nested Structure (Recommended)
export interface ShipmentFormData {
  // Locations (Nested - cleaner for forms)
  pickup: AddressData;
  destination: AddressData;
     deliverySpeed: DeliverySpeed,
    
  // Package Details
  packageCategory: PackageCategory;
  weightRange: WeightRange;

  // Delivery Options
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;

  // Receiver
  receiver: ReceiverInformation;

  // Additional
  deliveryNote: string;
  verificationPin: string;

  // Special Handling
  isFragile: boolean;
  waterproof: boolean;
  keepUpright: boolean;
  handleWithCare: boolean;
}

// Optional: Flat version for backend payload
export interface FlatShipmentPayload extends Omit<ShipmentFormData, 'pickup' | 'destination' | 'receiver'> {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupPlaceId: string;

  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  destinationPlaceId: string;

  receiverName: string;
  receiverPhone: string;
}

export interface PricingRequest {
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  packageCategory: PackageCategory;
  weightRange: WeightRange;
  isExpress: boolean;
  waterproof: boolean;
}

export interface PricingResponse {
  distanceKm: number;
  estimatedMinutes: number;
  detectedRegion: string;
  breakdown: {
    baseFee: number;
    pickupDistanceFee: number;
    deliveryDistanceFee: number;
    extraCharges: number;
  };
  totalDeliveryFee: number;
}

export interface ShipmentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    trackingCode: string;
    verificationPin: string;
    totalPrice: number;
  };
}

// app/shipment/types.ts

export type ShipmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_AT_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
}

export interface TimelineEvent {
  id: string;
  status: ShipmentStatus;
  description: string;
  changedBy: string;
  createdAt: string;
}

export interface Shipment {
  id: string;

  trackingCode: string;

  status: ShipmentStatus;

  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupPlaceId: string;

  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  destinationPlaceId: string;

  recipient: string;
  recipientPhone: string;

  packageCategory: string;
  weightRange: string;

  totalPrice: number;

  distanceKm: number;

  estimatedMinutes: number;

  createdAt: string;

  rider?: Rider | null;

  timelineEvents: TimelineEvent[];
}
export interface ShipmentStats {
  active: number;
  inTransit: number;
  delivered: number;
}

export interface RecentShipment {
  id: string;
  recipient: string;
  destination: string;
  status: "Active" | "In Transit" | "Delivered";
  date: string;
}

export interface LiveLocation {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  updatedAt?: string;
}