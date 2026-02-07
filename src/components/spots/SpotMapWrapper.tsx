"use client";

import dynamic from "next/dynamic";
import type { SpotMapProps } from "./SpotMap";

// Dynamically import SpotMap with SSR disabled to prevent window errors during build
const SpotMapDynamic = dynamic(
  () => import("./SpotMap").then((mod) => mod.SpotMap),
  {
    ssr: false,
  },
);

// Re-export with same interface, wrapping to prevent layout shift
export const SpotMap: React.FC<SpotMapProps> = ({
  height = "h-[250px]",
  ...props
}) => {
  return (
    <div className={`${height} relative w-full`}>
      <SpotMapDynamic height={height} {...props} />
    </div>
  );
};
