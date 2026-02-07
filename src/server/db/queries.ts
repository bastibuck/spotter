import "server-only";

import { and, count, eq, isNotNull } from "drizzle-orm";
import { cache } from "react";
import { db } from "~/server/db";
import { spots, subscriptions } from "~/server/db/schema";

export interface SpotWithSubscriberCount {
  id: number;
  name: string;
  description: string | null;
  long: number;
  lat: number;
  defaultWindDirections: (
    | "N"
    | "NNE"
    | "NE"
    | "ENE"
    | "E"
    | "ESE"
    | "SE"
    | "SSE"
    | "S"
    | "SSW"
    | "SW"
    | "WSW"
    | "W"
    | "WNW"
    | "NW"
    | "NNW"
  )[];
  activeSubscribers: number;
}

/**
 * Fetches a spot by ID along with its active subscriber count.
 * Uses React.cache() for per-request deduplication.
 */
export const getSpotWithSubscriberCount = cache(
  async (spotId: number): Promise<SpotWithSubscriberCount | undefined> => {
    const [spot, subscriptionCountResult] = await Promise.all([
      db.query.spots.findFirst({
        where: eq(spots.id, spotId),
      }),
      db
        .select({ count: count() })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.spotId, spotId),
            isNotNull(subscriptions.verifiedAt),
          ),
        ),
    ]);

    if (spot === undefined) {
      return undefined;
    }

    return {
      ...spot,
      activeSubscribers: subscriptionCountResult[0]?.count ?? 0,
    };
  },
);
