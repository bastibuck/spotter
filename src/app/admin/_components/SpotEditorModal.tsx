"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import CardinalDirection from "~/components/spots/Cardinals";
import { SpotMap, SpotMapLocationPicker } from "~/components/spots/SpotMapWrapper";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import type { WindDirection } from "~/server/db/schema";

type SpotDirection = z.infer<typeof WindDirection>;

export interface SpotEditorFormValues {
  name: string;
  description: string;
  lat: number | "";
  long: number | "";
  defaultWindDirections: SpotDirection[];
}

interface SpotEditorModalProps {
  isOpen: boolean;
  resetKey: string;
  title: string;
  description: string;
  submitLabel: string;
  initialValues: SpotEditorFormValues;
  isSubmitting: boolean;
  allowMapPicking?: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    description?: string;
    lat: number;
    long: number;
    defaultWindDirections: SpotDirection[];
  }) => void;
}

export default function SpotEditorModal({
  isOpen,
  resetKey,
  title,
  description,
  submitLabel,
  initialValues,
  isSubmitting,
  allowMapPicking,
  onClose,
  onSubmit,
}: SpotEditorModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <SpotEditorModalContent
      key={resetKey}
      {...{
        title,
        description,
        submitLabel,
        initialValues,
        isSubmitting,
        allowMapPicking,
        onClose,
        onSubmit,
      }}
    />
  );
}

function SpotEditorModalContent({
  title,
  description,
  submitLabel,
  initialValues,
  isSubmitting,
  allowMapPicking = false,
  onClose,
  onSubmit,
}: Omit<SpotEditorModalProps, "isOpen" | "resetKey">) {
  const [formValues, setFormValues] = useState(initialValues);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label="Close spot editor dialog"
        className="bg-ocean-950/80 absolute inset-0 backdrop-blur-sm"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />

      <div className="glass-card animate-fade-in-up relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 p-6 md:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-ocean-100 mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
              <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              Spot Editor
            </div>

            <h2 className="mb-3 text-3xl font-bold text-white">{title}</h2>
            <p className="text-ocean-200/80 max-w-2xl text-base leading-relaxed">
              {description}
            </p>
          </div>

          <IconButton
            label="Close modal"
            onClick={() => {
              if (!isSubmitting) {
                onClose();
              }
            }}
            disabled={isSubmitting}
            className="text-ocean-200 hover:bg-white/8 hover:text-white"
          >
            <X size={18} />
          </IconButton>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();

            if (
              formValues.lat === "" ||
              formValues.long === "" ||
              formValues.defaultWindDirections.length === 0
            ) {
              toast.error(
                "Latitude, longitude, and at least one default wind direction are required.",
              );
              return;
            }

            onSubmit({
              name: formValues.name,
              description: normalizeDescription(formValues.description),
              lat: formValues.lat,
              long: formValues.long,
              defaultWindDirections: formValues.defaultWindDirections,
            });
          }}
        >
          <Input
            label="Spot name"
            placeholder="e.g. Tarifa Lagoon"
            value={formValues.name}
            onChange={(event) => {
              setFormValues((current) => ({
                ...current,
                name: event.target.value,
              }));
            }}
            required
            disabled={isSubmitting}
            enterKeyHint="next"
            maxLength={128}
          />

          <Textarea
            label="Description"
            placeholder="Optional details about the location, launch, local conditions, or what makes this spot worth tracking"
            value={formValues.description}
            onChange={(event) => {
              setFormValues((current) => ({
                ...current,
                description: event.target.value,
              }));
            }}
            disabled={isSubmitting}
            maxLength={1000}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="number"
              inputMode="decimal"
              label="Latitude"
              placeholder="Required"
              value={formValues.lat}
              onChange={(event) => {
                setFormValues((current) => ({
                  ...current,
                  lat: isNaN(event.target.valueAsNumber)
                    ? ""
                    : event.target.valueAsNumber,
                }));
              }}
              min={-90}
              max={90}
              step="any"
              disabled={isSubmitting}
            />

            <Input
              type="number"
              inputMode="decimal"
              label="Longitude"
              placeholder="Required"
              value={formValues.long}
              onChange={(event) => {
                setFormValues((current) => ({
                  ...current,
                  long: isNaN(event.target.valueAsNumber)
                    ? ""
                    : event.target.valueAsNumber,
                }));
              }}
              min={-180}
              max={180}
              step="any"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-ocean-200 text-sm font-medium">
                {allowMapPicking ? "Location" : "Location preview"}
              </p>
              <p className="text-ocean-200/65 text-sm leading-relaxed">
                {allowMapPicking
                  ? "Click on the map to pin the spot, or enter coordinates manually below."
                  : "The map updates as you change the coordinates."}
              </p>
            </div>

            {hasCompleteCoordinates(formValues) ? (
              allowMapPicking ? (
                <SpotMapLocationPicker
                  lat={formValues.lat}
                  long={formValues.long}
                  onChange={(position) => {
                    setFormValues((current) => ({
                      ...current,
                      lat: roundCoordinate(position.lat),
                      long: roundCoordinate(position.long),
                    }));
                  }}
                  disabled={isSubmitting}
                  height="h-[280px]"
                />
              ) : (
                <SpotMap
                  lat={formValues.lat}
                  long={formValues.long}
                  height="h-[280px]"
                />
              )
            ) : allowMapPicking ? (
              <SpotMapLocationPicker
                lat={null}
                long={null}
                onChange={(position) => {
                  setFormValues((current) => ({
                    ...current,
                    lat: roundCoordinate(position.lat),
                    long: roundCoordinate(position.long),
                  }));
                }}
                disabled={isSubmitting}
                height="h-[280px]"
              />
            ) : (
              <div className="from-aqua-500/8 to-ocean-500/8 flex h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br px-6 text-center">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-white">
                    No map preview yet
                  </p>
                  <p className="text-ocean-200/70 text-sm leading-relaxed">
                    Add both latitude and longitude to preview the spot on the
                    map.
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
                selectedDirections={formValues.defaultWindDirections}
                toggleDirection={(direction) => {
                  setFormValues((current) => ({
                    ...current,
                    defaultWindDirections: toggleWindDirection(
                      current.defaultWindDirections,
                      direction,
                    ),
                  }));
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row md:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IconButton({
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
  values: SpotEditorFormValues,
): values is SpotEditorFormValues & { lat: number; long: number } {
  return values.lat !== "" && values.long !== "";
}

function normalizeDescription(value: string): string | undefined {
  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}

function roundCoordinate(value: number): number {
  return parseFloat(value.toFixed(6));
}
