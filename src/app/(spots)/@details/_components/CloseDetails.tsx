"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const CloseDetails = () => {
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      <Link
        href="/"
        className="bg-ocean-950/80 fixed inset-0 z-40 backdrop-blur-sm"
        onClick={() => {
          router.back();
        }}
      />

      {/* Close button */}
      <Link
        href="/"
        className="glass-card text-ocean-200 hover:border-aqua-400/50 fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:text-white"
        onClick={() => {
          router.back();
        }}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Link>
    </>
  );
};

export default CloseDetails;
