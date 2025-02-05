"use client";

import { useState } from "react";
import { type spots } from "~/server/db/schema";

import { api } from "~/trpc/react";
import CardinalDirection from "../../../components/spots/Cardinals";

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
    onSuccess: () => {
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
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full bg-white px-4 py-2 text-black"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min. wind speed"
            value={windSpeedMin}
            onChange={(e) => {
              setWindSpeedMin(
                isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
              );
            }}
            className="w-full bg-white px-4 py-2 text-black"
            required
          />
          <p>kn</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Max. wind speed"
            value={windSpeedMax}
            onChange={(e) => {
              setWindSpeedMax(
                isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
              );
            }}
            className="w-full bg-white px-4 py-2 text-black"
            required
          />
          <p>kn</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="w-full">Wind directions</p>

          <CardinalDirection
            selectedDirections={windDirections}
            toggleDirection={toggleWindDirection}
          />
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
