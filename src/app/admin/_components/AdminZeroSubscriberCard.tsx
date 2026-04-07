import { Badge } from "~/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";

interface ZeroSubscriberSpot {
  id: number;
  name: string;
}

interface AdminZeroSubscriberCardProps {
  spots: ZeroSubscriberSpot[];
}

const MAX_VISIBLE_SPOTS = 5;

export default function AdminZeroSubscriberCard({
  spots,
}: AdminZeroSubscriberCardProps) {
  const visibleSpots = spots.slice(0, MAX_VISIBLE_SPOTS);
  const hiddenSpotCount = Math.max(0, spots.length - visibleSpots.length);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Zero Subscribers</CardTitle>
        <CardDescription className="text-base">
          Spots with no verified subscribers yet. Good candidates for review,
          promotion, or cleanup.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-5xl font-bold text-white">{spots.length}</p>
          <p className="text-ocean-200/70 mt-2 text-sm">
            spot{spots.length === 1 ? "" : "s"} without a verified subscriber.
          </p>
        </div>

        {spots.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-8 text-center">
            <p className="text-ocean-200/80 text-sm leading-relaxed">
              Every spot currently has at least one verified subscriber.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visibleSpots.map((spot) => (
              <Badge
                key={spot.id}
                variant="default"
                className="px-3 py-1 text-sm"
              >
                {spot.name}
              </Badge>
            ))}

            {hiddenSpotCount > 0 ? (
              <Badge variant="info" className="px-3 py-1 text-sm">
                +{hiddenSpotCount} more
              </Badge>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
