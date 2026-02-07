import type { WindSpeedStats } from "~/server/db/queries";

interface PreferredWindSpeedProps {
  stats: WindSpeedStats | null;
  subscriberCount: number;
}

// Aqua color for consistent styling
const ACCENT_RGB = "34, 211, 238";

// Wind speed range for the visualization (0-50 knots covers most kitesurfing conditions)
const MIN_SPEED = 0;
const MAX_SPEED = 50;

/**
 * Displays the preferred wind speed range of subscribers as a bar visualization.
 * Shows the average preferred range highlighted, with the full range of all preferences indicated.
 */
export const PreferredWindSpeed: React.FC<PreferredWindSpeedProps> = ({
  stats,
  subscriberCount,
}) => {
  // Don't show if no subscribers or no stats
  if (subscriberCount === 0 || stats === null) {
    return null;
  }

  const { avgMin, avgMax, minOfMins, maxOfMaxs } = stats;

  // Calculate percentages for positioning
  const toPercent = (value: number) =>
    ((value - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100;

  const avgMinPercent = toPercent(avgMin);
  const avgMaxPercent = toPercent(avgMax);
  const minOfMinsPercent = toPercent(minOfMins);
  const maxOfMaxsPercent = toPercent(maxOfMaxs);

  return (
    <div>
      <h3 className="text-ocean-200 mb-4 text-sm font-medium">
        Preferred Wind Speed
      </h3>

      <div className="space-y-4">
        {/* Main bar visualization */}
        <div className="relative">
          {/* Background track */}
          <div className="bg-ocean-800/60 h-8 w-full rounded-full border border-white/5" />

          {/* Full range indicator (lighter, shows min of mins to max of maxs) */}
          <div
            className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full"
            style={{
              left: `${minOfMinsPercent}%`,
              width: `${maxOfMaxsPercent - minOfMinsPercent}%`,
              backgroundColor: `rgba(${ACCENT_RGB}, 0.15)`,
            }}
          />

          {/* Average range (highlighted) */}
          <div
            className="absolute top-1/2 h-6 -translate-y-1/2 rounded-full"
            style={{
              left: `${avgMinPercent}%`,
              width: `${avgMaxPercent - avgMinPercent}%`,
              background: `linear-gradient(90deg, rgba(${ACCENT_RGB}, 0.6), rgba(${ACCENT_RGB}, 0.8), rgba(${ACCENT_RGB}, 0.6))`,
              boxShadow: `0 0 12px rgba(${ACCENT_RGB}, 0.4)`,
            }}
          />
        </div>

        {/* Tick marks and labels */}
        <div className="relative h-4">
          {[0, 10, 20, 30, 40, 50].map((tick) => (
            <div
              key={tick}
              className="absolute -translate-x-1/2"
              style={{ left: `${toPercent(tick)}%` }}
            >
              <div className="bg-ocean-600 mx-auto h-2 w-px" />
              <span className="text-ocean-400 mt-1 block text-center text-xs">
                {tick}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-6 rounded-full"
              style={{
                background: `linear-gradient(90deg, rgba(${ACCENT_RGB}, 0.6), rgba(${ACCENT_RGB}, 0.8))`,
              }}
            />
            <span className="text-ocean-200 text-sm">
              Avg: {avgMin}-{avgMax} kts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-6 rounded-full"
              style={{
                backgroundColor: `rgba(${ACCENT_RGB}, 0.15)`,
              }}
            />
            <span className="text-ocean-400 text-sm">
              Range: {minOfMins}-{maxOfMaxs} kts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
