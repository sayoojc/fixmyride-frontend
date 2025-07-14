import React, { useEffect, useRef } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

interface MapPickerProps {
  initialLocation: { lat: number; lng: number };
  onMarkerDrag: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ initialLocation, onMarkerDrag }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const mapStyles = {
    height: "300px",
    width: "100%",
    borderRadius: "8px",
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMarkerDrag(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      center={initialLocation}
      zoom={15}
      onLoad={handleMapLoad}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      <MarkerF
        position={initialLocation}
        draggable={true}
        onDragEnd={handleMarkerDragEnd}
        onLoad={(marker) => (markerRef.current = marker)}
      />
    </GoogleMap>
  );
};

export default MapPicker;