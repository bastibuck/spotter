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

const mainDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

const CardinalDirection: React.FC<{
  selectedDirections: (keyof typeof directionAngles)[];
  toggleDirection?: (direction: keyof typeof directionAngles) => void;
}> = ({ selectedDirections, toggleDirection }) => {
  const isInteractive = !!toggleDirection;

  return (
    <div className="relative h-64 w-64">
      {/* Outer ring */}
      <div className="border-ocean-600/30 absolute inset-0 rounded-full border-2" />

      {/* Inner decorative ring */}
      <div className="border-ocean-500/20 absolute inset-4 rounded-full border" />

      {/* Center point */}
      <div className="bg-aqua-400 shadow-aqua-400/50 absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg" />

      {/* Direction markers */}
      {Object.keys(directionAngles).map((key) => {
        const direction = key as keyof typeof directionAngles;
        const angle = directionAngles[direction];
        const isSelected = selectedDirections.includes(direction);
        const isMain = mainDirections.includes(direction);

        // Calculate position on the circle
        const radius = 100; // distance from center in px
        const radian = (angle - 90) * (Math.PI / 180);
        const x = 50 + (radius / 256) * 100 * Math.cos(radian);
        const y = 50 + (radius / 256) * 100 * Math.sin(radian);

        return (
          <React.Fragment key={direction}>
            {/* Direction wedge/button */}
            {isInteractive ? (
              <button
                type="button"
                onClick={() => {
                  toggleDirection(direction);
                }}
                className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-aqua-400 shadow-aqua-400/50 scale-125 shadow-lg"
                    : "bg-ocean-700/50 hover:bg-ocean-600/50 hover:scale-110"
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                title={direction}
              >
                {isMain && (
                  <span
                    className="absolute -translate-x-1/2 text-[8px] font-bold text-white/90"
                    style={{
                      top:
                        direction === "N"
                          ? "-12px"
                          : direction === "S"
                            ? "16px"
                            : undefined,
                      left:
                        direction === "W"
                          ? "-12px"
                          : direction === "E"
                            ? "16px"
                            : undefined,
                    }}
                  >
                    {direction}
                  </span>
                )}
              </button>
            ) : (
              <div
                className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  isSelected
                    ? "bg-aqua-400 shadow-aqua-400/50 shadow-lg"
                    : "bg-ocean-800/30"
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              />
            )}

            {/* Connecting line to center for selected directions */}
            {isSelected && (
              <div
                className="from-aqua-400/0 via-aqua-400/30 to-aqua-400/0 absolute top-1/2 left-1/2 h-0.5 origin-left bg-gradient-to-r"
                style={{
                  width: `${radius - 16}px`,
                  transform: `rotate(${angle}deg)`,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Cardinal labels */}
      <span className="text-ocean-200 absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
        N
      </span>
      <span className="text-ocean-200 absolute bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs font-bold">
        S
      </span>
      <span className="text-ocean-200 absolute top-1/2 left-1 -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
        W
      </span>
      <span className="text-ocean-200 absolute top-1/2 right-1 translate-x-1/2 -translate-y-1/2 text-xs font-bold">
        E
      </span>
    </div>
  );
};

export default CardinalDirection;
