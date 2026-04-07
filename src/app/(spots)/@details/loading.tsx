import React from "react";

import Backdrop from "./_components/Backdrop";

const Loading = () => {
  return (
    <>
      <Backdrop />

      <div className="ocean-gradient fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-white/10 shadow-2xl">
        <div className="flex items-center gap-4 p-6 pb-0">
          <div className="h-10 w-10 animate-pulse rounded-full border border-white/10 bg-white/5" />
          <div className="h-4 w-12 animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="h-8 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="flex gap-3">
              <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>

          <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-[250px] w-full animate-pulse rounded-[1.5rem] bg-white/10" />
          </div>

          <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="h-5 w-48 animate-pulse rounded-full bg-white/10" />
            <div className="h-24 w-full animate-pulse rounded-[1.5rem] bg-white/10" />
            <div className="h-24 w-full animate-pulse rounded-[1.5rem] bg-white/10" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
