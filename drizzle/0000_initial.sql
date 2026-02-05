CREATE TABLE "spotter_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "spotter_kiters" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	CONSTRAINT "spotter_kiters_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "spotter_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spotter_spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"long" double precision NOT NULL,
	"lat" double precision NOT NULL,
	"default_wind_direction" varchar(3)[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spotter_subscriptions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"spot_id" integer NOT NULL,
	"kiter_id" varchar NOT NULL,
	"verified_at" timestamp,
	"wind_speed_min" smallint NOT NULL,
	"wind_speed_max" smallint NOT NULL,
	"wind_directions" varchar(3)[] NOT NULL,
	"min_temperature" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spotter_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "spotter_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "spotter_account" ADD CONSTRAINT "spotter_account_user_id_spotter_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."spotter_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spotter_session" ADD CONSTRAINT "spotter_session_user_id_spotter_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."spotter_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spotter_subscriptions" ADD CONSTRAINT "spotter_subscriptions_spot_id_spotter_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "public"."spotter_spots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spotter_subscriptions" ADD CONSTRAINT "spotter_subscriptions_kiter_id_spotter_kiters_id_fk" FOREIGN KEY ("kiter_id") REFERENCES "public"."spotter_kiters"("id") ON DELETE cascade ON UPDATE no action;