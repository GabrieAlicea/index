"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

import { requestPasswordReset, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = null;

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state?.success) {
    return (
      <GlassCard className="glass-strong p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-text">Check your email</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="glass-strong p-8">
      <h1 className="text-2xl font-semibold text-text">Reset your password</h1>
      <p className="mt-1 text-sm text-text-muted">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@email.com" required />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-danger">{state.fieldErrors.email}</p>
          )}
        </div>
        <Button type="submit" size="lg" disabled={pending} className="mt-2">
          {pending ? "Sending…" : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </GlassCard>
  );
}
