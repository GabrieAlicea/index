"use client";

import * as React from "react";
import { toast } from "sonner";

import { startStripeOnboarding } from "@/app/dashboard/mechanic/payouts/actions";
import { Button } from "@/components/ui/button";

export function ConnectStripeButton({ label = "Connect Stripe" }: { label?: string }) {
  const [pending, startTransition] = React.useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await startStripeOnboarding();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <Button onClick={handleClick} disabled={pending}>
      {pending ? "Redirecting…" : label}
    </Button>
  );
}
