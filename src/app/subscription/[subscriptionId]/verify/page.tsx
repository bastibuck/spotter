import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { api } from "~/trpc/server";

const VerifySubscriptionPage = async (props: {
  params: Promise<{ subscriptionId: string }>;
}) => {
  const params = await props.params;
  const name = await api.subscription
    .verify({ subscriptionId: params.subscriptionId })
    .then((res) => res.name)
    .catch(() => {
      redirect("/404");
    });

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Animated success icon */}
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <div className="relative">
            {/* Glowing background */}
            <div className="from-aqua-500/30 to-ocean-500/30 absolute inset-0 animate-pulse rounded-full bg-linear-to-br blur-xl" />
            {/* Main circle */}
            <div className="from-aqua-500 to-ocean-500 relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br shadow-2xl">
              {/* Checkmark */}
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Decorative particles */}
            <div className="bg-aqua-400 absolute -top-2 -right-2 h-3 w-3 animate-ping rounded-full" />
            <div
              className="bg-ocean-400 absolute -bottom-1 -left-3 h-2 w-2 animate-ping rounded-full"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="bg-aqua-300 absolute -right-4 bottom-2 h-2 w-2 animate-ping rounded-full"
              style={{ animationDelay: "0.6s" }}
            />
          </div>
        </div>

        <Card className="animate-fade-in-up text-center">
          <CardContent className="py-8">
            {/* Celebration badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-green-500/20 to-emerald-500/20 px-4 py-1.5 text-sm font-medium text-emerald-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified Successfully
            </div>

            {/* Heading */}
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
                You&apos;re All Set!
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-ocean-200/80 mb-6 text-lg">
              Your subscription to{" "}
              <span className="text-aqua-300 font-semibold">{name}</span> is now
              active.
            </p>

            {/* Feature highlights */}
            <div className="border-ocean-700/50 bg-ocean-900/30 mb-8 rounded-xl border p-4">
              <p className="text-ocean-200/70 text-sm">
                <svg
                  className="text-aqua-400 mr-2 inline h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                You&apos;ll receive alerts when conditions match your
                preferences
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add More Spots
                </Button>
              </Link>
              <Link href="/my-spots">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View My Spots
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifySubscriptionPage;
