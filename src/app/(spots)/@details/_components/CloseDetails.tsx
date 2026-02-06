"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CloseDetails = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="glass-card text-ocean-200 hover:border-aqua-400/50 hover:bg-ocean-700/50 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all hover:text-white"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
};

export default CloseDetails;
