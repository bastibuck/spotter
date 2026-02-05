"use client";

import { useState } from "react";
import { toast } from "sonner";

import { type spots } from "~/server/db/schema";
import { api } from "~/trpc/react";
import CardinalDirection from "../../../components/spots/Cardinals";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";

function SubscribeToSpotForm({ spot }: { spot: typeof spots.$inferSelect }) {
  const [email, setEmail] = useState("");
  const [windSpeedMin, setWindSpeedMin] = useState<number | "">("");
  const [windSpeedMax, setWindSpeedMax] = useState<number | "">("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    windSpeedMin?: string;
    windSpeedMax?: string;
  }>({});

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
      setFieldErrors({});
      setWindDirections(spot.defaultWindDirections);
      toast.success("Check your inbox to verify your subscription");
    },
    onError: (error) => {
      console.log(error.message);
      setFieldErrors({});
      toast.error(
        "Something went wrong. Please check your input and try again.",
      );
    },
  });

  return (
    <div className="w-full">
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
        className="space-y-4"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          required
          disabled={subscribe.isPending}
          error={fieldErrors.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min wind"
            value={windSpeedMin}
            onChange={(e) => {
              setWindSpeedMin(
                isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
              );
              if (fieldErrors.windSpeedMin) {
                setFieldErrors((prev) => ({
                  ...prev,
                  windSpeedMin: undefined,
                }));
              }
            }}
            suffix="kn"
            required
            disabled={subscribe.isPending}
            error={fieldErrors.windSpeedMin}
          />
          <Input
            type="number"
            placeholder="Max wind"
            value={windSpeedMax}
            onChange={(e) => {
              setWindSpeedMax(
                isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber,
              );
              if (fieldErrors.windSpeedMax) {
                setFieldErrors((prev) => ({
                  ...prev,
                  windSpeedMax: undefined,
                }));
              }
            }}
            suffix="kn"
            required
            disabled={subscribe.isPending}
            error={fieldErrors.windSpeedMax}
          />
        </div>

        <div className="pt-2">
          <label className="text-ocean-200 mb-3 block text-sm font-medium">
            Preferred wind directions
          </label>
          <div className="flex justify-center">
            <CardinalDirection
              selectedDirections={windDirections}
              toggleDirection={toggleWindDirection}
              disabled={subscribe.isPending}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={subscribe.isPending}
        >
          {subscribe.isPending ? "Subscribing..." : "Subscribe to Alerts"}
        </Button>
      </form>
    </div>
  );
}

export default SubscribeToSpotForm;
