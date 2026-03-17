import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spotSuggestions } from "~/server/db/schema";

const suggestionRateLimitMap = new Map<string, { lastCall: Date }>();

const SUGGESTION_RATE_LIMIT_TIMEOUT = 1000 * 60 * 30;

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
      const rateLimitKey = ctx.ip ?? input.name.toLowerCase();

      if (isSuggestionRateLimited(rateLimitKey)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many suggestion attempts. Please try again later.",
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

  if (
    rateLimit !== undefined &&
    rateLimit.lastCall > new Date(Date.now() - SUGGESTION_RATE_LIMIT_TIMEOUT)
  ) {
    return true;
  }

  suggestionRateLimitMap.set(key, { lastCall: new Date() });

  return false;
}
