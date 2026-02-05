"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { sendMySpotsEmail } from "../actions";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";

const MySpotsForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState(sendMySpotsEmail, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            defaultValue={state?.success === false ? state.email : ""}
            required
            disabled={isPending}
          />

          <Button type="submit" className="w-full" isLoading={isPending}>
            {isPending ? "Sending..." : "Send My Spots"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MySpotsForm;
