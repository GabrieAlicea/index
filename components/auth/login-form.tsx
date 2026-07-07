"use client";

import { useActionState } from "react";
import Link from "next/link";

import { login, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = null;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <GlassCard className="glass-strong p-8">
      <h1 className="text-2xl font-semibold text-text">Welcome back</h1>
      <p className="mt-1 text-sm text-text-muted">Log in to book a service or manage your jobs.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@email.com" required />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-danger">{state.fieldErrors.email}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
          {state?.fieldErrors?.password && (
            <p className="text-xs text-danger">{state.fieldErrors.password}</p>
          )}
        </div>

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-2">
          {pending ? "Logging in…" : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </GlassCard>
  );
}
