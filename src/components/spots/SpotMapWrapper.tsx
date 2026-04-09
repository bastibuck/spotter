"use client";

import React from "react";
import dynamic from "next/dynamic";
import type {
  SpotMapLocationPickerProps,
  SpotMapPinProps,
  SpotMapProps,
  SpotMapRootProps,
} from "./SpotMap";

const SpotMapRootDynamic = dynamic(
  () => import("./SpotMap").then((mod) => mod.SpotMapRoot),
  {
    ssr: false,
  },
);

const SpotMapPinDynamic = dynamic(
  () => import("./SpotMap").then((mod) => mod.SpotMapPin),
  {
    ssr: false,
  },
);

const SpotMapDynamic = dynamic(
  () => import("./SpotMap").then((mod) => mod.SpotMap),
  {
    ssr: false,
  },
);

const SpotMapLocationPickerDynamic = dynamic(
  () => import("./SpotMap").then((mod) => mod.SpotMapLocationPicker),
  {
    ssr: false,
  },
);

export const SpotMapRoot: React.FC<SpotMapRootProps> = ({
  height = "h-[250px]",
  ...props
}) => {
  return (
    <div className={`${height} relative w-full`}>
      <SpotMapRootDynamic height={height} {...props} />
    </div>
  );
};

export const SpotMapPin: React.FC<SpotMapPinProps> = (props) => {
  return <SpotMapPinDynamic {...props} />;
};

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

export const SpotMapLocationPicker: React.FC<SpotMapLocationPickerProps> = ({
  height = "h-[280px]",
  ...props
}) => {
  return (
    <div className={`${height} relative w-full`}>
      <SpotMapLocationPickerDynamic height={height} {...props} />
    </div>
  );
};
