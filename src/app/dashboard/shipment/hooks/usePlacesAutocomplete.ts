"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export function usePlacesAutocomplete() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceSuggestion | null>(null);

  const debounce = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback((query: string) => {
    setInput(query);

    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounce.current = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            query
          )}&limit=6`
        );

        const json = await response.json();

        const results: PlaceSuggestion[] = json.features.map(
          (feature: any) => ({
            id: feature.properties.osm_id?.toString() ??
              Math.random().toString(),

            name:
              feature.properties.name ||
              feature.properties.street ||
              "Unknown Location",

            address:
              feature.properties.street ||
              feature.properties.name ||
              "",

            city:
              feature.properties.city ||
              feature.properties.county ||
              "",

            state:
              feature.properties.state ||
              "",

            country:
              feature.properties.country ||
              "",

            latitude:
              feature.geometry.coordinates[1],

            longitude:
              feature.geometry.coordinates[0],
          })
        );

        setSuggestions(results);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const selectPlace = (place: PlaceSuggestion) => {
    setSelectedPlace(place);

    setInput(
      [
        place.name,
        place.address,
        place.city,
      ]
        .filter(Boolean)
        .join(", ")
    );

    setSuggestions([]);
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  const clearSelection = () => {
    setSelectedPlace(null);
    setInput("");
    setSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }
    };
  }, []);

  return {
    inputRef,

    input,
    setInput,

    loading,

    suggestions,

    selectedPlace,

    search,

    selectPlace,

    clearSuggestions,

    clearSelection,
  };
}