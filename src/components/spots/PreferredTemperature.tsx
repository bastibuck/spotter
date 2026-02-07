import type { TemperatureStats } from "~/server/db/queries";

interface PreferredTemperatureProps {
  stats: TemperatureStats | null;
  subscriberCount: number;
}

// Aqua color for consistent styling
const ACCENT_RGB = "34, 211, 238";

// Input validation limits (do not exceed these)
const INPUT_MIN_TEMP = -20;
const INPUT_MAX_TEMP = 50;

/**
 * Rounds down to the nearest multiple of 5, clamped to input min.
 */
function floorTo5(value: number): number {
  return Math.max(INPUT_MIN_TEMP, Math.floor(value / 5) * 5);
}

/**
 * Rounds up to the nearest multiple of 5, clamped to input max.
 */
function ceilTo5(value: number): number {
  return Math.min(INPUT_MAX_TEMP, Math.ceil(value / 5) * 5);
}

/**
 * Generates tick marks at every 5 degrees within the given range.
 */
function generateTicks(min: number, max: number): number[] {
  const ticks: number[] = [];
  for (let t = min; t <= max; t += 5) {
    ticks.push(t);
  }
  return ticks;
}

/**
 * Displays the preferred minimum temperature of subscribers as a bar visualization.
 * Shows percentage of subscribers with a temperature preference and the range.
 */
export const PreferredTemperature: React.FC<PreferredTemperatureProps> = ({
  stats,
  subscriberCount,
}) => {
  // Don't show if no subscribers or no stats
  if (subscriberCount === 0 || stats === null) {
    return null;
  }

  // Don't show if no one has set a temperature preference
  if (stats.percentageWithPreference === 0) {
    return null;
  }

  const { avgMin, minOfMins, maxOfMins, percentageWithPreference } = stats;

  // Calculate dynamic range with padding, rounded to nearest 5, clamped to input limits
  const rangeMin = floorTo5(minOfMins - 5);
  const rangeMax = ceilTo5(maxOfMins + 5);

  // Calculate percentages for positioning
  const toPercent = (value: number) =>
    ((value - rangeMin) / (rangeMax - rangeMin)) * 100;

  const avgMinPercent = toPercent(avgMin);
  const minOfMinsPercent = toPercent(minOfMins);
  const maxOfMinsPercent = toPercent(maxOfMins);

  // Generate tick marks at every 5 degrees within the range
  const ticks = generateTicks(rangeMin, rangeMax);

  return (
    <div>
      <h3 className="text-ocean-200 mb-4 text-sm font-medium">
        Minimum Temperature
        <span className="text-ocean-400 ml-2 font-normal">
          ({percentageWithPreference}% of subscribers)
        </span>
      </h3>

      <div className="space-y-4">
        {/* Main bar visualization */}
        <div className="relative">
          {/* Background track */}
          <div className="bg-ocean-800/60 h-8 w-full rounded-full border border-white/5" />

          {/* Full range indicator (lighter, shows min to max of all preferences) */}
          <div
            className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full"
            style={{
              left: `${minOfMinsPercent}%`,
              width: `${maxOfMinsPercent - minOfMinsPercent}%`,
              backgroundColor: `rgba(${ACCENT_RGB}, 0.15)`,
            }}
          />

          {/* Average marker (highlighted) */}
          <div
            className="absolute top-1/2 h-6 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${avgMinPercent}%`,
              background: `rgba(${ACCENT_RGB}, 0.8)`,
              boxShadow: `0 0 12px rgba(${ACCENT_RGB}, 0.4)`,
            }}
          />
        </div>

        {/* Tick marks and labels */}
        <div className="relative h-4">
          {ticks.map((tick) => (
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
              className="h-3 w-3 rounded-full"
              style={{
                background: `rgba(${ACCENT_RGB}, 0.8)`,
              }}
            />
            <span className="text-ocean-200 text-sm">Avg: {avgMin}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-6 rounded-full"
              style={{
                backgroundColor: `rgba(${ACCENT_RGB}, 0.15)`,
              }}
            />
            <span className="text-ocean-400 text-sm">
              Range: {minOfMins}°C - {maxOfMins}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
