import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import VerifySpotSubscriptionEmail from "emails/verifySpot";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spots, subscriptions } from "~/server/db/schema";

const resend = new Resend(env.RESEND_API_KEY);

export const subscriptionRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email(), spotId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const spot = await ctx.db.query.spots.findFirst({
        where: eq(spots.id, input.spotId),
      });

      if (spot === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Spot not found.",
        });
      }

      const subscription = await ctx.db
        .insert(subscriptions)
        .values({
          email: input.email,
          spotId: spot.id,
        })
        .returning({ securityToken: subscriptions.securityToken });

      const securityToken = subscription.at(0)?.securityToken ?? null;

      if (securityToken === null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscription token.",
        });
      }

      try {
        const { error } = await resend.emails.send({
          from: env.FROM_EMAIL,
          to: input.email,
          subject: `Verify your subscription to ${spot.name}`,
          react: VerifySpotSubscriptionEmail({
            spotName: spot.name,
            securityToken,
          }),
        });

        // TODO? add logging for errors

        if (error !== null) {
          throw new Error("error");
        }
      } catch {
        await ctx.db
          .delete(subscriptions)
          .where(
            and(
              eq(subscriptions.email, input.email),
              eq(subscriptions.spotId, spot.id),
            ),
          );

        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "The email service is currently unavailable.",
        });
      }
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
