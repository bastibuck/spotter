import { Badge } from "~/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";

interface RankedSpot {
  id: number;
  name: string;
  subscriberCount: number;
}

interface AdminSpotRankingCardProps {
  title: string;
  description: string;
  emptyMessage: string;
  spots: RankedSpot[];
}

export default function AdminSpotRankingCard({
  title,
  description,
  emptyMessage,
  spots,
}: AdminSpotRankingCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {spots.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-8 text-center">
            <p className="text-ocean-200/80 text-sm leading-relaxed">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {spots.map((spot, index) => (
              <div
                key={spot.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/4 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-aqua-400/10 text-aqua-200 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {spot.name}
                    </p>
                  </div>
                </div>

                <Badge variant="success" className="shrink-0">
                  {spot.subscriberCount} subscriber
                  {spot.subscriberCount === 1 ? "" : "s"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
