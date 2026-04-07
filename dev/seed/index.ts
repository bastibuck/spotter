import { and, eq, inArray } from "drizzle-orm";
import { DrizzleQueryError } from "drizzle-orm/errors";

import { db } from "../../src/server/db";
import {
  kiters,
  spotSuggestions,
  spots,
  subscriptions,
} from "../../src/server/db/schema";

import { seedPlan, spotSuggestionSeedPlan } from "./seedData";

const uniqueKiterEmails = Array.from(
  new Set(
    seedPlan.flatMap((entry) =>
      entry.subscriptions.map((subscription) => subscription.email),
    ),
  ),
);

async function seedKiters(): Promise<Map<string, string>> {
  if (uniqueKiterEmails.length === 0) {
    return new Map();
  }

  await db
    .insert(kiters)
    .values(uniqueKiterEmails.map((email) => ({ email })))
    .onConflictDoNothing();

  const existingKiters = await db.query.kiters.findMany({
    where: inArray(kiters.email, uniqueKiterEmails),
  });

  return new Map(existingKiters.map((kiter) => [kiter.email, kiter.id]));
}

async function seedSpots(): Promise<Map<string, number>> {
  const spotNames = seedPlan.map((entry) => entry.spot.name);

  await db
    .insert(spots)
    .values(seedPlan.map((entry) => entry.spot))
    .onConflictDoNothing();

  const seededSpots = await db.query.spots.findMany({
    where: inArray(spots.name, spotNames),
  });

  return new Map(seededSpots.map((spot) => [spot.name, spot.id]));
}

async function seedSubscriptions(
  kiterIdsByEmail: Map<string, string>,
  spotIdsByName: Map<string, number>,
): Promise<void> {
  for (const entry of seedPlan) {
    const spotId = spotIdsByName.get(entry.spot.name);

    if (spotId === undefined) {
      throw new Error(`Missing spot after seeding: ${entry.spot.name}`);
    }

    for (const subscription of entry.subscriptions) {
      const kiterId = kiterIdsByEmail.get(subscription.email);

      if (kiterId === undefined) {
        throw new Error(`Missing kiter after seeding: ${subscription.email}`);
      }

      const existingSubscription = await db.query.subscriptions.findFirst({
        where: and(
          eq(subscriptions.spotId, spotId),
          eq(subscriptions.kiterId, kiterId),
        ),
      });

      if (existingSubscription !== undefined) {
        continue;
      }

      await db.insert(subscriptions).values({
        kiterId,
        spotId,
        windSpeedMin: subscription.windSpeedMin,
        windSpeedMax: subscription.windSpeedMax,
        windDirections: subscription.windDirections,
        minTemperature: subscription.minTemperature,
        verifiedAt: subscription.verifiedAt,
      });
    }
  }
}

async function seedSpotSuggestions(): Promise<void> {
  for (const suggestion of spotSuggestionSeedPlan) {
    const existingSuggestion = await db.query.spotSuggestions.findFirst({
      where: eq(spotSuggestions.name, suggestion.name),
      columns: {
        id: true,
      },
    });

    if (existingSuggestion !== undefined) {
      continue;
    }

    await db.insert(spotSuggestions).values({
      name: suggestion.name,
      description: suggestion.description,
      lat: suggestion.lat,
      long: suggestion.long,
      createdAt: suggestion.createdAt,
      reviewedAt: suggestion.reviewedAt,
    });
  }
}

async function main(): Promise<void> {
  console.log("🌱 Seeding database...");

  try {
    const kiterIdsByEmail = await seedKiters();
    const spotIdsByName = await seedSpots();

    await seedSubscriptions(kiterIdsByEmail, spotIdsByName);
    await seedSpotSuggestions();

    console.log("✅ Database seed completed.");
    console.log(
      `Seeded ${seedPlan.length} spot definitions, ${uniqueKiterEmails.length} kiter email(s), and ${spotSuggestionSeedPlan.length} spot suggestion fixture(s).`,
    );
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.error("❌ Database seed failed.");
      console.error(
        "It looks like the database schema has not been migrated yet. Run `npm run db:migrate` before `npm run db:seed`.",
      );
      process.exitCode = 1;
      return;
    }

    throw error;
  } finally {
    await db.$client.end();
  }
}

function isMissingRelationError(error: unknown): boolean {
  if (!(error instanceof DrizzleQueryError)) {
    return false;
  }

  const cause = error.cause as { code?: string } | undefined;

  return cause?.code === "42P01";
}

void main();
