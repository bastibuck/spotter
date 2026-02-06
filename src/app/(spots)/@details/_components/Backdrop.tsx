"use client";

import { useRouter } from "next/navigation";

const Backdrop = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.back();
      }}
      className="bg-ocean-950/80 fixed inset-0 z-40 cursor-pointer backdrop-blur-sm"
      aria-label="Close panel"
    />
  );
};

export default Backdrop;
