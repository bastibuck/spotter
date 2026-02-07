import React from "react";
import { Badge } from "~/components/ui/Badge";

interface LocationBadgeProps {
  lat: number;
  long: number;
  /** Number of decimal places for coordinates (default: 4) */
  precision?: number;
  className?: string;
}

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const LocationBadge: React.FC<LocationBadgeProps> = ({
  lat,
  long,
  precision = 4,
  className,
}) => {
  return (
    <Badge variant="info" className={className}>
      <LocationIcon className="mr-1 h-3 w-3" />
      {lat.toFixed(precision)}, {long.toFixed(precision)}
    </Badge>
  );
};
