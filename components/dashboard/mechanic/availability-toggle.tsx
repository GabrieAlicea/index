"use client";

import * as React from "react";
import { toast } from "sonner";

import { setAvailability } from "@/app/dashboard/mechanic/actions";
import { Switch } from "@/components/ui/switch";

export function AvailabilityToggle({ initialOnline }: { initialOnline: boolean }) {
  const [online, setOnline] = React.useState(initialOnline);
  const [pending, startTransition] = React.useTransition();

  function handleChange(checked: boolean) {
    setOnline(checked);
    startTransition(async () => {
      const result = await setAvailability(checked);
      if (result?.error) {
        setOnline(!checked);
        toast.error(result.error);
      } else {
        toast.success(checked ? "You're online — receiving nearby jobs." : "You're offline.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-surface px-4 py-2.5">
      <span className={`size-2 rounded-full ${online ? "bg-success animate-pulse-ring" : "bg-text-faint"}`} />
      <span className="text-sm font-medium text-text">{online ? "Online" : "Offline"}</span>
      <Switch checked={online} onCheckedChange={handleChange} disabled={pending} />
    </div>
  );
}
