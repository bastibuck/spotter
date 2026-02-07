import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { getSpotWithStats } from "~/server/db/queries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { LocationBadge } from "~/components/spots/LocationBadge";
import { SubscribersBadge } from "~/components/spots/SubscribersBadge";
import { PopularWindDirections } from "~/components/spots/PopularWindDirections";

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
  const spot = await getSpotWithStats(parseInt(spotId));

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
              <div className="flex flex-col items-end gap-2">
                <LocationBadge
                  lat={spot.lat}
                  long={spot.long}
                  className="text-sm"
                />
                <SubscribersBadge
                  count={spot.activeSubscribers}
                  className="text-sm"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <PopularWindDirections
              popularity={spot.windDirectionPopularity}
              subscriberCount={spot.activeSubscribers}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetailsPage;
