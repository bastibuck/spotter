import { redirect } from "next/navigation";
import React from "react";
import CardinalDirection from "../../../../components/spots/Cardinals";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { spots } from "~/server/db/schema";

export const revalidate = 3600;
export const dynamicParams = true; // statically generate new paths not known during build time

export async function generateStaticParams() {
  const allSpots = await db.query.spots.findMany();

  return allSpots.map((spot) => ({
    spotId: String(spot.id),
  }));
}

const SpotDetailsPage: React.FC<{
  params: Promise<{ spotId: string }>;
}> = async ({ params }) => {
  const spotId = (await params).spotId;

  const spot = await db.query.spots.findFirst({
    where: eq(spots.id, parseInt(spotId)),
  });

  if (spot === undefined) {
    redirect("/404");
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
