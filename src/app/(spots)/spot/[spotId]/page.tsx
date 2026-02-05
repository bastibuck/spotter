import { redirect } from "next/navigation";
import React from "react";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { spots } from "~/server/db/schema";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import CardinalDirection from "../../../../components/spots/Cardinals";

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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all spots
          </Button>
        </Link>
      </div>

      <div className="animate-fade-in-up">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-4xl">{spot.name}</CardTitle>
                <CardDescription className="mt-3 text-lg">
                  {spot.description}
                </CardDescription>
              </div>
              <Badge variant="info" className="text-sm">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {spot.lat.toFixed(4)}, {spot.long.toFixed(4)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <h3 className="text-ocean-100 mb-6 text-lg font-medium">
                Default Wind Directions
              </h3>
              <div className="flex justify-center py-4">
                <CardinalDirection
                  selectedDirections={spot.defaultWindDirections}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetailsPage;
