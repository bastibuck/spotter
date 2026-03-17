import Link from "next/link";

import SuggestSpotForm from "./_components/SuggestSpotForm";
import { Button } from "~/components/ui/Button";

export default function SuggestSpotPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col justify-center">
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
        <div className="text-ocean-100 mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
          <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
          Help Expand Spotter
        </div>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
            Suggest a Spot
          </span>
        </h1>

        <p className="text-ocean-200/80 mx-auto max-w-2xl text-lg leading-relaxed">
          Know a great location we should track next? Send it over and we will
          review it for a future release.
        </p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <SuggestSpotForm />
      </div>
    </div>
  );
}
