"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { acceptJob } from "@/app/dashboard/mechanic/jobs/actions";
import { Button } from "@/components/ui/button";

export function AcceptJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await acceptJob(jobId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Job accepted — head to the job for details.");
        router.push(`/dashboard/mechanic/jobs/${jobId}`);
      }
    });
  }

  return (
    <Button size="sm" onClick={handleClick} disabled={pending}>
      {pending ? "Accepting…" : "Accept"}
    </Button>
  );
}
