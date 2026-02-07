import React from "react";
import Link from "next/link";
import { db } from "~/server/db";

import SubscribeToSpotForm from "./_components/SubscribeForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/Card";
import { LocationBadge } from "~/components/spots/LocationBadge";

export const revalidate = 3600; // revalidate every hour

export default async function SpotsPage() {
  const allSpots = await db.query.spots.findMany();

  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <div className="animate-fade-in-up mb-16 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
            Catch the Perfect Wind
          </span>
        </h1>
        <p className="text-ocean-200/80 mx-auto max-w-2xl text-xl leading-relaxed md:text-2xl">
          Subscribe to your favorite surf spots and get notified when the
          conditions are just right.
        </p>
      </div>

      {/* Spots Grid */}
      <div className="stagger-children mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        {allSpots.map((spot) => (
          <Card
            key={spot.id}
            className="group hover:border-aqua-400/30 transition-colors duration-300"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/spot/${spot.id}`}
                    scroll={false}
                    prefetch
                    className="inline-block"
                  >
                    <CardTitle className="group-hover:text-aqua-300 text-2xl transition-colors">
                      {spot.name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="mt-2">
                    {spot.description}
                  </CardDescription>
                </div>
                <LocationBadge lat={spot.lat} long={spot.long} precision={2} />
              </div>
            </CardHeader>

            <CardContent>
              <SubscribeToSpotForm spot={spot} />
            </CardContent>
          </Card>
        ))}

        {allSpots.length === 0 && (
          <div className="col-span-full py-16 text-center">
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
        )}
      </div>

      {/* Footer info */}
      <div className="text-ocean-200/60 mt-16 text-center text-sm">
        <p>Get notified when wind conditions match your preferences</p>
      </div>
    </div>
  );
}
