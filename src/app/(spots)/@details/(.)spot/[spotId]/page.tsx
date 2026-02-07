import { db } from "~/server/db";
import { getSpotWithStats } from "~/server/db/queries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/Card";
import { LocationBadge } from "~/components/spots/LocationBadge";
import { SubscribersBadge } from "~/components/spots/SubscribersBadge";
import { PopularWindDirections } from "~/components/spots/PopularWindDirections";
import { PreferredWindSpeed } from "~/components/spots/PreferredWindSpeed";
import { PreferredTemperature } from "~/components/spots/PreferredTemperature";

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
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="bg-ocean-800/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-ocean-300 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-ocean-200 text-lg">Spot not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{spot.name}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {spot.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <LocationBadge lat={spot.lat} long={spot.long} />
              <SubscribersBadge count={spot.activeSubscribers} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotDetailsPage;
