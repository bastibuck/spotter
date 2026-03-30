"use client";

import { Check, MapPinned, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ButtonHTMLAttributes, Dispatch, SetStateAction } from "react";

import { SpotMap } from "~/components/spots/SpotMapWrapper";
import CardinalDirection from "~/components/spots/Cardinals";
import { Badge } from "~/components/ui/Badge";
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
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type SpotSuggestion = RouterOutputs["spotSuggestion"]["list"][number];
type SpotDirection = Parameters<
  NonNullable<React.ComponentProps<typeof CardinalDirection>["toggleDirection"]>
>[0];

interface CreateSpotFormState {
  name: string;
  description: string;
  lat: number | "";
  long: number | "";
  defaultWindDirections: SpotDirection[];
}

interface SpotSuggestionAdminTableProps {
  initialIncludeReviewed: boolean;
}

export default function SpotSuggestionAdminTable({
  initialIncludeReviewed,
}: SpotSuggestionAdminTableProps) {
  const utils = api.useUtils();
  const [includeReviewed, setIncludeReviewed] = useState(
    initialIncludeReviewed,
  );
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<
    number | null
  >(null);
  const [formsBySuggestionId, setFormsBySuggestionId] = useState<
    Record<number, CreateSpotFormState>
  >({});

  const suggestionsQuery = api.spotSuggestion.list.useQuery({
    includeReviewed,
  });

  const removeSuggestion = api.spotSuggestion.remove.useMutation({
    onSuccess: async () => {
      toast.success("Suggestion deleted.");
      await utils.spotSuggestion.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Could not delete suggestion.");
    },
  });

  const markReviewed = api.spotSuggestion.markReviewed.useMutation({
    onSuccess: async () => {
      toast.success("Suggestion marked as reviewed.");
      await utils.spotSuggestion.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Could not mark suggestion as reviewed.");
    },
  });

  const createSpot = api.spotSuggestion.createSpotFromSuggestion.useMutation({
    onSuccess: async (_, variables) => {
      toast.success("Spot created and suggestion reviewed.");
      setSelectedSuggestionId((current) =>
        current === variables.suggestionId ? null : current,
      );
      setFormsBySuggestionId(
        (current) =>
          Object.fromEntries(
            Object.entries(current).filter(
              ([key]) => key !== String(variables.suggestionId),
            ),
          ) as Record<number, CreateSpotFormState>,
      );
      await utils.spotSuggestion.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Could not create spot from suggestion.");
    },
  });

  const suggestions = suggestionsQuery.data ?? [];
  const selectedSuggestion =
    selectedSuggestionId === null
      ? null
      : (suggestions.find(
          (suggestion) => suggestion.id === selectedSuggestionId,
        ) ?? null);
  const selectedFormState =
    selectedSuggestion === null
      ? null
      : (formsBySuggestionId[selectedSuggestion.id] ??
        getInitialCreateSpotFormState(selectedSuggestion));

  return (
    <>
      <Card className="animate-fade-in-up">
        <CardHeader className="gap-5 md:flex md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-3xl">Spot Suggestion Queue</CardTitle>
            <CardDescription className="text-base">
              Review new submissions, clean out fake entries, or turn a
              suggestion into a live spot.
            </CardDescription>
          </div>

          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={includeReviewed}
              onChange={(event) => {
                setIncludeReviewed(event.target.checked);
              }}
              className="h-4 w-4 rounded border border-white/20 bg-transparent"
            />
            Show reviewed suggestions
          </label>
        </CardHeader>

        <CardContent>
          {suggestionsQuery.isLoading ? (
            <p className="text-ocean-200/80">Loading suggestions...</p>
          ) : suggestions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 px-6 py-12 text-center">
              <p className="text-lg font-medium text-white">
                No suggestions here.
              </p>
              <p className="text-ocean-200/70 mt-2 text-sm">
                {includeReviewed
                  ? "No pending or reviewed suggestions matched this filter."
                  : "All open suggestions have been reviewed."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-ocean-200/70 text-left text-xs tracking-[0.24em] uppercase">
                    <th className="border-b border-white/10 px-4 py-3">
                      Suggestion
                    </th>
                    <th className="border-b border-white/10 px-4 py-3">
                      Coordinates
                    </th>
                    <th className="border-b border-white/10 px-4 py-3">
                      Submitted
                    </th>
                    <th className="border-b border-white/10 px-4 py-3">
                      Status
                    </th>
                    <th className="border-b border-white/10 px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((suggestion) => {
                    const isBusy =
                      removeSuggestion.isPending ||
                      markReviewed.isPending ||
                      createSpot.isPending;

                    return (
                      <tr key={suggestion.id} className="align-top">
                        <td className="border-b border-white/8 px-4 py-4">
                          <div className="space-y-2">
                            <div className="font-semibold text-white">
                              {suggestion.name}
                            </div>
                            <p className="text-ocean-200/75 max-w-md text-sm leading-relaxed whitespace-pre-wrap">
                              {suggestion.description ??
                                "No description provided."}
                            </p>
                          </div>
                        </td>
                        <td className="border-b border-white/8 px-4 py-4 text-sm text-white">
                          {formatCoordinates(suggestion)}
                        </td>
                        <td className="border-b border-white/8 px-4 py-4 text-sm text-white">
                          {formatDateTime(suggestion.createdAt)}
                        </td>
                        <td className="border-b border-white/8 px-4 py-4">
                          {suggestion.reviewedAt === null ? (
                            <Badge variant="warning">Pending</Badge>
                          ) : (
                            <div className="space-y-2">
                              <Badge variant="success">Reviewed</Badge>
                              <div className="text-ocean-200/70 text-xs">
                                {formatDateTime(suggestion.reviewedAt)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="border-b border-white/8 px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {suggestion.reviewedAt === null ? (
                              <>
                                <ActionIconButton
                                  label="Create spot"
                                  onClick={() => {
                                    setSelectedSuggestionId(suggestion.id);
                                    setFormsBySuggestionId((current) => ({
                                      ...current,
                                      [suggestion.id]:
                                        current[suggestion.id] ??
                                        getInitialCreateSpotFormState(
                                          suggestion,
                                        ),
                                    }));
                                  }}
                                  disabled={isBusy}
                                  className="text-aqua-200 hover:bg-aqua-500/10 hover:text-white"
                                >
                                  <MapPinned size={16} />
                                </ActionIconButton>
                                <ActionIconButton
                                  label="Mark reviewed"
                                  onClick={() => {
                                    markReviewed.mutate({ id: suggestion.id });
                                  }}
                                  disabled={isBusy}
                                  className="text-emerald-200 hover:bg-emerald-500/10 hover:text-white"
                                >
                                  <Check size={16} />
                                </ActionIconButton>
                              </>
                            ) : null}

                            <ActionIconButton
                              label="Delete suggestion"
                              onClick={() => {
                                removeSuggestion.mutate({ id: suggestion.id });
                              }}
                              disabled={isBusy}
                              className="text-red-200 hover:bg-red-500/10 hover:text-red-100"
                            >
                              <Trash2 size={16} />
                            </ActionIconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSuggestion !== null && selectedFormState !== null ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6">
          <button
            type="button"
            aria-label="Close create spot dialog"
            className="bg-ocean-950/80 absolute inset-0 backdrop-blur-sm"
            onClick={() => {
              if (!createSpot.isPending) {
                setSelectedSuggestionId(null);
              }
            }}
          />

          <div className="glass-card animate-fade-in-up relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 p-6 md:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="text-ocean-100 mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
                  <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
                  Create New Spot
                </div>

                <h2 className="mb-3 text-3xl font-bold text-white">
                  Create from suggestion
                </h2>
                <p className="text-ocean-200/80 max-w-2xl text-base leading-relaxed">
                  Review the suggestion details below, adjust anything you want,
                  and create a live spot. Successful creation marks the
                  suggestion as reviewed automatically.
                </p>
              </div>

              <ActionIconButton
                label="Close modal"
                onClick={() => {
                  if (!createSpot.isPending) {
                    setSelectedSuggestionId(null);
                  }
                }}
                disabled={createSpot.isPending}
                className="text-ocean-200 hover:bg-white/8 hover:text-white"
              >
                <X size={18} />
              </ActionIconButton>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();

                if (
                  selectedFormState.lat === "" ||
                  selectedFormState.long === "" ||
                  selectedFormState.defaultWindDirections.length === 0
                ) {
                  toast.error(
                    "Latitude, longitude, and at least one default wind direction are required.",
                  );
                  return;
                }

                createSpot.mutate({
                  suggestionId: selectedSuggestion.id,
                  name: selectedFormState.name,
                  description: normalizeDescription(
                    selectedFormState.description,
                  ),
                  lat: selectedFormState.lat,
                  long: selectedFormState.long,
                  defaultWindDirections:
                    selectedFormState.defaultWindDirections,
                });
              }}
            >
              <Input
                label="Spot name"
                placeholder="e.g. Tarifa Lagoon"
                value={selectedFormState.name}
                onChange={(event) => {
                  updateFormState(
                    selectedSuggestion.id,
                    setFormsBySuggestionId,
                    {
                      ...selectedFormState,
                      name: event.target.value,
                    },
                  );
                }}
                required
                disabled={createSpot.isPending}
                enterKeyHint="next"
                maxLength={128}
              />

              <Textarea
                label="Description"
                placeholder="Optional details about the location, launch, local conditions, or what makes this spot worth tracking"
                value={selectedFormState.description}
                onChange={(event) => {
                  updateFormState(
                    selectedSuggestion.id,
                    setFormsBySuggestionId,
                    {
                      ...selectedFormState,
                      description: event.target.value,
                    },
                  );
                }}
                disabled={createSpot.isPending}
                maxLength={1000}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  label="Latitude"
                  placeholder="Required"
                  value={selectedFormState.lat}
                  onChange={(event) => {
                    updateFormState(
                      selectedSuggestion.id,
                      setFormsBySuggestionId,
                      {
                        ...selectedFormState,
                        lat: isNaN(event.target.valueAsNumber)
                          ? ""
                          : event.target.valueAsNumber,
                      },
                    );
                  }}
                  min={-90}
                  max={90}
                  step="any"
                  disabled={createSpot.isPending}
                />

                <Input
                  type="number"
                  inputMode="decimal"
                  label="Longitude"
                  placeholder="Required"
                  value={selectedFormState.long}
                  onChange={(event) => {
                    updateFormState(
                      selectedSuggestion.id,
                      setFormsBySuggestionId,
                      {
                        ...selectedFormState,
                        long: isNaN(event.target.valueAsNumber)
                          ? ""
                          : event.target.valueAsNumber,
                      },
                    );
                  }}
                  min={-180}
                  max={180}
                  step="any"
                  disabled={createSpot.isPending}
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-ocean-200 text-sm font-medium">
                    Location preview
                  </p>
                  <p className="text-ocean-200/65 text-sm leading-relaxed">
                    The map updates as you change the coordinates.
                  </p>
                </div>

                {hasCompleteCoordinates(selectedFormState) ? (
                  <SpotMap
                    lat={selectedFormState.lat}
                    long={selectedFormState.long}
                    height="h-[280px]"
                  />
                ) : (
                  <div className="from-aqua-500/8 to-ocean-500/8 flex h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br px-6 text-center">
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-white">
                        No map preview yet
                      </p>
                      <p className="text-ocean-200/70 text-sm leading-relaxed">
                        Add both latitude and longitude to preview the suggested
                        location on the map.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="text-ocean-200 mb-3 block text-sm font-medium">
                  Default wind directions
                </label>
                <p className="text-ocean-200/65 mb-5 text-sm leading-relaxed">
                  Use the same compass picker as subscriptions to define which
                  directions should be preselected for this spot.
                </p>

                <div className="flex justify-center">
                  <CardinalDirection
                    selectedDirections={selectedFormState.defaultWindDirections}
                    toggleDirection={(direction) => {
                      updateFormState(
                        selectedSuggestion.id,
                        setFormsBySuggestionId,
                        {
                          ...selectedFormState,
                          defaultWindDirections: toggleWindDirection(
                            selectedFormState.defaultWindDirections,
                            direction,
                          ),
                        },
                      );
                    }}
                    disabled={createSpot.isPending}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 md:flex-row md:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSelectedSuggestionId(null);
                  }}
                  disabled={createSpot.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={createSpot.isPending}>
                  Create spot
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ActionIconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 transition ${className ?? ""} ${props.disabled ? "cursor-not-allowed opacity-50" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

function getInitialCreateSpotFormState(
  suggestion: SpotSuggestion,
): CreateSpotFormState {
  return {
    name: suggestion.name,
    description: suggestion.description ?? "",
    lat: suggestion.lat ?? "",
    long: suggestion.long ?? "",
    defaultWindDirections: [],
  };
}

function updateFormState(
  suggestionId: number,
  setFormsBySuggestionId: Dispatch<
    SetStateAction<Record<number, CreateSpotFormState>>
  >,
  nextFormState: CreateSpotFormState,
): void {
  setFormsBySuggestionId((current) => ({
    ...current,
    [suggestionId]: nextFormState,
  }));
}

function toggleWindDirection(
  selectedDirections: SpotDirection[],
  direction: SpotDirection,
): SpotDirection[] {
  if (selectedDirections.includes(direction)) {
    return selectedDirections.filter((entry) => entry !== direction);
  }

  return [...selectedDirections, direction];
}

function hasCompleteCoordinates(
  formState: CreateSpotFormState,
): formState is CreateSpotFormState & { lat: number; long: number } {
  return formState.lat !== "" && formState.long !== "";
}

function formatCoordinates(suggestion: SpotSuggestion): string {
  if (suggestion.lat === null || suggestion.long === null) {
    return "No coordinates";
  }

  return `${suggestion.lat.toFixed(5)}, ${suggestion.long.toFixed(5)}`;
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function normalizeDescription(value: string): string | undefined {
  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}
