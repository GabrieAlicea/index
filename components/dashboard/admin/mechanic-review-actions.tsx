"use client";

import * as React from "react";
import { toast } from "sonner";

import { reviewMechanic } from "@/app/dashboard/admin/mechanics/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MechanicReviewActions({ mechanicId }: { mechanicId: string }) {
  const [reason, setReason] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  function handleDecision(decision: "approved" | "rejected" | "needs_more_info") {
    startTransition(async () => {
      const result = await reviewMechanic(mechanicId, decision, reason || undefined);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Application marked as ${decision.replace("_", " ")}.`);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        placeholder="Optional note (visible in the audit log, e.g. reason for rejection)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
      />
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} onClick={() => handleDecision("approved")}>
          Approve
        </Button>
        <Button disabled={pending} variant="secondary" onClick={() => handleDecision("needs_more_info")}>
          Request More Info
        </Button>
        <Button disabled={pending} variant="danger" onClick={() => handleDecision("rejected")}>
          Reject
        </Button>
      </div>
    </div>
  );
}
