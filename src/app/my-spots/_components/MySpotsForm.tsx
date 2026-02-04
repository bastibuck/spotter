"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";

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
    <Card>
      <CardContent className="pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestManagementEmail.mutate({
              email,
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
            }}
            required
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={requestManagementEmail.isPending}
          >
            {requestManagementEmail.isPending ? "Sending..." : "Send My Spots"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MySpotsForm;
