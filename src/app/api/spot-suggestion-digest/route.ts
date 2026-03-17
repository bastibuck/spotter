import { count } from "drizzle-orm";
import { Resend } from "resend";

import SpotSuggestionDigestEmail from "emails/spotSuggestionDigest";
import { env } from "~/env";
import { db } from "~/server/db";
import { spotSuggestions } from "~/server/db/schema";

const resend = new Resend(env.RESEND_API_KEY);

export const GET = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const result = await db.select({ count: count() }).from(spotSuggestions);

  const suggestionCount = result[0]?.count ?? 0;

  if (suggestionCount === 0 || env.SKIP_EMAIL_DELIVERY) {
    return new Response("No suggestion digest to send");
  }

  const { error } = await resend.emails.send({
    from: env.FROM_EMAIL,
    to: env.SUGGESTION_DIGEST_TO_EMAIL,
    subject: `Weekly spot suggestions digest (${suggestionCount})`,
    react: SpotSuggestionDigestEmail({ suggestionCount }),
  });

  if (error !== null) {
    console.error(error);

    return new Response("Error sending suggestion digest", {
      status: 500,
    });
  }

  return new Response("Ok");
};
