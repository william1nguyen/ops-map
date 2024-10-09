// src/components/MapComponent.js
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerImage from "../../assets/gps_10577745.png";

const customIcon = L.icon({
  iconUrl: markerImage,
  iconSize: [10, 10],
  iconAnchor: [7, 10],
  popupAnchor: [-3, -36],
});

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initialMap = L.map("map").setView([14.0583, 108.2772], 6);
    L.tileLayer("https://tmdt.fimo.edu.vn/hot/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(initialMap);

    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      const existingMarker = markers.find(
        (marker) =>
          marker.getLatLng().lat === lat && marker.getLatLng().lng === lng
      );

      if (existingMarker) {
        removeMarker(existingMarker);
      } else {
        addMarker(e.latlng);
      }
    };

    const addMarker = (latlng) => {
      const newMarker = L.marker(latlng, { icon: customIcon }).addTo(map);
      newMarker
        .bindPopup("<b>New Marker</b><br>Location: " + latlng.toString())
        .openPopup();

      newMarker.on("click", () => {
        removeMarker(newMarker);
      });

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    const removeMarker = (marker) => {
      map.removeLayer(marker);
      setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker));
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      markers.forEach((marker) => map.removeLayer(marker));
    };
  }, [map, markers]);

  return <div id="map" style={{ height: "500px", width: "100%" }} />;
};

export default MapComponent;
