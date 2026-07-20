// app/shipment/hooks/useShipment.ts

"use client";

import { useState } from "react";
import { ShipmentFormData } from "../types";

const initialState: ShipmentFormData = {
  pickup: {
    address: "",
    latitude: 0,
    longitude: 0,
    placeId: "",
  },

  destination: {
    address: "",
    latitude: 0,
    longitude: 0,
    placeId: "",
  },

  packageCategory: "SMALL_PARCEL",

  weightRange: "UNDER_1KG",

  deliveryType: "PARCEL",
    deliverySpeed: "STANDARD",
    
  deliveryMethod: "hand",

  receiver: {
    receiverName: "",
    receiverPhone: "",
  },

  deliveryNote: "",

  verificationPin: "",

  isFragile: false,

  waterproof: false,

  keepUpright: false,

  handleWithCare: false,
};

export function useShipment() {
  const [currentStep, setCurrentStep] = useState(1);

  const [shipment, setShipment] =
    useState<ShipmentFormData>(initialState);

  function nextStep() {
    setCurrentStep((prev) => prev + 1);
  }

  function previousStep() {
    setCurrentStep((prev) =>
      Math.max(prev - 1, 1)
    );
  }

  function goToStep(step: number) {
    setCurrentStep(step);
  }

  function updateShipment(
    values: Partial<ShipmentFormData>
  ) {
    setShipment((prev) => ({
      ...prev,
      ...values,
    }));
  }

  function updatePickup(
    address: ShipmentFormData["pickup"]
  ) {
    setShipment((prev) => ({
      ...prev,
      pickup: address,
    }));
  }

  function updateDestination(
    address: ShipmentFormData["destination"]
  ) {
    setShipment((prev) => ({
      ...prev,
      destination: address,
    }));
  }

  function updateReceiver(
    receiver: ShipmentFormData["receiver"]
  ) {
    setShipment((prev) => ({
      ...prev,
      receiver,
    }));
  }

  function setVerificationPin(pin: string) {
    setShipment((prev) => ({
      ...prev,
      verificationPin: pin,
    }));
  }

  function resetShipment() {
    setShipment(initialState);
    setCurrentStep(1);
  }

  return {
    shipment,

    currentStep,

    nextStep,

    previousStep,

    goToStep,

    updateShipment,

    updatePickup,

    updateDestination,

    updateReceiver,

    setVerificationPin,

    resetShipment,
  };

  
}