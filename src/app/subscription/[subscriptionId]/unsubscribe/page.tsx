import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { api } from "~/trpc/server";

const UnsubscribeSubscriptionPage = async (props: {
  params: Promise<{ subscriptionId: string }>;
}) => {
  const params = await props.params;
  const name = await api.subscription
    .unsubscribe({ subscriptionId: params.subscriptionId })
    .then((res) => res.name)
    .catch(() => {
      redirect("/404");
    });

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Animated icon */}
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <div className="relative">
            {/* Soft glow */}
            <div className="bg-ocean-500/20 absolute inset-0 rounded-full blur-2xl" />
            {/* Main circle */}
            <div className="from-ocean-600 to-ocean-800 relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br shadow-lg">
              {/* Bell with slash */}
              <svg
                className="text-ocean-200 h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
                />
              </svg>
            </div>
            {/* Decorative elements */}
            <div className="border-ocean-500/20 absolute -inset-4 rounded-full border" />
          </div>
        </div>

        <Card className="animate-fade-in-up text-center">
          <CardContent className="py-8">
            {/* Status badge */}
            <div className="bg-ocean-700/50 text-ocean-200 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Unsubscribed
            </div>

            {/* Heading */}
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              <span className="from-ocean-200 to-ocean-400 bg-linear-to-r bg-clip-text text-transparent">
                Subscription Removed
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-ocean-200/80 mb-6 text-lg">
              You&apos;ve unsubscribed from{" "}
              <span className="text-ocean-100 font-semibold">{name}</span>.
            </p>

            {/* Divider */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="from-ocean-700 h-px w-20 bg-linear-to-r to-transparent" />
              <div className="bg-ocean-600 h-1.5 w-1.5 rounded-full" />
              <div className="to-ocean-700 h-px w-20 bg-linear-to-r from-transparent" />
            </div>

            {/* Info text */}
            <p className="text-ocean-300/60 mb-8 text-sm">
              You won&apos;t receive wind alerts for this spot anymore. Want to
              explore other locations?
            </p>

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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Browse Spots
                </Button>
              </Link>
              <Link href="/my-spots">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  My Subscriptions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bottom hint */}
        <p className="text-ocean-400/50 mt-6 text-center text-xs">
          Changed your mind? Visit the spot page to subscribe again.
        </p>
      </div>
    </div>
  );
};

export default UnsubscribeSubscriptionPage;
