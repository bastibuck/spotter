"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SpotEditorModal, {
  type SpotEditorFormValues,
} from "~/app/admin/_components/SpotEditorModal";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { api, type RouterOutputs } from "~/trpc/react";

type AdminSpot = RouterOutputs["adminSpot"]["list"][number];

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; spot: AdminSpot };

export default function AdminSpotTable() {
  const utils = api.useUtils();
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });
  const [spotPendingDelete, setSpotPendingDelete] = useState<AdminSpot | null>(
    null,
  );

  const spotsQuery = api.adminSpot.list.useQuery();

  const createSpot = api.adminSpot.create.useMutation({
    onSuccess: async () => {
      toast.success("Spot created.");
      setModalState({ type: "closed" });
      await utils.adminSpot.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Could not create spot.");
    },
  });

  const updateSpot = api.adminSpot.update.useMutation({
    onSuccess: async () => {
      toast.success("Spot updated.");
      setModalState({ type: "closed" });
      await utils.adminSpot.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Could not update spot.");
    },
  });

  const removeSpot = api.adminSpot.remove.useMutation({
    onSuccess: async (result) => {
      toast.success(
        result.deletedSubscriptionCount > 0
          ? `Spot deleted. ${result.deletedSubscriptionCount} subscription(s) were removed as well.`
          : "Spot deleted.",
      );
      setSpotPendingDelete(null);
      await utils.adminSpot.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Could not delete spot.");
    },
  });

  const spots = spotsQuery.data ?? [];
  const isEditModalOpen = modalState.type === "edit";
  const isCreateModalOpen = modalState.type === "create";

  return (
    <>
      <Card className="animate-fade-in-up">
        <CardHeader className="gap-5 md:flex md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-3xl">Spot Catalog</CardTitle>
            <CardDescription className="text-base">
              Create new spots directly, update existing ones, and remove stale
              entries with a clear view of subscriber impact.
            </CardDescription>
          </div>

          <Button
            onClick={() => {
              setModalState({ type: "create" });
            }}
          >
            <Plus size={16} />
            New spot
          </Button>
        </CardHeader>

        <CardContent>
          {spotsQuery.isLoading ? (
            <p className="text-ocean-200/80">Loading spots...</p>
          ) : spots.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 px-6 py-12 text-center">
              <p className="text-lg font-medium text-white">No spots yet.</p>
              <p className="text-ocean-200/70 mt-2 text-sm">
                Create the first spot directly from this admin page.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-ocean-200/70 text-left text-xs tracking-[0.24em] uppercase">
                    <th className="border-b border-white/10 px-4 py-3">Spot</th>
                    <th className="border-b border-white/10 px-4 py-3">
                      Coordinates
                    </th>
                    <th className="border-b border-white/10 px-4 py-3">
                      Directions
                    </th>
                    <th className="border-b border-white/10 px-4 py-3">
                      Subscribers
                    </th>
                    <th className="border-b border-white/10 px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spots.map((spot) => {
                    const isBusy =
                      createSpot.isPending ||
                      updateSpot.isPending ||
                      removeSpot.isPending;

                    return (
                      <tr key={spot.id} className="align-top">
                        <td className="border-b border-white/8 px-4 py-4">
                          <div className="space-y-2">
                            <div className="font-semibold text-white">
                              {spot.name}
                            </div>
                            <p className="text-ocean-200/75 max-w-md text-sm leading-relaxed whitespace-pre-wrap">
                              {spot.description ?? "No description provided."}
                            </p>
                          </div>
                        </td>
                        <td className="border-b border-white/8 px-4 py-4 text-sm text-white">
                          {spot.lat.toFixed(5)}, {spot.long.toFixed(5)}
                        </td>
                        <td className="border-b border-white/8 px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {spot.defaultWindDirections.map((direction) => (
                              <Badge
                                key={`${spot.id}-${direction}`}
                                variant="info"
                              >
                                {direction}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="border-b border-white/8 px-4 py-4">
                          <Badge
                            variant={
                              spot.subscriberCount > 0 ? "success" : "default"
                            }
                          >
                            {spot.subscriberCount} subscriber
                            {spot.subscriberCount === 1 ? "" : "s"}
                          </Badge>
                        </td>
                        <td className="border-b border-white/8 px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <ActionIconButton
                              label="Edit spot"
                              onClick={() => {
                                setModalState({ type: "edit", spot });
                              }}
                              disabled={isBusy}
                              className="text-aqua-200 hover:bg-aqua-500/10 hover:text-white"
                            >
                              <Pencil size={16} />
                            </ActionIconButton>
                            <ActionIconButton
                              label="Delete spot"
                              onClick={() => {
                                setSpotPendingDelete(spot);
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
        isOpen={isCreateModalOpen}
        resetKey="admin-spot-create"
        title="Create a new spot"
        description="Add a new live spot directly to the catalog. You can fine-tune the location, description, and default wind directions before saving."
        submitLabel="Create spot"
        initialValues={emptySpotEditorValues}
        isSubmitting={createSpot.isPending}
        onClose={() => {
          setModalState({ type: "closed" });
        }}
        onSubmit={(spot) => {
          createSpot.mutate(spot);
        }}
      />

      <SpotEditorModal
        isOpen={isEditModalOpen}
        resetKey={
          isEditModalOpen
            ? `admin-spot-edit-${modalState.spot.id}`
            : "admin-spot-edit-closed"
        }
        title="Edit spot"
        description="Update the spot details and verify the map preview before saving your changes."
        submitLabel="Save changes"
        initialValues={
          isEditModalOpen
            ? getInitialSpotEditorValues(modalState.spot)
            : emptySpotEditorValues
        }
        isSubmitting={updateSpot.isPending}
        onClose={() => {
          setModalState({ type: "closed" });
        }}
        onSubmit={(spot) => {
          if (!isEditModalOpen) {
            return;
          }

          updateSpot.mutate({
            id: modalState.spot.id,
            spot,
          });
        }}
      />

      {spotPendingDelete === null ? null : (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6">
          <button
            type="button"
            aria-label="Close delete confirmation"
            className="bg-ocean-950/80 absolute inset-0 backdrop-blur-sm"
            onClick={() => {
              if (!removeSpot.isPending) {
                setSpotPendingDelete(null);
              }
            }}
          />

          <div className="glass-card animate-fade-in-up relative z-10 w-full max-w-lg rounded-[2rem] border border-white/10 p-6 md:p-8">
            <div className="space-y-4">
              <div className="text-ocean-100 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-red-300 shadow-[0_0_14px_rgba(252,165,165,0.9)]" />
                Delete Spot
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Delete {spotPendingDelete.name}?
                </h2>
                <p className="text-ocean-200/80 mt-3 text-sm leading-relaxed">
                  This permanently removes the spot.
                </p>
                <p className="text-ocean-200/80 mt-3 text-sm leading-relaxed">
                  It will also remove {spotPendingDelete.subscriberCount}{" "}
                  related subscription
                  {spotPendingDelete.subscriberCount === 1 ? "" : "s"}.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 md:flex-row md:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSpotPendingDelete(null);
                  }}
                  disabled={removeSpot.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  isLoading={removeSpot.isPending}
                  onClick={() => {
                    removeSpot.mutate({ id: spotPendingDelete.id });
                  }}
                  className="bg-red-500 text-white hover:bg-red-400"
                >
                  Delete spot
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActionIconButton({
  label,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
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

const emptySpotEditorValues: SpotEditorFormValues = {
  name: "",
  description: "",
  lat: "",
  long: "",
  defaultWindDirections: [],
};

function getInitialSpotEditorValues(spot: AdminSpot): SpotEditorFormValues {
  return {
    name: spot.name,
    description: spot.description ?? "",
    lat: spot.lat,
    long: spot.long,
    defaultWindDirections: spot.defaultWindDirections,
  };
}
