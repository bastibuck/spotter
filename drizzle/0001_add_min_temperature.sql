-- Add min_temperature column to subscriptions
ALTER TABLE "spotter_subscriptions" ADD COLUMN "min_temperature" smallint DEFAULT 0 NOT NULL;
