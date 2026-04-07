import "server-only";

import { count, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "~/server/db";
import { subscriptions } from "~/server/db/schema";

interface SpotStat {
  id: number;
  name: string;
  subscriberCount: number;
}

export interface AdminOverviewStats {
  totalVerifiedSubscriptions: number;
  totalUnverifiedSubscriptions: number;
  uniqueKiters: number;
  averageSubscriptionsPerKiter: number;
  medianSubscriptionsPerKiter: number;
  verificationRate: number;
  topSpots: SpotStat[];
  leastSubscribedSpots: SpotStat[];
  zeroSubscriberSpots: Pick<SpotStat, "id" | "name">[];
}

function roundToSingleDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleIndex] ?? 0;
  }

  const leftValue = sortedValues[middleIndex - 1] ?? 0;
  const rightValue = sortedValues[middleIndex] ?? 0;

  return roundToSingleDecimal((leftValue + rightValue) / 2);
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const [
    allSpots,
    verifiedSubscriptionCountResult,
    unverifiedSubscriptionCountResult,
    uniqueKitersResult,
    verifiedCountsBySpot,
    verifiedCountsByKiter,
  ] = await Promise.all([
    db.query.spots.findMany({
      columns: {
        id: true,
        name: true,
      },
    }),
    db
      .select({ count: count() })
      .from(subscriptions)
      .where(isNotNull(subscriptions.verifiedAt)),
    db
      .select({ count: count() })
      .from(subscriptions)
      .where(isNull(subscriptions.verifiedAt)),
    db
      .select({
        count: sql<number>`count(distinct ${subscriptions.kiterId})`,
      })
      .from(subscriptions)
      .where(isNotNull(subscriptions.verifiedAt)),
    db
      .select({
        spotId: subscriptions.spotId,
        subscriberCount: count(),
      })
      .from(subscriptions)
      .where(isNotNull(subscriptions.verifiedAt))
      .groupBy(subscriptions.spotId),
    db
      .select({
        kiterId: subscriptions.kiterId,
        subscriptionCount: count(),
      })
      .from(subscriptions)
      .where(isNotNull(subscriptions.verifiedAt))
      .groupBy(subscriptions.kiterId),
  ]);

  const totalVerifiedSubscriptions =
    verifiedSubscriptionCountResult[0]?.count ?? 0;
  const totalUnverifiedSubscriptions =
    unverifiedSubscriptionCountResult[0]?.count ?? 0;
  const totalSubscriptions =
    totalVerifiedSubscriptions + totalUnverifiedSubscriptions;
  const uniqueKiters = uniqueKitersResult[0]?.count ?? 0;

  const verifiedCountBySpotId = new Map(
    verifiedCountsBySpot.map((entry) => [entry.spotId, entry.subscriberCount]),
  );

  const spotStats = allSpots.map((spot) => ({
    id: spot.id,
    name: spot.name,
    subscriberCount: verifiedCountBySpotId.get(spot.id) ?? 0,
  }));

  const activeSpotStats = spotStats.filter((spot) => spot.subscriberCount > 0);
  const subscriptionsPerKiter = verifiedCountsByKiter.map(
    (entry) => entry.subscriptionCount,
  );

  return {
    totalVerifiedSubscriptions,
    totalUnverifiedSubscriptions,
    uniqueKiters,
    averageSubscriptionsPerKiter:
      uniqueKiters === 0
        ? 0
        : roundToSingleDecimal(totalVerifiedSubscriptions / uniqueKiters),
    medianSubscriptionsPerKiter: calculateMedian(subscriptionsPerKiter),
    verificationRate:
      totalSubscriptions === 0
        ? 0
        : Math.round((totalVerifiedSubscriptions / totalSubscriptions) * 100),
    topSpots: [...activeSpotStats]
      .sort((left, right) => {
        if (right.subscriberCount !== left.subscriberCount) {
          return right.subscriberCount - left.subscriberCount;
        }

        return left.name.localeCompare(right.name);
      })
      .slice(0, 3),
    leastSubscribedSpots: [...activeSpotStats]
      .sort((left, right) => {
        if (left.subscriberCount !== right.subscriberCount) {
          return left.subscriberCount - right.subscriberCount;
        }

        return left.name.localeCompare(right.name);
      })
      .slice(0, 3),
    zeroSubscriberSpots: spotStats
      .filter((spot) => spot.subscriberCount === 0)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(({ id, name }) => ({ id, name })),
  };
}
