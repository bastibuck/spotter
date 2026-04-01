"use client";

import { Check, MapPinned, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import ActionIconButton from "~/app/admin/_components/ActionIconButton";
import SpotEditorModal, {
  type SpotEditorFormValues,
} from "~/app/admin/_components/SpotEditorModal";
import { Badge } from "~/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { api, type RouterOutputs } from "~/trpc/react";

type SpotSuggestion = RouterOutputs["spotSuggestion"]["list"][number];

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

  const createSpotFromSuggestion =
    api.spotSuggestion.createSpotFromSuggestion.useMutation({
      onSuccess: async () => {
        toast.success("Spot created and suggestion reviewed.");
        setSelectedSuggestionId(null);
        await utils.spotSuggestion.list.invalidate();
        await utils.adminSpot.list.invalidate();
      },
      onError: (error) => {
        toast.error(
          error.message || "Could not create a spot from this suggestion.",
        );
      },
    });

  const suggestions = suggestionsQuery.data ?? [];
  const selectedSuggestion =
    selectedSuggestionId === null
      ? null
      : (suggestions.find(
          (suggestion) => suggestion.id === selectedSuggestionId,
        ) ?? null);

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
                      createSpotFromSuggestion.isPending;

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

      <SpotEditorModal
        isOpen={selectedSuggestion !== null}
        resetKey={
          selectedSuggestion === null
            ? "spot-suggestion-closed"
            : `spot-suggestion-${selectedSuggestion.id}`
        }
        title="Create from suggestion"
        description="Review the suggestion details below, adjust anything you want, and create a live spot. Successful creation marks the suggestion as reviewed automatically."
        submitLabel="Create spot"
        initialValues={getInitialSpotEditorValues(selectedSuggestion)}
        isSubmitting={createSpotFromSuggestion.isPending}
        onClose={() => {
          setSelectedSuggestionId(null);
        }}
        onSubmit={(spot) => {
          if (selectedSuggestion === null) {
            return;
          }

          createSpotFromSuggestion.mutate({
            suggestionId: selectedSuggestion.id,
            spot,
          });
        }}
      />
    </>
  );
}

function getInitialSpotEditorValues(
  suggestion: SpotSuggestion | null,
): SpotEditorFormValues {
  if (suggestion === null) {
    return {
      name: "",
      description: "",
      lat: "",
      long: "",
      defaultWindDirections: [],
    };
  }

  return {
    name: suggestion.name,
    description: suggestion.description ?? "",
    lat: suggestion.lat ?? "",
    long: suggestion.long ?? "",
    defaultWindDirections: [],
  };
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
