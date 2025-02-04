import { redirect } from "next/navigation";
import React from "react";
import { api } from "~/trpc/server";
import CardinalDirection from "../../_components/Cardinals";

const SpotDetailsPage: React.FC<{
  params: Promise<{ spotId: string }>;
}> = async ({ params }) => {
  const spotId = (await params).spotId;

  const spot = await api.spot.getOne({ spotId: parseInt(spotId) }).catch(() => {
    redirect("/404");
  });

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
