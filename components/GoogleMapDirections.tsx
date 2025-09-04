"use client";

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer,
  TrafficLayer,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GOOGLE_LIBRARIES: (
  "places" | "geometry" | "drawing" | "localContext" | "visualization"
)[] = ["places"];

interface LatLng {
  lat: number;
  lng: number;
}

interface GoogleMapDirectionsProps {
  providerLocation: LatLng;
  clientLocation: LatLng;
}

const GoogleMapDirections: React.FC<GoogleMapDirectionsProps> = ({
  providerLocation,
  clientLocation,
}) => {
 const { isLoaded } = useLoadScript({
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: ["places", "geometry", "drawing", "visualization"],
});


  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: providerLocation,
          destination: clientLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [isLoaded, providerLocation, clientLocation]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={providerLocation} zoom={13}>
      <TrafficLayer />

      {/* Provider marker */}
      <Marker
        position={providerLocation}
        icon={{
          url: "/crane.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        }}
      />

      {/* Client marker */}
      <Marker
        position={clientLocation}
        icon={{
          url: "/car.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        }}
      />

      {/* Route */}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default GoogleMapDirections;
