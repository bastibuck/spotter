"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Backdrop = () => {
  const router = useRouter();

  useEffect(() => {
    // Prevent background scrolling when overlay is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
