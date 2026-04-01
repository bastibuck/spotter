import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { spotSuggestions } from "~/server/db/schema";
import { createSpot, spotInputSchema } from "~/server/spots";

const suggestionRateLimitMap = new Map<
  string,
  { count: number; windowStartedAt: Date }
>();

const SUGGESTION_RATE_LIMIT_TIMEOUT = 1000 * 60 * 30;
const SUGGESTION_RATE_LIMIT_MAX_REQUESTS = 3;

export const spotSuggestionRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        includeReviewed: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.spotSuggestions.findMany({
        where: input.includeReviewed
          ? undefined
          : isNull(spotSuggestions.reviewedAt),
        orderBy: [
          asc(spotSuggestions.reviewedAt),
          desc(spotSuggestions.createdAt),
        ],
      });
    }),
  create: publicProcedure
    .input(
      z
        .object({
          name: z.string().trim().min(1).max(128),
          description: z
            .string()
            .trim()
            .max(1000)
            .optional()
            .transform(normalizeOptionalText),
          lat: z.number().min(-90).max(90).optional(),
          long: z.number().min(-180).max(180).optional(),
        })
        .refine(
          (input) =>
            (input.lat === undefined && input.long === undefined) ||
            (input.lat !== undefined && input.long !== undefined),
          {
            message:
              "Latitude and longitude must both be provided or left empty.",
            path: ["lat"],
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.ip !== null && isSuggestionRateLimited(ctx.ip)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many suggestion attempts. Please try again in a bit.",
        });
      }

      await ctx.db.insert(spotSuggestions).values({
        name: input.name,
        description: input.description,
        lat: input.lat,
        long: input.long,
      });
    }),
  remove: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db
        .delete(spotSuggestions)
        .where(eq(spotSuggestions.id, input.id))
        .returning({ id: spotSuggestions.id });

      if (deleted.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Suggestion not found.",
        });
      }
    }),
  markReviewed: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(spotSuggestions)
        .set({
          reviewedAt: new Date(),
        })
        .where(eq(spotSuggestions.id, input.id))
        .returning({ id: spotSuggestions.id });

      if (updated.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Suggestion not found.",
        });
      }
    }),
  createSpotFromSuggestion: adminProcedure
    .input(
      z.object({
        suggestionId: z.number().int().positive(),
        spot: spotInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const spot = await ctx.db.transaction(async (tx) => {
        const claimedSuggestion = await tx
          .update(spotSuggestions)
          .set({
            reviewedAt: new Date(),
          })
          .where(
            and(
              eq(spotSuggestions.id, input.suggestionId),
              isNull(spotSuggestions.reviewedAt),
            ),
          )
          .returning({ id: spotSuggestions.id });

        if (claimedSuggestion.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Suggestion not found or already reviewed.",
          });
        }

        const spot = await createSpot(tx, input.spot);

        return spot;
      });

      revalidateTag("spots", "max");

      return spot;
    }),
});

function normalizeOptionalText(value: string | undefined): string | null {
  if (value === undefined || value.length === 0) {
    return null;
  }

  return value;
}

function isSuggestionRateLimited(key: string): boolean {
  const rateLimit = suggestionRateLimitMap.get(key);
  const now = new Date();

  if (
    rateLimit === undefined ||
    rateLimit.windowStartedAt <=
      new Date(Date.now() - SUGGESTION_RATE_LIMIT_TIMEOUT)
  ) {
    suggestionRateLimitMap.set(key, {
      count: 1,
      windowStartedAt: now,
    });

    return false;
  }

  if (rateLimit.count >= SUGGESTION_RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  suggestionRateLimitMap.set(key, {
    count: rateLimit.count + 1,
    windowStartedAt: rateLimit.windowStartedAt,
  });

  return false;
}
