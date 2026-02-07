import "server-only";

import { and, count, eq, isNotNull } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";
import { db } from "~/server/db";
import { spots, subscriptions, WindDirection } from "~/server/db/schema";

export type WindDirectionType = z.infer<typeof WindDirection>;

export type WindDirectionPopularity = Record<WindDirectionType, number>;

export interface SpotWithStats {
  id: number;
  name: string;
  description: string | null;
  long: number;
  lat: number;
  defaultWindDirections: WindDirectionType[];
  activeSubscribers: number;
  /** Popularity of each wind direction as a percentage (0-100) */
  windDirectionPopularity: WindDirectionPopularity;
}

/**
 * Calculates popularity percentages for each wind direction based on subscriber preferences.
 */
function calculateWindDirectionPopularity(
  activeSubscriptions: { windDirections: WindDirectionType[] }[],
): WindDirectionPopularity {
  const totalSubscribers = activeSubscriptions.length;

  // Initialize all directions to 0
  const popularity = Object.fromEntries(
    WindDirection.options.map((dir) => [dir, 0]),
  ) as WindDirectionPopularity;

  if (totalSubscribers === 0) {
    return popularity;
  }

  // Count how many subscribers have each direction
  const directionCounts: Partial<Record<WindDirectionType, number>> = {};
  for (const sub of activeSubscriptions) {
    for (const dir of sub.windDirections) {
      directionCounts[dir] = (directionCounts[dir] ?? 0) + 1;
    }
  }

  // Convert to percentages
  for (const [dir, count] of Object.entries(directionCounts)) {
    popularity[dir as WindDirectionType] = Math.round(
      (count / totalSubscribers) * 100,
    );
  }

  return popularity;
}

/**
 * Fetches a spot by ID along with stats including subscriber count and wind direction popularity.
 * Uses React.cache() for per-request deduplication.
 */
export const getSpotWithStats = cache(
  async (spotId: number): Promise<SpotWithStats | undefined> => {
    const [spot, subscriptionCountResult, activeSubscriptions] =
      await Promise.all([
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
        db.query.subscriptions.findMany({
          where: and(
            eq(subscriptions.spotId, spotId),
            isNotNull(subscriptions.verifiedAt),
          ),
          columns: {
            windDirections: true,
          },
        }),
      ]);

    if (spot === undefined) {
      return undefined;
    }

    return {
      ...spot,
      activeSubscribers: subscriptionCountResult[0]?.count ?? 0,
      windDirectionPopularity:
        calculateWindDirectionPopularity(activeSubscriptions),
    };
  },
);
