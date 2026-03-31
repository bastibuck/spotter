import React from "react";

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
  center?: SpotMapPosition;
  zoom?: number;
  height?: string;
}

export default function HomepageSpotMap({
  spots,
  center,
  zoom = 11,
  height = "h-[500px] md:h-[660px] lg:h-[720px]",
}: HomepageSpotMapProps): React.JSX.Element {
  const mapBounds = spots.map(
    (spot) => [spot.lat, spot.long] as SpotMapPosition,
  );

  return (
    <SpotMapRoot
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
