// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { isNotNull } from "drizzle-orm";
import SpotNotificationEmail from "emails/spotNotification";
import { fetchWeatherApi } from "openmeteo";
import { Resend } from "resend";
import { env } from "~/env";
import { getBaseUrl } from "~/lib/url";
import { db } from "~/server/db";
import { subscriptions, WindDirection } from "~/server/db/schema";

const DAYS_IN_FUTURE = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast";

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

    hourly: ["wind_speed_10m", "wind_direction_10m"],
    wind_speed_unit: "kn",
  });

  // check conditions for each spot and send email to kiters if matched
  allSpotsWithSubscriptions.forEach((spot, idx) => {
    const response = responses[idx];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        windSpeed10m: hourly.variables(0).valuesArray(),
        windDirection10m: hourly.variables(1).valuesArray(),
      },
    };

    const structured = [];

    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      structured.push({
        time: weatherData.hourly.time[i],
        windSpeed10m: weatherData.hourly.windSpeed10m[i],
        windDirection10m: weatherData.hourly.windDirection10m[i],
      });
    }

    // only consider hours between 8am and 8pm
    const onlyDaytime = structured.filter(
      ({ time }) => time?.getHours() > 8 && time?.getHours() <= 20,
    );

    // check conditions for each subscription
    spot.subscriptions.forEach((subscription) => {
      const { windSpeedMin, windSpeedMax, windDirections, kiter } =
        subscription;

      const suitableHours = onlyDaytime
        // check required conditions for 4 consecutive hours
        .filter((_, idx, hours) => {
          return (
            idx <= hours.length - 4 &&
            // -----------------------------------
            // day 1
            // -----------------------------------
            checkWindSpeed(
              hours[idx + 0]?.windSpeed10m,
              windSpeedMin,
              windSpeedMax,
            ) &&
            isAllowedDirection(
              hours[idx + 0]?.windDirection10m,
              windDirections,
            ) &&
            // checkSameDay() => is always same day - duh!

            // -----------------------------------
            // day 2
            // -----------------------------------
            checkWindSpeed(
              hours[idx + 1]?.windSpeed10m,
              windSpeedMin,
              windSpeedMax,
            ) &&
            isAllowedDirection(
              hours[idx + 1]?.windDirection10m,
              windDirections,
            ) &&
            checkSameDay(hours[idx + 0].time, hours[idx + 1].time) &&
            // -----------------------------------
            // day 3
            // -----------------------------------
            checkWindSpeed(
              hours[idx + 2]?.windSpeed10m,
              windSpeedMin,
              windSpeedMax,
            ) &&
            isAllowedDirection(
              hours[idx + 2]?.windDirection10m,
              windDirections,
            ) &&
            checkSameDay(hours[idx + 0].time, hours[idx + 2].time) &&
            // -----------------------------------
            // day 4
            // -----------------------------------
            checkWindSpeed(
              hours[idx + 3]?.windSpeed10m,
              windSpeedMin,
              windSpeedMax,
            ) &&
            isAllowedDirection(
              hours[idx + 3]?.windDirection10m,
              windDirections,
            ) &&
            checkSameDay(hours[idx + 0].time, hours[idx + 3].time)
          );
        });

      const hasSuitableConditions = suitableHours.length > 0;

      if (!hasSuitableConditions) {
        return;
      }

      // send email to kiter
      if (env.SKIP_EMAIL_DELIVERY) {
        return;
      }

      resend.emails
        .send({
          from: env.FROM_EMAIL,
          to: kiter.email,
          subject: `Suitable conditions for ${spot.name}`,
          react: SpotNotificationEmail({
            spotName: spot.name,
            subscription,
            kiter: subscription.kiter,
            date: targetDayDate,
          }),
          headers: {
            "List-Unsubscribe": `${getBaseUrl()}/${subscription.id}/unsubscribe`,
          },
        })
        .then((res) => {
          if (res.error) {
            throw new Error(res.error.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  return new Response("Ok");
};

const checkWindSpeed = (windSpeed: number, min: number, max: number) => {
  return windSpeed >= min && windSpeed <= max;
};

const checkSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate();
};

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const getCardinalDirection = (degree: number) => {
  const index = Math.round(degree / 22.5) % 16;
  return WindDirection.options[index]!;
};

const isAllowedDirection = (
  degree: number,
  allowedDirections: (typeof WindDirection.options)[number][],
): boolean => {
  const direction = getCardinalDirection(degree);
  return allowedDirections.includes(direction);
};
