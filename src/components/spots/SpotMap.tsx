"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

interface SpotMapProps {
  lat: number;
  long: number;
  zoom?: number;
  height?: string;
}

// Custom marker with Spotter wind icon
const surfIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="markerGrad" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="100%" stop-color="#0891b2"/>
        </linearGradient>
        <filter id="shadow" x="-50%" y="-20%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Pin shape -->
      <path d="M20 44C20 44 36 28 36 18C36 9.163 28.837 2 20 2C11.163 2 4 9.163 4 18C4 28 20 44 20 44Z" 
        fill="url(#markerGrad)" 
        filter="url(#shadow)"
        stroke="rgba(255,255,255,0.3)" 
        stroke-width="1.5"/>
      
      <!-- Spotter wind icon (scaled and centered) -->
      <g transform="translate(11.5, 11) scale(0.7)">
        <path d="M19.7 5.7a2.5 2.5 0 1 1 1.8 4.3H2" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M11.6 2.6A2 2 0 1 1 13 6H2" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M14.6 17.4A2 2 0 1 0 16 14H2" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </g>
    </svg>
  `)}`,
  iconSize: [40, 48],
  iconAnchor: [20, 46],
  popupAnchor: [0, -46],
});

export const SpotMap: React.FC<SpotMapProps> = ({
  lat,
  long,
  zoom = 13,
  height = "h-[250px]",
}) => {
  const position: LatLngExpression = [lat, long];

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10">
      <MapContainer
        center={position}
        zoom={zoom}
        className={`${height} w-full`}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='
            &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>
          '
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={surfIcon} />
      </MapContainer>
      {/* Subtle blue tint overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: "rgba(6, 182, 212, 0.12)",
          mixBlendMode: "multiply",
          zIndex: 500,
        }}
      />
    </div>
  );
};
