import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
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
      const spot = await ctx.db.query.spots.findFirst({
        where: eq(spots.id, input.spotId),
      });

      if (spot === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Spot not found.",
        });
      }

      await ctx.db.transaction(async (tx) => {
        const kiter = await ctx.db
          .insert(kiters)
          .values({ email: input.email })
          .onConflictDoNothing()
          .returning({ id: kiters.id });

        const kiterId = kiter.at(0)?.id ?? null;

        if (kiterId === null) {
          tx.rollback();

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create or find kiter.",
          });
        }

        const subscription = await ctx.db
          .insert(subscriptions)
          .values({
            kiterId: kiterId,
            spotId: spot.id,
          })
          .returning({ id: subscriptions.id });

        const subscriptionId = subscription.at(0)?.id ?? null;

        console.log("gotten subscriptionId ...", subscriptionId);

        if (subscriptionId === null) {
          tx.rollback();

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create subscription.",
          });
        }

        try {
          const { error } = await resend.emails.send({
            from: env.FROM_EMAIL,
            to: input.email,
            subject: `Verify your subscription to ${spot.name}`,
            react: VerifySpotSubscriptionEmail({
              spotName: spot.name,
              subscriptionId: subscriptionId,
            }),
          });

          console.error(error);

          // TODO? add logging service/vercel for errors

          if (error !== null) {
            throw new Error("error");
          }
        } catch {
          tx.rollback();

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
