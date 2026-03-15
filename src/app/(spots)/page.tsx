import React from "react";
import { db } from "~/server/db";

import { SpotMapPin, SpotMapRoot } from "~/components/spots/SpotMapWrapper";

export const revalidate = 3600; // revalidate every hour

export default async function SpotsPage() {
  const allSpots = await db.query.spots.findMany();

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
              <SpotMapRoot
                bounds={allSpots.map((spot) => [spot.lat, spot.long])}
                height="h-[500px] md:h-[660px] lg:h-[720px]"
              >
                {allSpots.map((spot) => (
                  <SpotMapPin
                    key={spot.id}
                    lat={spot.lat}
                    long={spot.long}
                    href={`/spot/${spot.id}`}
                    label={spot.name}
                  />
                ))}
              </SpotMapRoot>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
