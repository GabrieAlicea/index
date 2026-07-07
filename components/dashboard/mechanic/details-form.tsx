"use client";

import { useActionState } from "react";

import { updateMechanicDetails, type MechanicFormState } from "@/app/dashboard/mechanic/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MechanicDetailsForm({
  defaultBio,
  defaultYears,
  defaultVan,
}: {
  defaultBio: string | null;
  defaultYears: number | null;
  defaultVan: string | null;
}) {
  const [state, formAction, pending] = useActionState<MechanicFormState, FormData>(
    updateMechanicDetails,
    null
  );

  return (
    <Card className="max-w-lg p-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={defaultBio ?? ""}
            placeholder="ASE Master Technician with 10+ years specializing in..."
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="yearsExperience">Years of experience</Label>
            <Input
              id="yearsExperience"
              name="yearsExperience"
              type="number"
              min={0}
              defaultValue={defaultYears ?? undefined}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="vanDescription">Service vehicle</Label>
            <Input id="vanDescription" name="vanDescription" defaultValue={defaultVan ?? ""} placeholder="2022 Ford Transit" />
          </div>
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        {state?.success && <p className="text-sm text-success">Saved.</p>}

        <Button type="submit" disabled={pending} className="mt-2 self-start">
          {pending ? "Saving…" : "Save Details"}
        </Button>
      </form>
    </Card>
  );
}
