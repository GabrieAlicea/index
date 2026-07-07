"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFormState = { error?: string; success?: boolean } | null;

export function ProfileForm({
  action,
  defaultFullName,
  defaultPhone,
  email,
}: {
  action: (state: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
  defaultFullName: string;
  defaultPhone: string | null;
  email: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    action,
    null
  );

  return (
    <Card className="max-w-lg p-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" defaultValue={defaultFullName} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={defaultPhone ?? ""} placeholder="(555) 555-0100" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={email} disabled />
          <p className="text-xs text-text-faint">Contact support to change your email.</p>
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
        )}
        {state?.success && <p className="text-sm text-success">Profile updated.</p>}

        <Button type="submit" disabled={pending} className="mt-2 self-start">
          {pending ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}
