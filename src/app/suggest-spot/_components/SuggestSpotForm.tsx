"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { SpotMapLocationPicker } from "~/components/spots/SpotMapWrapper";
import { api } from "~/trpc/react";

interface SuggestSpotFormState {
  name: string;
  description: string;
  lat: number | "";
  long: number | "";
}

const initialFormState: SuggestSpotFormState = {
  name: "",
  description: "",
  lat: "",
  long: "",
};

const SuggestSpotForm: React.FC = () => {
  const [form, setForm] = useState(initialFormState);

  const hasLat = form.lat !== "";
  const hasLong = form.long !== "";
  const coordinatesArePartial = hasLat !== hasLong;

  const createSuggestion = api.spotSuggestion.create.useMutation({
    onSuccess: () => {
      setForm(initialFormState);
      toast.success("Thanks, your spot suggestion is in for review.");
    },
    onError: (error) => {
      toast.error(error.message || "Could not submit your suggestion.");
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Suggest a New Spot</CardTitle>
        <CardDescription className="text-base">
          Share a spot we should add next. Coordinates are optional, but if you
          add one, include both.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (coordinatesArePartial) {
              toast.error(
                "Please fill in both latitude and longitude, or leave both empty.",
              );
              return;
            }

            createSuggestion.mutate({
              name: form.name,
              description: form.description,
              lat: form.lat === "" ? undefined : form.lat,
              long: form.long === "" ? undefined : form.long,
            });
          }}
          className="space-y-5"
        >
          <Input
            label="Spot name"
            placeholder="e.g. Tarifa Lagoon"
            value={form.name}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, name: event.target.value }));
            }}
            required
            disabled={createSuggestion.isPending}
            enterKeyHint="next"
            maxLength={128}
          />

          <Textarea
            label="Why this spot? Any special infos?"
            placeholder="Optional details about the location, launch, local conditions, or what makes this spot worth tracking"
            value={form.description}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, description: event.target.value }));
            }}
            disabled={createSuggestion.isPending}
            maxLength={1000}
          />

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-ocean-200 text-sm font-medium">
                Location{" "}
                <span className="text-ocean-200/60 font-normal">
                  (optional)
                </span>
              </p>
              <p className="text-ocean-200/65 text-sm leading-relaxed">
                Click on the map to pin the spot, or enter coordinates manually
                below.
              </p>
            </div>

            <SpotMapLocationPicker
              lat={form.lat === "" ? null : form.lat}
              long={form.long === "" ? null : form.long}
              onChange={(position) => {
                if (position === null) {
                  setForm((prev) => ({ ...prev, lat: "", long: "" }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    lat: parseFloat(position.lat.toFixed(6)),
                    long: parseFloat(position.long.toFixed(6)),
                  }));
                }
              }}
              disabled={createSuggestion.isPending}
              height="h-[280px]"
            />

            {hasLat && hasLong ? (
              <button
                type="button"
                className="text-ocean-200/60 hover:text-ocean-200 text-sm underline transition-colors"
                onClick={() => {
                  setForm((prev) => ({ ...prev, lat: "", long: "" }));
                }}
                disabled={createSuggestion.isPending}
              >
                Clear location
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="number"
              inputMode="decimal"
              label="Latitude"
              placeholder="Optional"
              value={form.lat}
              onChange={(event) => {
                setForm((prev) => ({
                  ...prev,
                  lat: isNaN(event.target.valueAsNumber)
                    ? ""
                    : event.target.valueAsNumber,
                }));
              }}
              min={-90}
              max={90}
              step="any"
              disabled={createSuggestion.isPending}
            />

            <Input
              type="number"
              inputMode="decimal"
              label="Longitude"
              placeholder="Optional"
              value={form.long}
              onChange={(event) => {
                setForm((prev) => ({
                  ...prev,
                  long: isNaN(event.target.valueAsNumber)
                    ? ""
                    : event.target.valueAsNumber,
                }));
              }}
              min={-180}
              max={180}
              step="any"
              disabled={createSuggestion.isPending}
            />
          </div>

          {coordinatesArePartial ? (
            <p className="text-sm text-amber-300">
              Add both coordinates or leave both empty.
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            isLoading={createSuggestion.isPending}
          >
            {createSuggestion.isPending ? "Submitting..." : "Submit Suggestion"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SuggestSpotForm;
