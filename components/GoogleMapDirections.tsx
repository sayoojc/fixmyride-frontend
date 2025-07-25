"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  TrafficLayer,
  Marker,
} from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "400px",
};

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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

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

            // Voice directions
            const steps = result.routes[0].legs[0].steps;
            const directionsText = steps
              .map((step) => step.instructions.replace(/<[^>]*>/g, ""))
              .join(". ");

            const utterance = new SpeechSynthesisUtterance(directionsText);
            utterance.lang = "en-US";
            window.speechSynthesis.speak(utterance);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [isLoaded, providerLocation, clientLocation]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={providerLocation}
      zoom={13}
    >
      {/* Traffic Layer */}
      <TrafficLayer />

      {/* Custom Markers */}
<Marker
  position={providerLocation}
  icon={{
    url: "/crane.png",
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 40), // Adjust anchor point as needed
  }}
/>

<Marker
  position={clientLocation}
  icon={{
    url: "/car.png",
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 40), // Adjust anchor point as needed
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
