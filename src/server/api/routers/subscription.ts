import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { subscriptions } from "~/server/db/schema";

export const subscriptionRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email(), spotId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(subscriptions).values({
        email: input.email,
        spotId: input.spotId,
      });

      // TODO! send verification email with link to verification page
    }),

  verify: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(subscriptions)
        .set({ verifiedAt: new Date() })
        .where(eq(subscriptions.securityToken, input.token));
    }),

  unsubscribe: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(subscriptions)
        .where(eq(subscriptions.securityToken, input.token));
    }),
});
