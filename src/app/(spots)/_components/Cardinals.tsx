"use client";

import React from "react";
import { type WindDirection } from "~/server/db/schema";

const directionAngles: { [key in keyof typeof WindDirection.enum]: number } = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};

const CardinalDirection: React.FC<{
  selectedDirections: (keyof typeof directionAngles)[];
  toggleDirection?: (direction: keyof typeof directionAngles) => void;
}> = ({ selectedDirections, toggleDirection }) => {
  return (
    <div className="relative h-72 w-72 -rotate-90">
      {Object.keys(directionAngles).map((key) => {
        const direction = key as keyof typeof directionAngles;
        const angle = directionAngles[direction];

        const isSelected = selectedDirections.includes(direction);

        return (
          <button
            key={direction}
            type="button"
            onClick={() => {
              toggleDirection?.(direction);
            }}
            className={`absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full`}
            style={{
              top: `50%`,
              left: `50%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translate(100px) rotate(-90deg)`,
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <div
                className={`h-0 w-0 border-r-[20px] border-b-[72px] border-l-[20px] border-transparent ${
                  isSelected ? "border-b-blue-500" : "border-b-white/10"
                } `}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CardinalDirection;
