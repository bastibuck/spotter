import { Suspense } from "react";
import CardinalDirection from "~/app/(spots)/_components/Cardinals";
import { api } from "~/trpc/server";

async function SpotDetails({ spotId }: { spotId: number }) {
  const spot = await api.spot.getOne({ spotId }).catch(() => null);

  if (spot === null) {
    return <div>Spot not found.</div>;
  }

  return (
    <>
      <h1 className="text-3xl">{spot.name}</h1>
      <p>{spot.description}</p>

      <p>
        {spot.long}, {spot.lat}
      </p>

      <CardinalDirection selectedDirections={spot.defaultWindDirections} />
    </>
  );
}

const SuspendedSpot: React.FC<{
  params: Promise<{ spotId: string }>;
}> = async ({ params }) => {
  const spotId = (await params).spotId;

  return (
    <Suspense fallback="Loading spot...">
      <SpotDetails spotId={parseInt(spotId)} />
    </Suspense>
  );
};

export default SuspendedSpot;
