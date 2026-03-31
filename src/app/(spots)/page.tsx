import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import React from "react";
import { db } from "~/server/db";

import HomepageSpotMap from "./_components/HomepageSpotMap";
import { Button } from "~/components/ui/Button";

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

const getAllSpots = unstable_cache(() => db.query.spots.findMany(), [
  "all-spots",
], { tags: ["spots"], revalidate: 3600 });

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

export default async function SpotsPage() {
  const allSpots = await getAllSpots();
  const requestLocation = (await getHomepageMapCenter()) ?? KIEL_POSITION;
  const mapCenter =
    getClosestSpotCenter(allSpots, requestLocation) ?? KIEL_POSITION;

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="animate-fade-in-up relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 px-6 py-8 text-center shadow-[0_30px_120px_rgba(5,16,32,0.45)] md:mb-8 md:px-10 md:py-10">
        <div className="bg-aqua-400/12 absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-ocean-400/12 absolute right-0 bottom-0 h-48 w-48 rounded-full blur-3xl" />

        <div className="relative">
          <div className="text-ocean-100 mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
            <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
            Wind Alerts for Surfers
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-[5.5rem]">
            <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
              Catch the Perfect Wind
            </span>
          </h1>
          <p className="text-ocean-200/80 mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-2xl">
            Subscribe to your favorite surf spots and get notified when the
            conditions are just right.
          </p>
        </div>
      </div>

      <div className="mx-auto">
        {allSpots.length === 0 ? (
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
        ) : (
          <section className="animate-fade-in-up relative">
            <div className="bg-aqua-400/10 absolute top-10 -left-8 h-40 w-40 rounded-full blur-3xl" />
            <div className="bg-ocean-300/10 absolute right-0 -bottom-8 h-48 w-48 rounded-full blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 shadow-[0_32px_100px_rgba(3,12,24,0.45)] backdrop-blur-sm">
              <HomepageSpotMap
                spots={allSpots}
                center={mapCenter}
                zoom={HOMEPAGE_MAP_ZOOM}
              />
            </div>

            <div className="border-aqua-300/20 from-aqua-500/12 via-ocean-900/55 to-ocean-950/80 relative mt-8 overflow-hidden rounded-[2rem] border bg-linear-to-br px-6 py-8 text-center shadow-[0_24px_80px_rgba(2,10,22,0.55)] ring-1 ring-white/8 backdrop-blur-sm md:px-10 md:py-10">
              <div className="bg-aqua-300/18 absolute -top-8 left-8 h-32 w-32 rounded-full blur-3xl" />
              <div className="bg-ocean-300/16 absolute right-6 bottom-0 h-40 w-40 rounded-full blur-3xl" />

              <div className="relative mx-auto max-w-2xl">
                <div className="text-aqua-100 border-aqua-200/20 mb-4 inline-flex items-center gap-2 rounded-full border bg-white/8 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] uppercase">
                  <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
                  Coverage Request
                </div>

                <h2 className="text-2xl font-semibold text-white md:text-3xl">
                  Missing your favorite spot?
                </h2>
                <p className="text-ocean-200/80 mt-3 text-base leading-relaxed md:text-lg">
                  If there is a location we should track next, send us the name
                  and any extra context you have. We review every suggestion as
                  we expand coverage.
                </p>

                <div className="mt-6 flex justify-center">
                  <Link href="/suggest-spot">
                    <Button variant="secondary" size="lg">
                      Suggest a New Spot
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
