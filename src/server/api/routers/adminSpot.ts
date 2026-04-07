import { count, desc, eq, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { spots, subscriptions } from "~/server/db/schema";
import { createSpot, spotInputSchema, updateSpot } from "~/server/spots";

export const adminSpotRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => {
    const [allSpots, subscriberCounts] = await Promise.all([
      ctx.db.query.spots.findMany({
        orderBy: [desc(spots.id)],
      }),
      ctx.db
        .select({
          spotId: subscriptions.spotId,
          subscriberCount: count(),
        })
        .from(subscriptions)
        .where(isNotNull(subscriptions.verifiedAt))
        .groupBy(subscriptions.spotId),
    ]);

    const subscriberCountBySpotId = new Map(
      subscriberCounts.map((entry) => [entry.spotId, entry.subscriberCount]),
    );

    return allSpots.map((spot) => ({
      ...spot,
      subscriberCount: subscriberCountBySpotId.get(spot.id) ?? 0,
    }));
  }),
  create: adminProcedure
    .input(spotInputSchema)
    .mutation(async ({ ctx, input }) => {
      const spot = await createSpot(ctx.db, input);

      return spot;
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        spot: spotInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const spot = await updateSpot(ctx.db, input.id, input.spot);

      return spot;
    }),
  remove: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const spot = await ctx.db.query.spots.findFirst({
        where: eq(spots.id, input.id),
        columns: {
          id: true,
        },
      });

      if (spot === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Spot not found.",
        });
      }

      const [subscriptionCountResult] = await ctx.db
        .select({
          count: count(),
        })
        .from(subscriptions)
        .where(eq(subscriptions.spotId, input.id));

      await ctx.db.delete(spots).where(eq(spots.id, input.id));

      return {
        deletedSubscriptionCount: subscriptionCountResult?.count ?? 0,
      };
    }),
});
