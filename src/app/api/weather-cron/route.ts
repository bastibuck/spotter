import type React from "react";
import { isNotNull } from "drizzle-orm";
import SpotNotificationEmail from "emails/spotNotification";
import { fetchWeatherApi } from "openmeteo";
import { Resend } from "resend";
import { env } from "~/env";
import { getBaseUrl } from "~/lib/url";
import { db } from "~/server/db";
import { subscriptions, WindDirection } from "~/server/db/schema";

const DAYS_IN_FUTURE = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

const OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast";

// resend API has a limit of 100 emails per batch
const EMAIL_BATCH_SIZE = 100;

const resend = new Resend(env.RESEND_API_KEY);

export const GET = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // load all spots with subscriptions with kiters
  const allSpotsWithSubscriptions = (
    await db.query.spots.findMany({
      with: {
        subscriptions: {
          where: isNotNull(subscriptions.verifiedAt),
          with: {
            kiter: true,
          },
        },
      },
    })
  ).filter((spot) => spot.subscriptions.length > 0);

  const targetDayDate = new Date(Date.now() + DAYS_IN_FUTURE * DAY_MS);
  const targetDayDateStr = targetDayDate.toISOString().substring(0, 10);

  // Load weather data for all spots
  const responses = await fetchWeatherApi(OPEN_METEO_API_URL, {
    latitude: allSpotsWithSubscriptions.map((spot) => spot.lat),
    longitude: allSpotsWithSubscriptions.map((spot) => spot.long),
    timezone: "auto",

    start_date: targetDayDateStr,
    end_date: targetDayDateStr,

    hourly: ["wind_speed_10m", "wind_direction_10m", "temperature_2m"],
    wind_speed_unit: "kn",
  });

  const emails: {
    email: string;
    spotName: string;
    body: React.ReactElement;
    subscriptionId: string;
  }[] = [];

  // check conditions for each spot and send email to kiters if matched
  allSpotsWithSubscriptions.forEach((spot, idx) => {
    const response = responses[idx];

    if (!response) {
      return;
    }

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();

    const windSpeed10m = hourly?.variables(0)?.valuesArray();
    const windDirection10m = hourly?.variables(1)?.valuesArray();
    const temperature2m = hourly?.variables(2)?.valuesArray();

    if (!hourly || !windSpeed10m || !windDirection10m || !temperature2m) {
      return;
    }

    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        windSpeed10m,
        windDirection10m,
        temperature2m,
      },
    };

    const hourlyValues = [];

    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      const time = weatherData.hourly.time[i];
      const windSpeed10m = weatherData.hourly.windSpeed10m[i];
      const windDirection10m = weatherData.hourly.windDirection10m[i];
      const temperature2m = weatherData.hourly.temperature2m[i];

      if (
        !time ||
        windSpeed10m === undefined ||
        windDirection10m === undefined ||
        temperature2m === undefined
      ) {
        continue;
      }

      hourlyValues.push({
        time,
        windSpeed10m,
        windDirection10m,
        temperature2m,
      });
    }

    // only consider hours between 8am and 8pm
    const onlyDaytime = hourlyValues.filter(
      ({ time }) => time.getHours() > 8 && time.getHours() <= 20,
    );

    // check conditions for each subscription
    spot.subscriptions.forEach((subscription) => {
      const {
        windSpeedMin,
        windSpeedMax,
        windDirections,
        minTemperature,
        kiter,
      } = subscription;

      const suitableHours = onlyDaytime
        // check required conditions for 4 consecutive hours
        .filter((_, idx, hours) => {
          return (
            idx <= hours.length - 4 &&
            // -----------------------------------
            // hour 1
            // -----------------------------------
            checkWindSpeed(
              windSpeedMin,
              windSpeedMax,
              hours[idx + 0]?.windSpeed10m,
            ) &&
            isAllowedDirection(
              windDirections,
              hours[idx + 0]?.windDirection10m,
            ) &&
            checkTemperature(minTemperature, hours[idx + 0]?.temperature2m) &&
            // checkSameDay() => is always same day - duh!

            // -----------------------------------
            // hour 2
            // -----------------------------------
            checkWindSpeed(
              windSpeedMin,
              windSpeedMax,
              hours[idx + 1]?.windSpeed10m,
            ) &&
            isAllowedDirection(
              windDirections,
              hours[idx + 1]?.windDirection10m,
            ) &&
            checkTemperature(minTemperature, hours[idx + 1]?.temperature2m) &&
            checkSameDay(hours[idx + 0]?.time, hours[idx + 1]?.time) &&
            // -----------------------------------
            // hour 3
            // -----------------------------------
            checkWindSpeed(
              windSpeedMin,
              windSpeedMax,
              hours[idx + 2]?.windSpeed10m,
            ) &&
            isAllowedDirection(
              windDirections,
              hours[idx + 2]?.windDirection10m,
            ) &&
            checkTemperature(minTemperature, hours[idx + 2]?.temperature2m) &&
            checkSameDay(hours[idx + 0]?.time, hours[idx + 2]?.time) &&
            // -----------------------------------
            // hour 4
            // -----------------------------------
            checkWindSpeed(
              windSpeedMin,
              windSpeedMax,
              hours[idx + 3]?.windSpeed10m,
            ) &&
            isAllowedDirection(
              windDirections,
              hours[idx + 3]?.windDirection10m,
            ) &&
            checkTemperature(minTemperature, hours[idx + 3]?.temperature2m) &&
            checkSameDay(hours[idx + 0]?.time, hours[idx + 3]?.time)
          );
        });

      const hasSuitableConditions = suitableHours.length > 0;

      if (!hasSuitableConditions) {
        return;
      }

      if (env.SKIP_EMAIL_DELIVERY) {
        return;
      }

      emails.push({
        email: kiter.email,
        subscriptionId: subscription.id,
        spotName: spot.name,
        body: SpotNotificationEmail({
          spotName: spot.name,
          subscription,
          kiter: subscription.kiter,
          date: targetDayDate,
          suitableHours: suitableHours.map((hour) => ({
            windSpeed: hour.windSpeed10m,
            windDirection: getCardinalDirection(hour.windDirection10m),
            from: hour.time.getHours(),
            to: hour.time.getHours() + 1,
          })),
        }),
      });
    });
  });

  if (emails.length === 0) {
    return new Response("No emails to send");
  }

  for (let i = 0; i < emails.length; i += EMAIL_BATCH_SIZE) {
    const emailBatch = emails.slice(i, i + EMAIL_BATCH_SIZE);

    const { error } = await resend.batch.send(
      emailBatch.map((email) => ({
        from: env.FROM_EMAIL,
        to: email.email,
        subject: `Suitable conditions for ${email.spotName}`,
        react: email.body,
        headers: {
          "List-Unsubscribe": `${getBaseUrl()}/subscription/${email.subscriptionId}/unsubscribe`,
        },
      })),
    );

    if (error) {
      return new Response("Error sending emails", { status: 500 });
    }
  }

  return new Response("Ok");
};

const checkWindSpeed = (min: number, max: number, windSpeed?: number) => {
  if (windSpeed === undefined) {
    return false;
  }

  return windSpeed >= min && windSpeed <= max;
};

const checkTemperature = (minTemperature: number, temperature?: number) => {
  if (temperature === undefined) {
    return false;
  }

  return temperature >= minTemperature;
};

const checkSameDay = (date1?: Date, date2?: Date) => {
  if (!date1 || !date2) {
    return false;
  }

  return date1.getDate() === date2.getDate();
};

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const getCardinalDirection = (degree: number) => {
  const index = Math.round(degree / 22.5) % 16;

  return WindDirection.options[index] ?? "N"; // TODO? check better way of getting direction. should never happen
};

const isAllowedDirection = (
  allowedDirections: (typeof WindDirection.options)[number][],
  degree?: number,
): boolean => {
  if (degree === undefined) {
    return false;
  }

  const direction = getCardinalDirection(degree);
  return allowedDirections.includes(direction);
};
