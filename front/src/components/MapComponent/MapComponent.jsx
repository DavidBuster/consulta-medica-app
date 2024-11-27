import React, { useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "drawing"],
  });

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 52.379189, // Reemplaza con la latitud de tu ubicación
    lng: 4.900933, // Reemplaza con la longitud de tu ubicación
  };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
