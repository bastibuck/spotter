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
import { PreferredWindSpeed } from "~/components/spots/PreferredWindSpeed";
import { PreferredTemperature } from "~/components/spots/PreferredTemperature";
import { SpotMap } from "~/components/spots/SpotMapWrapper";
import SubscribeToSpotForm from "~/app/(spots)/_components/SubscribeForm";

export const revalidate = 300;
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-4xl">{spot.name}</CardTitle>
                <CardDescription className="mt-3 text-lg break-words">
                  {spot.description}
                </CardDescription>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
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

          <CardContent className="space-y-8">
            <section className="from-aqua-500/10 to-ocean-500/10 space-y-3 rounded-2xl border border-white/10 bg-linear-to-br p-5">
              <div className="space-y-1">
                <p className="text-aqua-200 text-xs font-semibold tracking-[0.24em] uppercase">
                  Your Alert
                </p>
                <h3 className="text-xl font-semibold text-white">
                  Set your personal wind alert
                </h3>
                <p className="text-ocean-200/75 text-sm leading-relaxed">
                  Choose the wind, temperature, and email you want us to watch
                  for at this spot.
                </p>
              </div>
              <SubscribeToSpotForm spot={spot} />
            </section>

            <section className="space-y-6 border-t border-white/10 pt-8">
              <div className="space-y-1">
                <p className="text-ocean-300 text-xs font-semibold tracking-[0.24em] uppercase">
                  Crowd Preferences
                </p>
                <h3 className="text-xl font-semibold text-white">
                  What other surfers wait for here
                </h3>
                <p className="text-ocean-200/75 text-sm leading-relaxed">
                  A snapshot of the conditions your fellow subscribers care
                  about most at {spot.name}.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-ocean-200 text-sm font-medium">Location</h4>
                <SpotMap lat={spot.lat} long={spot.long} height="h-[400px]" />
              </div>

              <PopularWindDirections
                popularity={spot.windDirectionPopularity}
                subscriberCount={spot.activeSubscribers}
              />
              <PreferredWindSpeed
                stats={spot.windSpeedStats}
                subscriberCount={spot.activeSubscribers}
              />
              <PreferredTemperature
                stats={spot.temperatureStats}
                subscriberCount={spot.activeSubscribers}
              />
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetailsPage;
