"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

const MySpotsForm: React.FC = () => {
  const [email, setEmail] = useState("");

  const requestManagementEmail = api.subscription.mySubscriptions.useMutation({
    onSuccess: () => {
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
          requestManagementEmail.mutate({
            email,
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

        <button
          type="submit"
          className="bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={requestManagementEmail.isPending}
        >
          {requestManagementEmail.isPending ? "Submitting..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
};

export default MySpotsForm;
