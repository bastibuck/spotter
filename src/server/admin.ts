import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { env } from "~/env";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";

export function isAllowedAdminGithubAccountId(
  providerAccountId: string,
): boolean {
  return env.ADMIN_GITHUB_IDS.includes(providerAccountId);
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const githubAccount = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.provider, "github")),
    columns: {
      providerAccountId: true,
    },
  });

  if (githubAccount === undefined) {
    return false;
  }

  return isAllowedAdminGithubAccountId(githubAccount.providerAccountId);
}

export async function requireAdminUser(userId: string): Promise<void> {
  if (!(await isAdminUser(userId))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
}
