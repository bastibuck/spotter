import Link from "next/link";
import MySpotsForm from "./_components/MySpotsForm";
import { Button } from "~/components/ui/Button";

export default function MySpots() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Button>
          </Link>
        </div>

        <div className="animate-fade-in-up mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
              My Spots
            </span>
          </h1>
          <p className="text-ocean-200/80 text-lg">
            Enter your email to receive a summary of all your subscriptions
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <MySpotsForm />
        </div>
      </div>
    </div>
  );
}
