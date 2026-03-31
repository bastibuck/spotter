import React from "react";

import { SpotMapPin, SpotMapRoot } from "~/components/spots/SpotMapWrapper";

type SpotMapRootProps = React.ComponentProps<typeof SpotMapRoot>;
type HomepageSpotMapPosition = Exclude<SpotMapRootProps["center"], undefined>;
type HomepageSpotMapBounds = Exclude<SpotMapRootProps["bounds"], undefined>;
type HomepageSpotMapSpotCoordinates = Pick<
  React.ComponentProps<typeof SpotMapPin>,
  "lat" | "long"
>;

interface HomepageSpotMapSpot extends HomepageSpotMapSpotCoordinates {
  id: number;
  name: string;
}

interface HomepageSpotMapProps {
  spots: HomepageSpotMapSpot[];
  center?: HomepageSpotMapPosition;
  zoom?: SpotMapRootProps["zoom"];
  height?: SpotMapRootProps["height"];
}

export default function HomepageSpotMap({
  spots,
  center,
  zoom = 11,
  height = "h-[500px] md:h-[660px] lg:h-[720px]",
}: HomepageSpotMapProps): React.JSX.Element {
  const mapBounds: HomepageSpotMapBounds = spots.map(
    (spot): HomepageSpotMapPosition => [spot.lat, spot.long],
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
