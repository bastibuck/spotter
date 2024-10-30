"use client";

import { useState } from "react";
import { type spots } from "~/server/db/schema";

import { api } from "~/trpc/react";

const WIND_SPEED_MIN = 18;
const WIND_SPEED_MAX = 30;

function SubscribeToSpotForm({ spot }: { spot: typeof spots.$inferSelect }) {
  const [email, setEmail] = useState("");
  const [windSpeedMin, setWindSpeedMin] = useState(WIND_SPEED_MIN);
  const [windSpeedMax, setWindSpeedMax] = useState(WIND_SPEED_MAX);

  const subscribe = api.subscription.subscribe.useMutation({
    onSuccess: async () => {
      setEmail("");
      setWindSpeedMin(WIND_SPEED_MIN);
      setWindSpeedMax(WIND_SPEED_MAX);
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
            windSpeedMin,
            windSpeedMax,
            windDirections: spot.defaultWindDirections,
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
        />

        <input
          type="number"
          placeholder="Min. wind speed"
          value={windSpeedMin}
          onChange={(e) => setWindSpeedMin(e.target.valueAsNumber)}
          className="w-full px-4 py-2 text-black"
        />

        <input
          type="number"
          placeholder="Max. wind speed"
          value={windSpeedMax}
          onChange={(e) => setWindSpeedMax(e.target.valueAsNumber)}
          className="w-full px-4 py-2 text-black"
        />

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
