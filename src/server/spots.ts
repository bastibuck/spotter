import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type { db } from "~/server/db";
import { spots, WindDirection } from "~/server/db/schema";

export const spotInputSchema = z.object({
  name: z.string().trim().min(1).max(128),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform(normalizeOptionalText),
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
  defaultWindDirections: z.array(WindDirection).min(1),
});

type DatabaseClient = typeof db;
type TransactionClient = Parameters<
  Parameters<DatabaseClient["transaction"]>[0]
>[0];

type SpotWriteClient = DatabaseClient | TransactionClient;

export type SpotInput = z.infer<typeof spotInputSchema>;

export async function createSpot(
  client: SpotWriteClient,
  input: SpotInput,
): Promise<{ id: number }> {
  try {
    const [spot] = await client
      .insert(spots)
      .values({
        name: input.name,
        description: input.description,
        lat: input.lat,
        long: input.long,
        defaultWindDirections: input.defaultWindDirections,
      })
      .returning({
        id: spots.id,
      });

    if (spot === undefined) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Spot could not be created.",
      });
    }

    return spot;
  } catch (error) {
    throw mapSpotWriteError(error, "create");
  }
}

export async function updateSpot(
  client: SpotWriteClient,
  spotId: number,
  input: SpotInput,
): Promise<{ id: number }> {
  try {
    const [spot] = await client
      .update(spots)
      .set({
        name: input.name,
        description: input.description,
        lat: input.lat,
        long: input.long,
        defaultWindDirections: input.defaultWindDirections,
      })
      .where(eq(spots.id, spotId))
      .returning({
        id: spots.id,
      });

    if (spot === undefined) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Spot not found.",
      });
    }

    return spot;
  } catch (error) {
    throw mapSpotWriteError(error, "update");
  }
}

function mapSpotWriteError(
  error: unknown,
  action: "create" | "update",
): TRPCError {
  if (error instanceof TRPCError) {
    return error;
  }

  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message:
      action === "create"
        ? "Spot could not be created."
        : "Spot could not be updated.",
    cause: error,
  });
}

function normalizeOptionalText(value: string | undefined): string | null {
  if (value === undefined || value.length === 0) {
    return null;
  }

  return value;
}
