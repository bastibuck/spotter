import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { api } from "~/trpc/server";

const UnsubscribeAllSpotsPage = async (props: {
  params: Promise<{ kiterId: string }>;
}) => {
  const params = await props.params;
  const deletions = await api.subscription
    .unsubscribeAll({
      kiterId: params.kiterId,
    })
    .then((res) => res)
    .catch(() => {
      redirect("/404");
    });

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Animated icon */}
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing ring */}
            <div className="bg-ocean-500/20 absolute inset-0 animate-ping rounded-full" />
            {/* Main circle */}
            <div className="from-ocean-700 to-ocean-800 relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br shadow-lg">
              {/* Checkmark with wave effect */}
              <svg
                className="text-aqua-400 h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Decorative rings */}
            <div className="border-aqua-400/20 absolute -inset-4 rounded-full border-2" />
            <div className="border-ocean-400/10 absolute -inset-8 rounded-full border" />
          </div>
        </div>

        <Card className="animate-fade-in-up text-center">
          <CardContent className="py-8">
            {/* Heading */}
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
                You&apos;re Unsubscribed
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-ocean-200/80 mb-6 text-lg">
              <span className="text-aqua-300 font-semibold">{deletions}</span>{" "}
              {deletions === 1 ? "subscription has" : "subscriptions have"} been
              removed from your account.
            </p>

            {/* Divider with wave pattern */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <div className="from-ocean-700 h-px w-16 bg-linear-to-r to-transparent" />
              <svg
                className="text-ocean-500 h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 12c2-2 4-3 6-3s4 1 6 3 4 3 6 3 4-1 6-3" />
              </svg>
              <div className="to-ocean-700 h-px w-16 bg-linear-to-r from-transparent" />
            </div>

            {/* Info text */}
            <p className="text-ocean-300/60 mb-8 text-sm">
              You won&apos;t receive any more wind alerts. Changed your mind?
              You can always subscribe again.
            </p>

            {/* CTA Button */}
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Explore Spots
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnsubscribeAllSpotsPage;
