import type { WindDirection } from "../../src/server/db/schema";

export type WindDirectionValue = (typeof WindDirection.options)[number];

export interface SpotSeed {
  name: string;
  description?: string;
  lat: number;
  long: number;
  defaultWindDirections: WindDirectionValue[];
}

export interface SubscriptionSeed {
  email: string;
  windSpeedMin: number;
  windSpeedMax: number;
  windDirections: WindDirectionValue[];
  minTemperature: number | null;
  verifiedAt?: Date;
}

export interface SeedPlanEntry {
  spot: SpotSeed;
  subscriptions: SubscriptionSeed[];
}

const now = new Date();

export const seedPlan: SeedPlanEntry[] = [
  {
    spot: {
      name: "Tarifa",
      description:
        "Strong Levante and Poniente winds with broad sandy beaches and reliable kitesurf conditions.",
      lat: 36.0141,
      long: -5.6044,
      defaultWindDirections: ["E", "W", "ESE", "WSW"],
    },
    subscriptions: [
      {
        email: "anna.kiter@example.com",
        windSpeedMin: 18,
        windSpeedMax: 32,
        windDirections: ["E", "ESE", "SE"],
        minTemperature: 18,
        verifiedAt: now,
      },
      {
        email: "ben.wave@example.com",
        windSpeedMin: 16,
        windSpeedMax: 28,
        windDirections: ["W", "WSW", "SW"],
        minTemperature: 17,
        verifiedAt: now,
      },
      {
        email: "clara.foil@example.com",
        windSpeedMin: 14,
        windSpeedMax: 24,
        windDirections: ["E", "W"],
        minTemperature: 20,
      },
      {
        email: "david.strapless@example.com",
        windSpeedMin: 20,
        windSpeedMax: 35,
        windDirections: ["E", "ENE", "ESE"],
        minTemperature: 19,
        verifiedAt: now,
      },
      {
        email: "eva.downwinder@example.com",
        windSpeedMin: 15,
        windSpeedMax: 26,
        windDirections: ["W", "WNW", "WSW"],
        minTemperature: null,
        verifiedAt: now,
      },
    ],
  },
  {
    spot: {
      name: "El Médano",
      description:
        "Volcanic island spot with trade winds and a mix of freeride and wave conditions.",
      lat: 28.0454,
      long: -16.5361,
      defaultWindDirections: ["N", "NE", "ENE"],
    },
    subscriptions: [
      {
        email: "anna.kiter@example.com",
        windSpeedMin: 19,
        windSpeedMax: 30,
        windDirections: ["N", "NE", "ENE"],
        minTemperature: 21,
        verifiedAt: now,
      },
      {
        email: "felix.canary@example.com",
        windSpeedMin: 17,
        windSpeedMax: 30,
        windDirections: ["N", "NE", "ENE"],
        minTemperature: 22,
        verifiedAt: now,
      },
    ],
  },
  {
    spot: {
      name: "Langebaan",
      lat: -33.0916,
      long: 18.0354,
      defaultWindDirections: ["S", "SSE", "SE"],
    },
    subscriptions: [
      {
        email: "greta.lagoon@example.com",
        windSpeedMin: 16,
        windSpeedMax: 27,
        windDirections: ["S", "SSE", "SE"],
        minTemperature: 20,
        verifiedAt: now,
      },
      {
        email: "clara.foil@example.com",
        windSpeedMin: 15,
        windSpeedMax: 23,
        windDirections: ["S", "SE"],
        minTemperature: 19,
        verifiedAt: now,
      },
    ],
  },
  {
    spot: {
      name: "Cabarete",
      description:
        "Classic Caribbean trade-wind destination with dependable afternoon wind.",
      lat: 19.7522,
      long: -70.4111,
      defaultWindDirections: ["E", "ENE", "NE"],
    },
    subscriptions: [
      {
        email: "hugo.tradewinds@example.com",
        windSpeedMin: 15,
        windSpeedMax: 25,
        windDirections: ["E", "ENE", "NE"],
        minTemperature: 24,
      },
      {
        email: "ben.wave@example.com",
        windSpeedMin: 18,
        windSpeedMax: 27,
        windDirections: ["ENE", "NE"],
        minTemperature: 25,
        verifiedAt: now,
      },
    ],
  },
  {
    spot: {
      name: "Hvide Sande",
      lat: 56.0048,
      long: 8.1294,
      defaultWindDirections: ["W", "SW", "NW"],
    },
    subscriptions: [
      {
        email: "ida.fjord@example.com",
        windSpeedMin: 19,
        windSpeedMax: 34,
        windDirections: ["W", "SW", "NW"],
        minTemperature: 12,
        verifiedAt: now,
      },
      {
        email: "david.strapless@example.com",
        windSpeedMin: 22,
        windSpeedMax: 36,
        windDirections: ["W", "NW"],
        minTemperature: 10,
      },
    ],
  },
  {
    spot: {
      name: "Marsa Alam",
      description:
        "Warm-water Red Sea spot with reliable thermal influence and flat-water areas.",
      lat: 25.0676,
      long: 34.879,
      defaultWindDirections: ["N", "NNW", "NNE"],
    },
    subscriptions: [],
  },
  {
    spot: {
      name: "Dakhla",
      lat: 23.7136,
      long: -15.9369,
      defaultWindDirections: ["N", "NNE", "NE"],
    },
    subscriptions: [],
  },
];
