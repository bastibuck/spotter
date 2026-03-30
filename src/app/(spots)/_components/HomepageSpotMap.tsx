"use client";

import React, { useEffect, useMemo, useState } from "react";

import { SpotMapPin, SpotMapRoot } from "~/components/spots/SpotMapWrapper";

type SpotMapPosition = [number, number];

interface HomepageSpotMapSpot {
  id: number;
  name: string;
  lat: number;
  long: number;
}

interface HomepageSpotMapProps {
  spots: HomepageSpotMapSpot[];
  roughCenter?: SpotMapPosition;
  zoom?: number;
  height?: string;
}

export default function HomepageSpotMap({
  spots,
  roughCenter,
  zoom = 11,
  height = "h-[500px] md:h-[660px] lg:h-[720px]",
}: HomepageSpotMapProps): React.JSX.Element {
  const [preciseCenter, setPreciseCenter] = useState<
    SpotMapPosition | undefined
  >(undefined);

  const mapBounds = useMemo(
    () => spots.map((spot) => [spot.lat, spot.long] as SpotMapPosition),
    [spots],
  );

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPreciseCenter([coords.latitude, coords.longitude]);
      },
      () => {
        setPreciseCenter(undefined);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 5000,
      },
    );
  }, []);

  const center = preciseCenter ?? roughCenter;

  return (
    <SpotMapRoot
      key={
        center === undefined
          ? `bounds:${mapBounds.length}`
          : `center:${center[0]}:${center[1]}:${zoom}`
      }
      {...(center === undefined
        ? { bounds: mapBounds }
        : {
            center,
            zoom,
          })}
      height={height}
    >
      {spots.map((spot) => (
        <SpotMapPin
          key={spot.id}
          lat={spot.lat}
          long={spot.long}
          href={`/spot/${spot.id}`}
          label={spot.name}
        />
      ))}
    </SpotMapRoot>
  );
}
