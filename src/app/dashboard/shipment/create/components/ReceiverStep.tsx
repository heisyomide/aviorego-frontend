'use client';

import { ShipmentFormData } from "../../types";

interface ReceiverStepProps {
  formData: ShipmentFormData;
  updateForm: (data: Partial<ShipmentFormData>) => void;
  onNext: () => void;
}

export default function ReceiverStep({
  formData,
  updateForm,
  onNext,
}: ReceiverStepProps) {
  const receiverName = formData.receiver?.receiverName || "";
  const receiverPhone = formData.receiver?.receiverPhone || "";

  const canContinue = receiverName.trim() !== "" && receiverPhone.trim() !== "";

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black">Receiver Information</h2>
          <p className="text-sm text-neutral-500 mt-2">
            Who should receive this shipment?
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Receiver Name</label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) =>
                updateForm({
                  receiver: {
                    ...formData.receiver,
                    receiverName: e.target.value,
                  },
                })
              }
              placeholder="John Doe"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) =>
                updateForm({
                  receiver: {
                    ...formData.receiver,
                    receiverPhone: e.target.value,
                  },
                })
              }
              placeholder="+234 801 234 5678"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          canContinue
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}