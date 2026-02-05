"use server";

import { TRPCError } from "@trpc/server";

import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export type MySubscriptionsState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
      email: string;
    }
  | null;

export async function sendMySpotsEmail(
  _prevState: MySubscriptionsState,
  formData: FormData,
): Promise<MySubscriptionsState> {
  const email = (formData.get("email") as string | null) ?? "";

  try {
    const ctx = await createTRPCContext({ headers: new Headers() });
    const caller = createCaller(() => Promise.resolve(ctx));

    await caller.subscription.mySubscriptions({ email });

    return {
      success: true,
      message: "Check your inbox for your spots overview",
    };
  } catch (error) {
    console.error("Error sending my spots email:", error);

    // Handle TRPC errors (validation, rate limiting, etc.)
    if (error instanceof TRPCError) {
      if (error.code === "BAD_REQUEST") {
        return {
          success: false,
          error: "Please enter a valid email address.",
          email,
        };
      }

      if (error.code === "TOO_MANY_REQUESTS") {
        return {
          success: false,
          error: "Too many requests. Please try again later.",
          email: "",
        };
      }
    }

    return {
      success: false,
      error: "Something went wrong. Please try again.",
      email,
    };
  }
}
