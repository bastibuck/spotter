import type { WindDirectionPopularity } from "~/server/db/queries";
import WindCompass from "./Cardinals";

interface PopularWindDirectionsProps {
  popularity: WindDirectionPopularity;
  subscriberCount: number;
}

// Aqua color for consistent styling with compass
const ACCENT_RGB = "34, 211, 238";

/**
 * Displays popular wind directions among subscribers.
 * Only shown when there are active subscribers.
 */
export const PopularWindDirections: React.FC<PopularWindDirectionsProps> = ({
  popularity,
  subscriberCount,
}) => {
  // Don't show if no subscribers
  if (subscriberCount === 0) {
    return null;
  }

  // Get all directions with popularity > 0, sorted by popularity
  const popularDirections = Object.entries(popularity)
    .filter(([, percent]) => percent > 0)
    .sort((a, b) => b[1] - a[1]);

  if (popularDirections.length === 0) {
    return null;
  }

  // Find max popularity for relative styling
  const maxPopularity = popularDirections[0]?.[1] ?? 1;

  return (
    <div>
      <h3 className="text-ocean-200 mb-4 text-sm font-medium">
        Popular Wind Directions
      </h3>

      <div className="flex flex-col items-center gap-6">
        <WindCompass popularity={popularity} />

        {/* All popular directions legend */}
        <div className="flex flex-wrap justify-center gap-2">
          {popularDirections.map(([dir, percent]) => {
            const relativeIntensity = percent / maxPopularity;
            return (
              <div
                key={dir}
                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: `rgba(${ACCENT_RGB}, ${0.08 + relativeIntensity * 0.15})`,
                }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `rgba(${ACCENT_RGB}, ${0.4 + relativeIntensity * 0.6})`,
                  }}
                />
                <span className="text-ocean-100 text-sm font-medium">
                  {dir}
                </span>
                <span className="text-ocean-400 text-xs">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
