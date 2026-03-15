"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { api } from "~/trpc/react";

interface OptionalPreferencesFormProps {
  subscriptionId: string;
}

const OptionalPreferencesForm = ({
  subscriptionId,
}: OptionalPreferencesFormProps) => {
  const [minTemperature, setMinTemperature] = useState<number | "">("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const updateOptionalFields =
    api.subscription.updateOptionalFields.useMutation({
      onSuccess: () => {
        setHasSubmitted(true);
        toast.success("Optional preferences saved.");
      },
      onError: () => {
        toast.error("Could not save your optional preferences.");
      },
    });

  if (hasSubmitted) {
    return (
      <div className="space-y-2 text-left">
        <h2 className="text-lg font-semibold text-white">
          Optional Filters Saved
        </h2>
        <p className="text-ocean-200/70 text-sm">
          Your optional preferences have been saved for this subscription.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        updateOptionalFields.mutate({
          subscriptionId,
          minTemperature: minTemperature === "" ? null : minTemperature,
        });
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">
          Add Optional Filters
        </h2>
        <p className="text-ocean-200/70 text-sm">
          You can leave this empty and start receiving alerts right away, or add
          a minimum temperature now.
        </p>
      </div>

      <Input
        type="number"
        inputMode="numeric"
        label="Minimum temperature"
        placeholder="Optional"
        value={minTemperature}
        onChange={(event) => {
          setMinTemperature(
            isNaN(event.target.valueAsNumber) ? "" : event.target.valueAsNumber,
          );
        }}
        min={-20}
        max={50}
        suffix="°C"
        disabled={updateOptionalFields.isPending}
        enterKeyHint="done"
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={updateOptionalFields.isPending}
      >
        Save Optional Preferences
      </Button>
    </form>
  );
};

export default OptionalPreferencesForm;
