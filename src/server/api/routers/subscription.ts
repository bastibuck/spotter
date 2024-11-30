import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "drizzle-orm";
import VerifySpotSubscriptionEmail from "emails/verifySpot";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";
import { getBaseUrl } from "~/lib/url";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  kiters,
  spots,
  subscriptions,
  WindDirection,
} from "~/server/db/schema";

const resend = new Resend(env.RESEND_API_KEY);

export const subscriptionRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.subscriptions.findFirst({
        where: eq(subscriptions.id, input.id),
        columns: {
          id: true,
        },
        with: {
          spot: {
            columns: {
              name: true,
            },
          },
        },
      }),
    ),

  subscribe: publicProcedure
    .input(
      z
        .object({
          email: z.string().email(),
          spotId: z.number().int(),
          windSpeedMin: z.number().int().positive(),
          windSpeedMax: z.number().int().positive(),
          windDirections: z.array(WindDirection),
        })
        .refine((input) => input.windSpeedMax > input.windSpeedMin, {
          message: "Max. wind speed must be larger than min. wind speed.",
          path: ["windSpeedMax"],
        }),
    )
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

      const emailLowerCased = input.email.toLowerCase();

      // start transaction for mutations
      await ctx.db.transaction(async (tx) => {
        // create and get kiter if it doesn't exist
        await tx
          .insert(kiters)
          .values({ email: emailLowerCased })
          .onConflictDoNothing();

        const kiter = await tx.query.kiters.findFirst({
          where: eq(kiters.email, emailLowerCased),
          with: { subscriptions: true },
        });

        if (kiter === undefined) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create or find kiter.",
          });
        }

        if (kiter.subscriptions.some((sub) => sub.spotId === spot.id)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Subscription already exists.",
          });
        }

        // create new subscription
        const subscription = await tx
          .insert(subscriptions)
          .values({
            kiterId: kiter.id,
            spotId: spot.id,
            windDirections: input.windDirections,
            windSpeedMax: input.windSpeedMin,
            windSpeedMin: input.windSpeedMax,
          })
          .returning();

        const newSubscription = subscription.at(0);

        if (newSubscription === undefined) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create subscription.",
          });
        }

        // send verification email
        try {
          if (env.SKIP_EMAIL_DELIVERY) {
            return;
          }

          const { error } = await resend.emails.send({
            from: env.FROM_EMAIL,
            to: emailLowerCased,
            subject: `Verify your subscription to ${spot.name}`,
            react: VerifySpotSubscriptionEmail({
              spotName: spot.name,
              subscription: newSubscription,
            }),
            headers: {
              "List-Unsubscribe": `${getBaseUrl()}/unsubscribe-spot/${newSubscription.id}`,
            },
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
        subscriptionId: z.string().uuid(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(subscriptions)
        .set({ verifiedAt: new Date() })
        .where(
          and(
            eq(subscriptions.id, input.subscriptionId),
            isNull(subscriptions.verifiedAt),
          ),
        )
        .returning({ id: subscriptions.id }),
    ),

  unsubscribe: publicProcedure
    .input(
      z.object({
        subscriptionId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await ctx.db.query.subscriptions.findFirst({
        where: eq(subscriptions.id, input.subscriptionId),
        with: { spot: { columns: { name: true } } },
      });

      if (subscription === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found.",
        });
      }

      await ctx.db
        .delete(subscriptions)
        .where(eq(subscriptions.id, subscription.id));

      return {
        name: subscription.spot.name,
      };
    }),

  unsubscribeAll: publicProcedure
    .input(
      z.object({
        kiterId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const kiter = await ctx.db.query.kiters.findFirst({
        where: eq(subscriptions.id, input.kiterId),
      });

      if (kiter === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kiter not found.",
        });
      }

      const allSubscriptions = await ctx.db.query.subscriptions.findMany({
        where: eq(subscriptions.kiterId, kiter.id),
      });

      await ctx.db.delete(kiters).where(eq(kiters.id, kiter.id));

      return allSubscriptions.length;
    }),
});
