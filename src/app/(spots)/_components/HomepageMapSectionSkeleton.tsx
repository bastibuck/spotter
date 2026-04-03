import React from "react";

export default function HomepageMapSectionSkeleton(): React.JSX.Element {
  return (
    <section className="relative">
      <div className="bg-aqua-400/10 absolute top-10 -left-8 h-40 w-40 rounded-full blur-3xl" />
      <div className="bg-ocean-300/10 absolute right-0 -bottom-8 h-48 w-48 rounded-full blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 shadow-[0_32px_100px_rgba(3,12,24,0.45)] backdrop-blur-sm">
        <div className="h-[500px] w-full animate-pulse md:h-[660px] lg:h-[720px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.16),transparent_22%),radial-gradient(circle_at_80%_28%,rgba(125,211,252,0.12),transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.28),rgba(15,23,42,0.7))]" />

          <div className="absolute inset-0 flex items-center justify-center text-lg text-white">
            Loading spots...
          </div>
        </div>
      </div>
    </section>
  );
}
