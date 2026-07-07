import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { GlassCard } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Check Your Email",
  alternates: { canonical: "/verify" },
};

export default function VerifyPage() {
  return (
    <GlassCard className="glass-strong p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MailCheck className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-text">Check your email</h1>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        We&apos;ve sent a confirmation link to your inbox. Click it to activate your account
        and get started.
      </p>
    </GlassCard>
  );
}
