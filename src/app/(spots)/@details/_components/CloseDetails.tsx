"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const CloseDetails = () => {
  const router = useRouter();

  return (
    <Link
      href="/"
      className="fixed top-0 block h-full w-full bg-slate-800 opacity-30"
      onClick={() => {
        router.back();
      }}
    />
  );
};

export default CloseDetails;
