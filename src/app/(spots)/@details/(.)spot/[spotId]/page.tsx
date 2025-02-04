import CardinalDirection from "~/app/(spots)/_components/Cardinals";
import { api } from "~/trpc/server";

const SpotDetailsPage: React.FC<{
  params: Promise<{ spotId: string }>;
}> = async ({ params }) => {
  const spotId = (await params).spotId;

  const spot = await api.spot
    .getOne({ spotId: parseInt(spotId) })
    .catch(() => null);

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
};

export default SpotDetailsPage;
