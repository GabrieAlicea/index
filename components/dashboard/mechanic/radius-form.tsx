"use client";

import { useActionState } from "react";

import { updateServiceRadius, type AvailabilityFormState } from "@/app/dashboard/mechanic/availability/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RadiusForm({ initialRadius }: { initialRadius: number }) {
  const [state, formAction, pending] = useActionState<AvailabilityFormState, FormData>(
    updateServiceRadius,
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="serviceRadiusMiles">Service radius (miles)</Label>
        <Input
          id="serviceRadiusMiles"
          name="serviceRadiusMiles"
          type="number"
          min={1}
          max={100}
          defaultValue={initialRadius}
          className="w-32"
        />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
      {state?.success && <p className="text-sm text-success">Saved.</p>}
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
    </form>
  );
}
