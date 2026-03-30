"use client";

import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";

export default function AdminSignInCard() {
  return (
    <Card className="animate-fade-in-up mx-auto w-full max-w-md">
      <CardHeader className="space-y-3 text-center">
        <div className="text-ocean-100 mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
          <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
          Admin Access
        </div>
        <CardTitle className="text-3xl">Review Spot Suggestions</CardTitle>
        <CardDescription className="text-base">
          Sign in with GitHub to open the private admin queue for spot
          suggestions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          className="w-full"
          onClick={() => {
            void signIn("github", {
              callbackUrl: "/admin/spot-suggestions",
            });
          }}
        >
          Continue with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
