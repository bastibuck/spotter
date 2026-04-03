import Link from "next/link";
import React from "react";

import { Button } from "~/components/ui/Button";

export default function HomepageSuggestionSection(): React.JSX.Element {
  return (
    <div className="border-aqua-300/20 from-aqua-500/12 via-ocean-900/55 to-ocean-950/80 relative mt-8 overflow-hidden rounded-[2rem] border bg-linear-to-br px-6 py-8 text-center shadow-[0_24px_80px_rgba(2,10,22,0.55)] ring-1 ring-white/8 backdrop-blur-sm md:px-10 md:py-10">
      <div className="bg-aqua-300/18 absolute -top-8 left-8 h-32 w-32 rounded-full blur-3xl" />
      <div className="bg-ocean-300/16 absolute right-6 bottom-0 h-40 w-40 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-2xl">
        <div className="text-aqua-100 border-aqua-200/20 mb-4 inline-flex items-center gap-2 rounded-full border bg-white/8 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] uppercase">
          <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
          Coverage Request
        </div>

        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Missing your favorite spot?
        </h2>
        <p className="text-ocean-200/80 mt-3 text-base leading-relaxed md:text-lg">
          If there is a location we should track next, send us the name and any
          extra context you have. We review every suggestion as we expand
          coverage.
        </p>

        <div className="mt-6 flex justify-center">
          <Link href="/suggest-spot">
            <Button variant="secondary" size="lg">
              Suggest a New Spot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
