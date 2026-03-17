import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spotSuggestions } from "~/server/db/schema";

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
