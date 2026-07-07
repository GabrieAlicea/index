"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { signUp, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState: AuthFormState = null;

export function SignUpForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "mechanic" ? "mechanic" : "customer";
  const [role, setRole] = useState(defaultRole);
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <GlassCard className="glass-strong p-8">
      <h1 className="text-2xl font-semibold text-text">Create your account</h1>
      <p className="mt-1 text-sm text-text-muted">
        Book a service, or apply as a mechanic and start earning.
      </p>

      <Tabs value={role} onValueChange={setRole} className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="customer" className="flex-1">
            I need a mechanic
          </TabsTrigger>
          <TabsTrigger value="mechanic" className="flex-1">
            I am a mechanic
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="role" value={role} />

        <div className="grid gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" placeholder="Jane Doe" required />
          {state?.fieldErrors?.fullName && (
            <p className="text-xs text-danger">{state.fieldErrors.fullName}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@email.com" required />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-danger">{state.fieldErrors.email}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="At least 8 characters" required />
          {state?.fieldErrors?.password && (
            <p className="text-xs text-danger">{state.fieldErrors.password}</p>
          )}
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-2">
          {pending
            ? "Creating account…"
            : role === "mechanic"
              ? "Apply as a Mechanic"
              : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-text-faint">
        By continuing, you agree to Revvy&apos;s{" "}
        <Link href="/legal/terms" className="text-text-muted hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="text-text-muted hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-4 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </GlassCard>
  );
}
