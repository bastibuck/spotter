import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spots } from "~/server/db/schema";

export const spotRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.query.spots.findMany()),

  getOne: publicProcedure
    .input(
      z.object({
        spotId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const spot = await ctx.db.query.spots.findFirst({
        where: eq(spots.id, input.spotId),
      });

      if (spot === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Spot not found.",
        });
      }

      return spot;
    }),
});
