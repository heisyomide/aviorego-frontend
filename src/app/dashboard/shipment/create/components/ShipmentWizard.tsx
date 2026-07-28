'use client';

import { useState, useMemo } from 'react';

import PickupStep from './PickupStep';
import PackageStep from './PackageStep';
import ReceiverStep from './ReceiverStep';
import DeliveryMethodStep from './DeliveryMethodStep';
import SmartDeliveryStep from './SmartDeliveryStep';
import PinStepProps from './PinStep';
import CheckoutStep from './CheckoutStep';
import PaymentSheet from './PaymentSheet';
import SuccessModalProps from './SuccessModal';
import StepIndicator from './StepIndicator';
import { useAuth } from '@/src/context/AuthContext';
import { ShipmentFormData, PricingResponse } from '../../types';
import { useShipment } from '../../hooks/useShipment';
import { usePricing } from '../../hooks/usePricing';

export default function ShipmentWizard() {
const [step, setStep] = useState(1);
const [pin, setPin] =useState("");

const [paymentOpen,setPaymentOpen]=useState(false);
const [paymentLoading,setPaymentLoading]=useState(false);

const [successOpen,setSuccessOpen]=useState(false);
const [trackingCode,setTrackingCode]=useState("");

  // Hooks
  const { shipment: formData, updateShipment, resetShipment } = useShipment();
  const { 
    pricing, 
    isLoading: pricingLoading, 
    calculatePrice 
  } = usePricing();

  const isSmartDelivery = formData.deliveryMethod === 'smart';

  const totalSteps = isSmartDelivery ? 7 : 6;
  const { token, user } = useAuth();
  const checkoutStep = isSmartDelivery ? 7 : 6;
  const pinStep = isSmartDelivery ? 6 : 5;
  const smartDeliveryStep = 5;

  const updateForm = (updates: Partial<ShipmentFormData>) => {
    updateShipment(updates);
  };

  const handleNext = async () => {
    if (step === pinStep) {
      // Calculate final pricing before checkout
      await calculatePrice({
        pickupLat: formData.pickup.latitude,
        pickupLng: formData.pickup.longitude,
        destinationLat: formData.destination.latitude,
        destinationLng: formData.destination.longitude,
        packageCategory: formData.packageCategory,
        weightRange: formData.weightRange,
        isExpress: formData.deliverySpeed === "EXPRESS",
        waterproof: formData.waterproof,
      });
    }

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleCheckout = () => setPaymentOpen(true);

  const handleClosePayment = () => setPaymentOpen(false);

const createShipment = async () => {
  if (!token) {
    throw new Error("User is not authenticated.");
  }

  // Determine sender details from formData or fallback to authenticated user context
  const senderName =
    formData.sender?.senderName ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || "");

  const senderPhone = formData.sender?.senderPhone || user?.phone || user?.phoneNumber || "";

  const payload = {
    // Sender Information (Required by Backend DTO)
    senderName,
    senderPhone,

    deliveryType: formData.deliveryType,
    deliverySpeed: formData.deliverySpeed,
    packageCategory: formData.packageCategory,
    weightRange: formData.weightRange,

    pickupAddress: formData.pickup.address,
    pickupLat: formData.pickup.latitude,
    pickupLng: formData.pickup.longitude,
    pickupPlaceId: formData.pickup.placeId,

    destinationAddress: formData.destination.address,
    destinationLat: formData.destination.latitude,
    destinationLng: formData.destination.longitude,
    destinationPlaceId: formData.destination.placeId,

    // Receiver Information
    receiverName: formData.receiver.receiverName,
    receiverPhone: formData.receiver.receiverPhone,

    verificationPin: pin,
    deliveryMethod: formData.deliveryMethod,
    waterproof: formData.waterproof,
    isExpress: formData.deliverySpeed === "EXPRESS",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shipments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message
    );
  }

  return result.data;
};
const initializeFlutterwavePayment = async () => {
  // Prevent duplicate triggers if already loading or pricing not ready
  if (!pricing || paymentLoading) return;

  try {
    setPaymentLoading(true);

    // 1. Create the shipment in AWAITING_PAYMENT status
    const shipment = await createShipment();

    if (!shipment?.id) {
      throw new Error("Failed to create shipment. Please try again.");
    }

    setTrackingCode(shipment.trackingCode);

    // 2. Prepare user payload safely
    const payload = {
      shipmentId: shipment.id,
      customerId: user?.id,
      customerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Customer',
      email: user?.email || '',
      phone: user?.phoneNumber || user?.phone || '',
      amount: Number(shipment.totalPrice || pricing.totalDeliveryFee),
      redirectUrl: `${window.location.origin}/payment/verify`,
    };

    // 3. Call NestJS backend initialization route
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/flutterwave/initialize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    // Extract payment link safely regardless of global response interceptors
    const flutterwaveUrl =
      result.data?.link ||
      result.data?.data?.link ||
      result.link;

    if (!response.ok || !flutterwaveUrl) {
      throw new Error(
        result.message || result.error || "Failed to generate Flutterwave payment link."
      );
    }

    // 4. Redirect top-level window directly to Flutterwave hosted page
    window.location.href = flutterwaveUrl;

  } catch (error: any) {
    console.error("Flutterwave initialization failed:", error);
    alert(error.message || "Unable to initialize payment. Please try again.");
  } finally {
    setPaymentLoading(false);
  }
};
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-black">Create Shipment</h1>
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Wizard Body */}
      <div className="flex-1 px-6 py-6">
        {step === 1 && (
          <PickupStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === 2 && (
          <PackageStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === 3 && (
          <ReceiverStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === 4 && (
          <DeliveryMethodStep 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext} 
          />
        )}

        {step === smartDeliveryStep && isSmartDelivery && (
          <SmartDeliveryStep 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {step === pinStep && (
          <PinStepProps 
            pin={pin} 
            setPin={setPin} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}

        {step === checkoutStep && (
          <CheckoutStep
            formData={formData}
            pricing={pricing ?? null}
            loading={pricingLoading}
            submitting={false}
            error={null}
            onBack={handleBack}
            onPay={handleCheckout}
          />
        )}
      </div>

      {/* Payment Sheet */}
<PaymentSheet
    open={paymentOpen}
    pricing={pricing ?? null}
    loading={paymentLoading}
    onClose={handleClosePayment}
    onFlutterwave={initializeFlutterwavePayment}
/>

      {/* Success Modal */}
      <SuccessModalProps
              open={successOpen}
              trackingCode={trackingCode}
              onClose={() => {
                  setSuccessOpen(true);
                  resetShipment();
                  setStep(1);
                  setPin('');
              } } pin={''}      />
    </div>
  );
}