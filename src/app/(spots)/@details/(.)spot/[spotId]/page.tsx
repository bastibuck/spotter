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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-3xl">{spot.name}</CardTitle>
              <CardDescription className="mt-2 text-base break-words">
                {spot.description}
              </CardDescription>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <LocationBadge lat={spot.lat} long={spot.long} />
              <SubscribersBadge count={spot.activeSubscribers} />
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
                Enter your email and choose the wind range and directions you
                want us to watch for at this spot.
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
                A snapshot of the wind patterns and optional filters other
                subscribers care about at {spot.name}.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-ocean-200 text-sm font-medium">Location</h4>
              <SpotMap lat={spot.lat} long={spot.long} />
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
  );
};

export default SpotDetailsPage;
