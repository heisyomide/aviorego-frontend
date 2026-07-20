'use client';

import { useEffect } from 'react';
import { MapPin, Navigation, Clock3, Wallet } from 'lucide-react';

import { ShipmentFormData } from '../../types';
import {
  PlaceSuggestion,
  usePlacesAutocomplete,
} from '../../hooks/usePlacesAutocomplete';
import MiniMap from './MiniMap';

interface PickupStepProps {
  formData: ShipmentFormData;
  updateForm: (data: Partial<ShipmentFormData>) => void;
  onNext: () => void;

  distanceKm?: number;
  eta?: number;
  estimatedPrice?: number;
}

export default function PickupStep({
  formData,
  updateForm,
  onNext,
  distanceKm,
  eta,
  estimatedPrice,
}: PickupStepProps) {
  const pickup = usePlacesAutocomplete();
  const destination = usePlacesAutocomplete();

  useEffect(() => {
    if (formData.pickup?.address) {
      pickup.setInput(formData.pickup.address);
    }

    if (formData.destination?.address) {
      destination.setInput(formData.destination.address);
    }
  }, []);

  const selectPickup = (place: PlaceSuggestion) => {
    pickup.selectPlace(place);

    updateForm({
      pickup: {
        placeId: place.id,
        address: `${place.name}, ${place.city}`,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    });
  };

  const selectDestination = (place: PlaceSuggestion) => {
    destination.selectPlace(place);

    updateForm({
      destination: {
        placeId: place.id,
        address: `${place.name}, ${place.city}`,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    });
  };

  const canContinue =
    !!formData.pickup?.address &&
    !!formData.destination?.address;

  return (
    <div className="flex h-full flex-col justify-between">

      <div className="space-y-7">

        <div>
          <h2 className="text-2xl font-black">
            Pickup & Destination
          </h2>

          <p className="text-sm text-neutral-500 mt-2">
            Search using landmarks, streets or businesses.
          </p>
        </div>

        {/* Pickup */}

        <div>

          <label className="font-semibold mb-2 block">
            Pickup Location
          </label>

          <input
            value={pickup.input}
            onChange={(e) => pickup.search(e.target.value)}
            placeholder="Search pickup..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />

          {pickup.loading && (
            <p className="text-sm mt-2">
              Searching...
            </p>
          )}

          {pickup.suggestions.length > 0 && (

            <div className="mt-2 rounded-xl border overflow-hidden">

  {pickup.suggestions.map((place, index) => (

<button
   key={`${place.id}-${index}`}
                  type="button"
                  onClick={() => selectPickup(place)}
                  className="flex gap-3 w-full p-4 hover:bg-neutral-50 border-b last:border-none"
                >
                  <MapPin className="text-green-600 w-5 h-5 mt-1"/>

                  <div className="text-left">

                    <p className="font-semibold">
                      {place.name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {place.address}, {place.city}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

        {/* Destination */}

        <div>

          <label className="font-semibold mb-2 block">
            Destination
          </label>

          <input
            value={destination.input}
            onChange={(e)=>destination.search(e.target.value)}
            placeholder="Search destination..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />

          {destination.loading && (
            <p className="text-sm mt-2">
              Searching...
            </p>
          )}

          {destination.suggestions.length>0 && (

            <div className="mt-2 rounded-xl border overflow-hidden">

{destination.suggestions.map((place, index) => (

<button
   key={`${place.id}-${index}`}
                  type="button"
                  onClick={()=>selectDestination(place)}
                  className="flex gap-3 w-full p-4 hover:bg-neutral-50 border-b last:border-none"
                >
                  <Navigation className="w-5 h-5 text-red-500 mt-1"/>

                  <div className="text-left">

                    <p className="font-semibold">
                      {place.name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {place.address}, {place.city}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

        {/* Route Preview */}

        {canContinue && (

          <div className="rounded-2xl border bg-neutral-50 p-4">

<MiniMap
    pickup={formData.pickup}
    destination={formData.destination}
/>

            <div className="grid grid-cols-3 gap-4 mt-5">

              <div className="rounded-xl bg-white p-4 text-center shadow-sm">

                <Navigation className="mx-auto mb-2"/>

                <p className="text-xs text-neutral-500">
                  Distance
                </p>

                <p className="font-bold">
                  {distanceKm ?? "--"} km
                </p>

              </div>

              <div className="rounded-xl bg-white p-4 text-center shadow-sm">

                <Clock3 className="mx-auto mb-2"/>

                <p className="text-xs text-neutral-500">
                  ETA
                </p>

                <p className="font-bold">
                  {eta ?? "--"} mins
                </p>

              </div>

              <div className="rounded-xl bg-white p-4 text-center shadow-sm">

                <Wallet className="mx-auto mb-2"/>

                <p className="text-xs text-neutral-500">
                  Fare
                </p>

                <p className="font-bold">
                  ₦{estimatedPrice?.toLocaleString() ?? "--"}
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

      <button
        disabled={!canContinue}
        onClick={onNext}
        className="mt-8 rounded-xl bg-green-600 py-4 font-bold text-white disabled:bg-neutral-300 disabled:text-neutral-500"
      >
        Continue
      </button>

    </div>
  );
}