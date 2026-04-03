import React from "react";

export default function HomepageHeroSection(): React.JSX.Element {
  return (
    <div className="animate-fade-in-up relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 px-6 py-8 text-center shadow-[0_30px_120px_rgba(5,16,32,0.45)] md:mb-8 md:px-10 md:py-10">
      <div className="bg-aqua-400/12 absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-ocean-400/12 absolute right-0 bottom-0 h-48 w-48 rounded-full blur-3xl" />

      <div className="relative">
        <div className="text-ocean-100 mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
          <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
          Wind Alerts for Surfers
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl lg:text-[5.5rem]">
          <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
            Catch the Perfect Wind
          </span>
        </h1>
        <p className="text-ocean-200/80 mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-2xl">
          Subscribe to your favorite surf spots and get notified when the
          conditions are just right.
        </p>
      </div>
    </div>
  );
}
