"use client";

import React from "react";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

export type SpotMapPosition = [number, number];

interface SpotMapRootBaseProps {
  zoom?: number;
  height?: string;
  children?: React.ReactNode;
}

type SpotMapRootWithCenter = SpotMapRootBaseProps & {
  center: SpotMapPosition;
  bounds?: never;
};

type SpotMapRootWithBounds = SpotMapRootBaseProps & {
  bounds: SpotMapPosition[];
  center?: never;
};

export type SpotMapRootProps = SpotMapRootWithCenter | SpotMapRootWithBounds;

function hasBounds(props: SpotMapRootProps): props is SpotMapRootWithBounds {
  return "bounds" in props;
}

export interface SpotMapPinProps {
  lat: number;
  long: number;
  href?: string;
  label?: string;
}

export interface SpotMapProps {
  lat: number;
  long: number;
  zoom?: number;
  height?: string;
}

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
  <path d="M20 44C20 44 36 28 36 18C36 9.163 28.837 2 20 2C11.163 2 4 9.163 4 18C4 28 20 44 20 44Z"
    fill="url(#markerGrad)"
    filter="url(#shadow)"
    stroke="rgba(255,255,255,0.3)"
    stroke-width="1.5"/>
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

export const SpotMapRoot: React.FC<SpotMapRootProps> = ({
  zoom = 13,
  height = "h-[250px]",
  children,
  ...props
}) => {
  const usesBounds = hasBounds(props);

  if (usesBounds && props.bounds.length === 0) {
    throw new Error("SpotMapRoot requires at least one bounds point.");
  }

  const mapProps = usesBounds
    ? {
        bounds: props.bounds as LatLngBoundsExpression,
        boundsOptions: {
          padding: [32, 32] as [number, number],
          maxZoom: 11,
        },
      }
    : {
        center: props.center as LatLngExpression,
        zoom,
      };

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10">
      <MapContainer
        {...mapProps}
        className={`${height} w-full`}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {children}
      </MapContainer>
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

export const SpotMapPin: React.FC<SpotMapPinProps> = ({
  lat,
  long,
  href,
  label,
}) => {
  const router = useRouter();
  const position: LatLngExpression = [lat, long];

  return (
    <Marker
      position={position}
      icon={surfIcon}
      title={label}
      eventHandlers={
        href === undefined
          ? undefined
          : {
              click: () => {
                router.push(href, { scroll: false });
              },
            }
      }
    />
  );
};

export const SpotMap: React.FC<SpotMapProps> = ({
  lat,
  long,
  zoom = 13,
  height = "h-[250px]",
}) => {
  return (
    <SpotMapRoot center={[lat, long]} zoom={zoom} height={height}>
      <SpotMapPin lat={lat} long={long} />
    </SpotMapRoot>
  );
};
