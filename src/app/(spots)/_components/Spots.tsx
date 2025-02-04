import React, { Suspense } from "react";
import { api } from "~/trpc/server";
import SubscribeToSpotForm from "./SubscribeForm";
import Link from "next/link";

const Spots: React.FC = async () => {
  const allSpots = await api.spot.getAll();

  return (
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
  );
};

const SuspendedSpots: React.FC = () => {
  return (
    <Suspense fallback="Loading spots...">
      <Spots />
    </Suspense>
  );
};

export default SuspendedSpots;
