"use client";

import React from "react";
import type { WindDirectionPopularity } from "~/server/db/queries";

type WindDirectionKey =
  | "N"
  | "NNE"
  | "NE"
  | "ENE"
  | "E"
  | "ESE"
  | "SE"
  | "SSE"
  | "S"
  | "SSW"
  | "SW"
  | "WSW"
  | "W"
  | "WNW"
  | "NW"
  | "NNW";

const directionAngles: Record<WindDirectionKey, number> = {
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

const cardinalDirections: WindDirectionKey[] = ["N", "E", "S", "W"];
const primaryDirections: WindDirectionKey[] = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
];

// Aqua color used throughout
const ACCENT_COLOR = "#22d3ee";
const ACCENT_RGB = "34, 211, 238";

interface BaseProps {
  disabled?: boolean;
}

interface SelectionModeProps extends BaseProps {
  /** Directions to show as selected (100% opacity) */
  selectedDirections: WindDirectionKey[];
  /** Optional callback to make the compass interactive */
  toggleDirection?: (direction: WindDirectionKey) => void;
  popularity?: never;
}

interface PopularityModeProps extends BaseProps {
  /** Popularity percentages for each direction (0-100) */
  popularity: WindDirectionPopularity;
  selectedDirections?: never;
  toggleDirection?: never;
}

type WindCompassProps = SelectionModeProps | PopularityModeProps;

const WindCompass: React.FC<WindCompassProps> = (props) => {
  const { disabled = false } = props;

  const isPopularityMode = "popularity" in props && props.popularity;
  const isInteractive = "toggleDirection" in props && !!props.toggleDirection;

  const size = 240;
  const center = size / 2;
  const outerRadius = 100;
  const innerRadius = 65;

  // For popularity mode, find max for relative scaling
  const maxPopularity = isPopularityMode
    ? Math.max(...Object.values(props.popularity), 1)
    : 100;

  /**
   * Get opacity for a direction based on mode
   */
  const getOpacity = (direction: WindDirectionKey): number => {
    if (isPopularityMode) {
      const percent = props.popularity[direction];
      if (percent === 0) return 0.15;
      // Normalize to max popularity for better visual distribution
      const normalized = percent / maxPopularity;
      return 0.15 + normalized * 0.85;
    }
    // Selection mode: full opacity if selected, dim if not
    return props.selectedDirections.includes(direction) ? 1 : 0.15;
  };

  /**
   * Check if a direction should show the line from center
   */
  const shouldShowLine = (direction: WindDirectionKey): boolean => {
    if (isPopularityMode) {
      return props.popularity[direction] > 0;
    }
    return props.selectedDirections.includes(direction);
  };

  /**
   * Get size multiplier for popularity mode
   */
  const getSizeMultiplier = (direction: WindDirectionKey): number => {
    if (!isPopularityMode) return 1;
    const percent = props.popularity[direction];
    if (percent === 0) return 1;
    const normalized = percent / maxPopularity;
    return 1 + normalized * 0.3; // Up to 30% larger
  };

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
          const isPrimary = primaryDirections.includes(dir as WindDirectionKey);
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

        {/* Direction lines from center */}
        {Object.entries(directionAngles).map(([dir, angle]) => {
          const direction = dir as WindDirectionKey;
          if (!shouldShowLine(direction)) return null;

          const radian = (angle - 90) * (Math.PI / 180);
          const buttonRadius = innerRadius + 18;
          const x = center + buttonRadius * Math.cos(radian);
          const y = center + buttonRadius * Math.sin(radian);
          const opacity = getOpacity(direction);

          return (
            <line
              key={`line-${dir}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={ACCENT_COLOR}
              strokeWidth="2"
              strokeLinecap="round"
              opacity={opacity * 0.5}
            />
          );
        })}

        {/* Center point */}
        <circle cx={center} cy={center} r="6" fill="url(#centerGradient)" />
        <circle cx={center} cy={center} r="3" fill="white" opacity="0.9" />

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="outerGlow">
            <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0" />
            <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor={ACCENT_COLOR} />
            <stop offset="100%" stopColor="#3a7ca5" />
          </radialGradient>
        </defs>
      </svg>

      {/* Cardinal labels */}
      {cardinalDirections.map((dir) => {
        const angle = directionAngles[dir];
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

      {/* Direction dots/buttons */}
      {Object.entries(directionAngles).map(([dir, angle]) => {
        const direction = dir as WindDirectionKey;
        const radian = (angle - 90) * (Math.PI / 180);
        const buttonRadius = innerRadius + 18;
        const x = center + buttonRadius * Math.cos(radian);
        const y = center + buttonRadius * Math.sin(radian);
        const isPrimary = primaryDirections.includes(direction);
        const baseSize = isPrimary ? 16 : 10;
        const sizeMultiplier = getSizeMultiplier(direction);
        const dotSize = baseSize * sizeMultiplier;
        const opacity = getOpacity(direction);
        const isActive = shouldShowLine(direction);

        if (isInteractive && props.toggleDirection) {
          const isSelected = props.selectedDirections.includes(direction);
          const buttonSize = isPrimary ? 20 : 14;

          return (
            <button
              key={`btn-${dir}`}
              type="button"
              onClick={() => props.toggleDirection?.(direction)}
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

        // Non-interactive dot with opacity-based styling
        return (
          <div
            key={`dot-${dir}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{
              left: x,
              top: y,
              width: dotSize,
              height: dotSize,
              backgroundColor: `rgba(${ACCENT_RGB}, ${opacity})`,
              boxShadow: isActive
                ? `0 0 ${8 * opacity}px rgba(${ACCENT_RGB}, ${opacity * 0.5})`
                : "none",
            }}
            title={
              isPopularityMode
                ? `${direction}: ${props.popularity[direction]}%`
                : direction
            }
          />
        );
      })}
    </div>
  );
};

export default WindCompass;
