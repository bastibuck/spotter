import React from "react";
import Link from "next/link";
import { db } from "~/server/db";

import SubscribeToSpotForm from "./_components/SubscribeForm";

export const revalidate = 3600; // revalidate every hour

export default async function SpotsPage() {
  const allSpots = await db.query.spots.findMany();

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        <span className="text-[hsl(280,100%,70%)]">Spotter</span>
      </h1>

      <p className="text-2xl text-white">
        Subscribe to spots and get notified when the wind is right.
      </p>

      <ul className="flex w-full flex-col gap-8 md:max-w-md">
        {allSpots.map((spot) => (
          <li key={spot.id}>
            <div className="border p-4">
              <Link href={`/spot/${spot.id}`} scroll={false} prefetch>
                <h2 className="inline text-2xl hover:underline">{spot.name}</h2>
              </Link>

              <p>{spot.description}</p>
              <p className="mb-3">
                {spot.long}, {spot.lat}
              </p>

              <SubscribeToSpotForm spot={spot} />
            </div>
          </li>
        ))}

        {allSpots.length === 0 && <li>No spots found.</li>}
      </ul>
    </>
  );
}
