"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { completeJob } from "@/app/dashboard/mechanic/jobs/actions";
import { Button } from "@/components/ui/button";

export function CompleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await completeJob(jobId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Job marked complete — payment captured.");
        router.refresh();
      }
    });
  }

  return (
    <Button className="w-full" onClick={handleClick} disabled={pending}>
      <CheckCircle2 className="size-4" />
      {pending ? "Completing…" : "Mark Job Complete"}
    </Button>
  );
}
