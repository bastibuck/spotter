import React, { Suspense } from "react";
import { api } from "~/trpc/server";

const Spots: React.FC = async () => {
  const allSpots = await api.spot.getAll();

  return (
    <ul>
      {allSpots.map((spot) => (
        <li key={spot.id}>{spot.name}</li>
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
