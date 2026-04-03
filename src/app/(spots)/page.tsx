import { headers } from "next/headers";
import React from "react";
import { Suspense } from "react";
import { db } from "~/server/db";

import HomepageHeroSection from "./_components/HomepageHeroSection";
import HomepageMapSectionSkeleton from "./_components/HomepageMapSectionSkeleton";
import HomepageSpotMap from "./_components/HomepageSpotMap";
import HomepageSuggestionSection from "./_components/HomepageSuggestionSection";

// Zoom 10 keeps the map centered on the visitor while showing a bit more of the surrounding area.
const HOMEPAGE_MAP_ZOOM = 10;
type SpotMapPosition = [number, number];
interface HomepageSpot {
  id: number;
  name: string;
  lat: number;
  long: number;
}

const KIEL_POSITION: SpotMapPosition = [54.3233, 10.1228];

async function getAllSpots() {
  return db.query.spots.findMany();
}

function parseCoordinate(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const coordinate = Number.parseFloat(value);

  return Number.isFinite(coordinate) ? coordinate : undefined;
}

async function getHomepageMapCenter(): Promise<SpotMapPosition | undefined> {
  const requestHeaders = await headers();
  const lat = parseCoordinate(
    requestHeaders.get("x-vercel-ip-latitude") ?? undefined,
  );
  const lng = parseCoordinate(
    requestHeaders.get("x-vercel-ip-longitude") ?? undefined,
  );

  if (lat === undefined || lng === undefined) {
    return undefined;
  }

  return [lat, lng];
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getDistanceInKilometers(
  [fromLat, fromLng]: SpotMapPosition,
  [toLat, toLng]: SpotMapPosition,
): number {
  const earthRadiusInKilometers = 6371;
  const latDistance = toRadians(toLat - fromLat);
  const lngDistance = toRadians(toLng - fromLng);
  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(lngDistance / 2) ** 2;

  return (
    2 * earthRadiusInKilometers * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function getClosestSpotCenter(
  spots: HomepageSpot[],
  targetPosition: SpotMapPosition,
): SpotMapPosition | undefined {
  let closestSpot: HomepageSpot | undefined;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const spot of spots) {
    const distance = getDistanceInKilometers(targetPosition, [
      spot.lat,
      spot.long,
    ]);

    if (distance < closestDistance) {
      closestSpot = spot;
      closestDistance = distance;
    }
  }

  if (closestSpot === undefined) {
    return undefined;
  }

  return [closestSpot.lat, closestSpot.long];
}

async function HomepageMapSection(): Promise<React.JSX.Element> {
  const allSpots = await getAllSpots();
  const requestLocation = (await getHomepageMapCenter()) ?? KIEL_POSITION;
  const mapCenter =
    getClosestSpotCenter(allSpots, requestLocation) ?? KIEL_POSITION;

  if (allSpots.length === 0) {
    return (
      <div className="glass-card rounded-[2rem] text-center">
        <div className="bg-ocean-800/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-ocean-300 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-ocean-200 text-lg">No spots found.</p>
      </div>
    );
  }

  return (
    <section className="relative">
      <div className="bg-aqua-400/10 absolute top-10 -left-8 h-40 w-40 rounded-full blur-3xl" />
      <div className="bg-ocean-300/10 absolute right-0 -bottom-8 h-48 w-48 rounded-full blur-3xl" />

      <div className="relative rounded-[2rem] border border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 shadow-[0_32px_100px_rgba(3,12,24,0.45)] backdrop-blur-sm">
        <HomepageSpotMap
          spots={allSpots}
          center={mapCenter}
          zoom={HOMEPAGE_MAP_ZOOM}
        />
      </div>
    </section>
  );
}

export default function SpotsPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <HomepageHeroSection />

      <div className="mx-auto">
        <Suspense fallback={<HomepageMapSectionSkeleton />}>
          <HomepageMapSection />
        </Suspense>
        <HomepageSuggestionSection />
      </div>
    </div>
  );
}
