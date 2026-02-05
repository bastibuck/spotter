import { relations, sql } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spotter_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial().primaryKey(),
    name: varchar({ length: 256 }),
    createdById: varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  },
  (example) => [
    {
      createdByIdIdx: index().on(example.createdById),
      nameIndex: index().on(example.name),
    },
  ],
);

export const users = createTable("user", {
  id: varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: timestamp({
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar({ length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar({ length: 255 }).notNull(),
    providerAccountId: varchar({
      length: 255,
    }).notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: varchar({ length: 255 }),
    scope: varchar({ length: 255 }),
    id_token: text(),
    session_state: varchar({ length: 255 }),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
      userIdIdx: index().on(account.userId),
    },
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar({ length: 255 }).notNull().primaryKey(),
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp({
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => [
    {
      userIdIdx: index().on(session.userId),
    },
  ],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar({ length: 255 }).notNull(),
    token: varchar({ length: 255 }).notNull(),
    expires: timestamp({
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => [
    {
      compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    },
  ],
);

// enums
export const WindDirection = z.enum([
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
]);

/**
 * Spots
 **/
export const spots = createTable("spots", {
  id: serial().primaryKey(),
  name: varchar({ length: 128 }).notNull(),
  description: text(),
  long: doublePrecision().notNull(),
  lat: doublePrecision().notNull(),

  // conditions
  defaultWindDirections: varchar("default_wind_direction", { length: 3 })
    .array()
    .notNull()
    .$type<z.infer<typeof WindDirection>[]>(),
});

export const spotsRelations = relations(spots, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

/**
 * Kiters
 **/
export const kiters = createTable(
  "kiters",
  {
    id: varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar().notNull().unique(),
  },
  (kiters) => [
    {
      emailIndex: index().on(kiters.email),
    },
  ],
);

export const kitersRelations = relations(kiters, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

/**
 * Subscriptions | Spots to Kiters
 **/
export const subscriptions = createTable(
  "subscriptions",
  {
    // UUID also for subscribing and unsubscribing
    id: varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    spotId: integer()
      .notNull()
      .references(() => spots.id, { onDelete: "cascade" }),
    kiterId: varchar()
      .notNull()
      .references(() => kiters.id, { onDelete: "cascade" }),

    // activated?
    verifiedAt: timestamp(),

    // conditions
    windSpeedMin: smallint().notNull(),
    windSpeedMax: smallint().notNull(),
    windDirections: varchar({ length: 3 })
      .array() // providing a fixed size does not seem to work by now. It always generates as varchar[] without size but still states it will truncate on a second run...
      .notNull()
      .$type<z.infer<typeof WindDirection>[]>(),
    minTemperature: smallint().notNull().default(0),
  },
  (subscriptions) => [
    {
      uniqueSubscription: unique().on(
        subscriptions.spotId,
        subscriptions.kiterId,
      ),
    },
  ],
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  spot: one(spots, {
    fields: [subscriptions.spotId],
    references: [spots.id],
  }),
  kiter: one(kiters, {
    fields: [subscriptions.kiterId],
    references: [kiters.id],
  }),
}));
