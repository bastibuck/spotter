"use client";

import { useState } from "react";
import { WindDirection, type spots } from "~/server/db/schema";

import { api } from "~/trpc/react";

function SubscribeToSpotForm({ spot }: { spot: typeof spots.$inferSelect }) {
  const [email, setEmail] = useState("");
  const [windSpeedMin, setWindSpeedMin] = useState<number | "">("");
  const [windSpeedMax, setWindSpeedMax] = useState<number | "">("");

  const [windDirections, setWindDirections] = useState(
    spot.defaultWindDirections,
  );

  const toggleWindDirection = (direction: (typeof windDirections)[number]) => {
    setWindDirections((prev) => {
      if (prev.includes(direction)) {
        return prev.filter((d) => d !== direction);
      } else {
        return [...prev, direction];
      }
    });
  };

  const subscribe = api.subscription.subscribe.useMutation({
    onSuccess: async () => {
      setEmail("");
      setWindSpeedMin("");
      setWindSpeedMax("");
      setWindDirections(spot.defaultWindDirections);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <div className="w-full md:max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          subscribe.mutate({
            email,
            spotId: spot.id,
            windSpeedMin: windSpeedMin as number,
            windSpeedMax: windSpeedMax as number,
            windDirections,
          });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 text-black"
          required
        />

        <input
          type="number"
          placeholder="Min. wind speed"
          value={windSpeedMin}
          onChange={(e) =>
            setWindSpeedMin(
              isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
            )
          }
          className="w-full px-4 py-2 text-black"
          required
        />

        <input
          type="number"
          placeholder="Max. wind speed"
          value={windSpeedMax}
          onChange={(e) =>
            setWindSpeedMax(
              isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
            )
          }
          className="w-full px-4 py-2 text-black"
          required
        />

        <div className="flex flex-wrap gap-2">
          {WindDirection.options.map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => toggleWindDirection(direction)}
              className={`${
                windDirections.includes(direction)
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-white/50"
              } rounded-md px-4 py-2`}
            >
              {direction}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={subscribe.isPending}
        >
          {subscribe.isPending ? "Submitting..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}

export default SubscribeToSpotForm;
