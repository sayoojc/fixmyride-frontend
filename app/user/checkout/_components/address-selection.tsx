"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CheckoutAddressStepProps } from "../../../../types/checkout";
import type { Address } from "../../../../types/checkout";
import dynamic from "next/dynamic";
import { useJsApiLoader } from "@react-google-maps/api";

const MapPicker = dynamic(
  () => import("../../../../components/user/MapPicker"),
  {
    ssr: false,
  }
);

export function AddressSelection({
  data,
  onUpdate,
  onNext,
  onBack,
  addresses,
}: CheckoutAddressStepProps) {
  useEffect(() => {
    console.log("addreses", addresses);
  }, [addresses]);
  useEffect(() => {
    console.log("the data", data);
  }, [data]);
  const [mapOpen, setMapOpen] = useState(true);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const handleAddressSelect = (address: Address) => {
    onUpdate({ selectedAddress: address });
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "marker"],
  });
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, geocoder]);

  useEffect(() => {
    console.log("the location useEffect");
    if (navigator.geolocation) {
      console.log("the navigateor.geolocation", navigator.geolocation);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("lat", position.coords.latitude);
          console.log("lng", position.coords.longitude);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setCurrentLocation({ lat, lng });

          // ✅ Only geocode after geocoder is ready
          if (geocoder) {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                console.log("Geocoding result:", results[0]);
                updateAddressFromGeocode(results[0], lat, lng);
              }
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  }, [mapOpen, geocoder]);

  const updateAddressFromGeocode = (
    result: google.maps.GeocoderResult,
    lat?: number,
    lng?: number
  ) => {
    let street = "";
    let city = "";
    let state = "";
    let zipCode = "";

    const addressLine1 = result.formatted_address.split(",")[0];
    for (const component of result.address_components) {
      if (
        component.types.includes("street_number") ||
        component.types.includes("route")
      ) {
        street = result.formatted_address.split(",")[1];
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        zipCode = component.long_name;
      }
    }

    // ✅ Prefer passed-in coordinates if available
    const finalLat = lat ?? currentLocation?.lat;
    const finalLng = lng ?? currentLocation?.lng;

    if (finalLat && finalLng) {
      handleAddressSelect({
        userId: "",
        addressType: "",
        isDefault: false,
        latitude: finalLat,
        longitude: finalLng,
        addressLine1,
        addressLine2: street,
        city,
        state,
        zipCode,
      });
    }
  };

  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      if (geocoder) {
        setCurrentLocation({ lat, lng });
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            updateAddressFromGeocode(results[0], lat, lng);
          }
        });
      }
    },
    [geocoder]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full lg:w-[70%] xl:w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Address
          </CardTitle>
          <CardDescription>select location from map</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <AnimatePresence>
              <motion.div key="map-section" className="space-y-2 w-full">
                <div className="h-64 w-full rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50">
                  {!isLoaded || !currentLocation ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="animate-spin h-6 w-6 border-4 border-red-500 border-t-transparent rounded-full"></div>
                      <span>Loading map...</span>
                    </div>
                  ) : (
                    <MapPicker
                      initialLocation={currentLocation}
                      onMarkerDrag={handleMarkerDrag}
                    />
                  )}
                </div>
              </motion.div>

              {addresses && addresses.length > 0 && (
                <motion.div key="saved-addresses-section" className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                    className="w-full flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Saved Addresses
                    </span>
                    {showSavedAddresses ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {showSavedAddresses && (
                    <motion.div
                      key="addresses-list"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 max-h-48 overflow-y-auto"
                    >
                      {addresses.map((address) => (
                        <motion.div
                          key={address.id || address.addressLine1} // ✅ ensures unique key
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all ${
                              data.selectedAddress?.id === address.id
                                ? "ring-2 ring-red-500 ring-offset-2 bg-red-50 border-red-200"
                                : "hover:shadow-md hover:bg-gray-50"
                            }`}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">
                                      {address.addressLine1}
                                    </h4>
                                    {address.isDefault && (
                                      <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {address.addressLine2}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.city}, {address.state}{" "}
                                    {address.zipCode}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {data.selectedAddress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-600">
                Selected address:{" "}
                <span className="font-semibold text-gray-900">
                  {data.selectedAddress.addressLine1}
                </span>
              </p>
            </motion.div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="hover:bg-gray-50 bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={onNext}
              className="min-w-24 bg-red-500 hover:bg-red-600 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
