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

const cardinalDirections = ["N", "E", "S", "W"];
const primaryDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

const WindCompass: React.FC<{
  selectedDirections: (keyof typeof directionAngles)[];
  toggleDirection?: (direction: keyof typeof directionAngles) => void;
  disabled?: boolean;
}> = ({ selectedDirections, toggleDirection, disabled = false }) => {
  const isInteractive = !!toggleDirection;
  const size = 240;
  const center = size / 2;
  const outerRadius = 100;
  const innerRadius = 65;

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Outer glow ring */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius + 8}
          fill="none"
          stroke="url(#outerGlow)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="rgba(135, 191, 224, 0.2)"
          strokeWidth="2"
        />

        {/* Inner ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="rgba(10, 22, 40, 0.4)"
          stroke="rgba(135, 191, 224, 0.1)"
          strokeWidth="1"
        />

        {/* Tick marks for all 16 directions */}
        {Object.entries(directionAngles).map(([dir, angle]) => {
          const isPrimary = primaryDirections.includes(dir);
          const tickLength = isPrimary ? 12 : 6;
          const radian = (angle - 90) * (Math.PI / 180);
          const x1 = center + (outerRadius - tickLength) * Math.cos(radian);
          const y1 = center + (outerRadius - tickLength) * Math.sin(radian);
          const x2 = center + outerRadius * Math.cos(radian);
          const y2 = center + outerRadius * Math.sin(radian);

          return (
            <line
              key={`tick-${dir}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                isPrimary
                  ? "rgba(135, 191, 224, 0.5)"
                  : "rgba(135, 191, 224, 0.2)"
              }
              strokeWidth={isPrimary ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Selected direction lines to buttons */}
        {selectedDirections.map((dir) => {
          const angle = directionAngles[dir];
          const radian = (angle - 90) * (Math.PI / 180);
          const buttonRadius = innerRadius + 18; // Match the button placement
          const x = center + buttonRadius * Math.cos(radian);
          const y = center + buttonRadius * Math.sin(radian);

          return (
            <line
              key={`line-${dir}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          );
        })}

        {/* Center point */}
        <circle cx={center} cy={center} r="6" fill="url(#centerGradient)" />
        <circle cx={center} cy={center} r="3" fill="white" opacity="0.9" />

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="outerGlow">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3a7ca5" />
          </radialGradient>
        </defs>
      </svg>

      {/* Cardinal labels */}
      {cardinalDirections.map((dir) => {
        const angle = directionAngles[dir as keyof typeof directionAngles];
        const radian = (angle - 90) * (Math.PI / 180);
        const labelRadius = outerRadius + 20;
        const x = center + labelRadius * Math.cos(radian);
        const y = center + labelRadius * Math.sin(radian);

        return (
          <span
            key={`label-${dir}`}
            className="text-ocean-200 absolute -translate-x-1/2 -translate-y-1/2 text-xs font-bold"
            style={{ left: x, top: y }}
          >
            {dir}
          </span>
        );
      })}

      {/* Direction buttons */}
      {Object.entries(directionAngles).map(([dir, angle]) => {
        const direction = dir as keyof typeof directionAngles;
        const isSelected = selectedDirections.includes(direction);
        const radian = (angle - 90) * (Math.PI / 180);
        const buttonRadius = innerRadius + 18;
        const x = center + buttonRadius * Math.cos(radian);
        const y = center + buttonRadius * Math.sin(radian);
        const isPrimary = primaryDirections.includes(dir);
        const buttonSize = isPrimary ? 20 : 14;

        if (isInteractive) {
          return (
            <button
              key={`btn-${dir}`}
              type="button"
              onClick={() => {
                toggleDirection(direction);
              }}
              disabled={disabled}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                isSelected
                  ? "bg-aqua-400 shadow-aqua-400/50 shadow-lg"
                  : "bg-ocean-700/60 hover:bg-ocean-600/80 hover:scale-110"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              style={{
                left: x,
                top: y,
                width: buttonSize,
                height: buttonSize,
              }}
              title={direction}
            />
          );
        }

        return (
          <div
            key={`dot-${dir}`}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
              isSelected
                ? "bg-aqua-400 shadow-aqua-400/50 shadow-lg"
                : "bg-ocean-800/40"
            }`}
            style={{
              left: x,
              top: y,
              width: buttonSize - 4,
              height: buttonSize - 4,
            }}
          />
        );
      })}
    </div>
  );
};

export default WindCompass;
