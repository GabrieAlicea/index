"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function WaitlistForm({
  children,
  successMessage = "Thanks — we'll be in touch soon.",
}: {
  children: React.ReactNode;
  successMessage?: string;
}) {
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Waitlist capture is a fast-follow (see roadmap); this confirms intent for now.
    setTimeout(() => {
      setSubmitting(false);
      toast.success(successMessage);
      e.currentTarget.reset();
    }, 500);
  }

  return (
    <form className="mt-6 flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
      {children}
      <Button type="submit" className="mt-2" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
