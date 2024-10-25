import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import VerifySpotSubscriptionEmail from "emails/verifySpot";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { kiters, spots, subscriptions } from "~/server/db/schema";

const resend = new Resend(env.RESEND_API_KEY);

export const subscriptionRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email(), spotId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      // Check for spot existence
      const spot = await ctx.db.query.spots.findFirst({
        where: eq(spots.id, input.spotId),
      });

      if (spot === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Spot not found.",
        });
      }

      // start transaction for mutations
      await ctx.db.transaction(async (tx) => {
        // create and get kiter if it doesn't exist
        await tx
          .insert(kiters)
          .values({ email: input.email })
          .onConflictDoNothing();

        const kiter = await tx.query.kiters.findFirst({
          where: eq(kiters.email, input.email),
        });

        const kiterId = kiter?.id ?? null;

        if (kiterId === null) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create or find kiter.",
          });
        }

        // check if subscription already exists
        const existingSubscription = await tx.query.subscriptions.findFirst({
          where: and(
            eq(subscriptions.kiterId, kiterId),
            eq(subscriptions.spotId, spot.id),
          ),
        });

        if (existingSubscription !== undefined) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Subscription already exists.",
          });
        }

        // create new subscription
        const subscription = await tx
          .insert(subscriptions)
          .values({
            kiterId: kiterId,
            spotId: spot.id,
          })
          .returning({ id: subscriptions.id });

        const subscriptionId = subscription.at(0)?.id ?? null;

        if (subscriptionId === null) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create subscription.",
          });
        }

        // send verification email
        try {
          const { error } = await resend.emails.send({
            from: env.FROM_EMAIL,
            to: input.email,
            subject: `Verify your subscription to ${spot.name}`,
            react: VerifySpotSubscriptionEmail({
              spotName: spot.name,
              subscriptionId,
            }),
          });

          // TODO? add logging service/vercel for errors
          console.error(error);

          // throw meaningless error to trigger catch block for email sending
          if (error !== null) {
            throw new Error("error");
          }
        } catch {
          throw new TRPCError({
            code: "SERVICE_UNAVAILABLE",
            message: "The email service is currently unavailable.",
          });
        }
      });
    }),

  verify: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(subscriptions)
        .set({ verifiedAt: new Date() })
        .where(eq(subscriptions.id, input.id)),
    ),

  unsubscribe: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.delete(subscriptions).where(eq(subscriptions.id, input.id)),
    ),
});
