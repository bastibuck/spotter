import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spotSuggestions } from "~/server/db/schema";

const suggestionRateLimitMap = new Map<
  string,
  { count: number; windowStartedAt: Date }
>();

const SUGGESTION_RATE_LIMIT_TIMEOUT = 1000 * 60 * 30;
const SUGGESTION_RATE_LIMIT_MAX_REQUESTS = 3;

export const spotSuggestionRouter = createTRPCRouter({
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
