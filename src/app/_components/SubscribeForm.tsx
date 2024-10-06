"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

function SubscribeToSpotForm({ spotId }: { spotId: number }) {
  const [email, setEmail] = useState("");

  const subscribe = api.subscription.subscribe.useMutation({
    onSuccess: async () => {
      setEmail("");
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
          subscribe.mutate({ email, spotId });
        }}
        className="flex flex-col gap-2 md:flex-row"
      >
        <input
          type="text"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
