"use client";

import * as React from "react";
import { toast } from "sonner";

import { toggleServiceCategory } from "@/app/dashboard/mechanic/availability/actions";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function ServiceCategoryToggle({
  categoryId,
  name,
  description,
  initialEnabled,
}: {
  categoryId: string;
  name: string;
  description: string | null;
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = React.useState(initialEnabled);
  const [pending, startTransition] = React.useTransition();

  function handleChange(checked: boolean) {
    setEnabled(checked);
    startTransition(async () => {
      const result = await toggleServiceCategory(categoryId, checked);
      if (result?.error) {
        setEnabled(!checked);
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-medium text-text">{name}</p>
        {description && <p className="text-xs text-text-faint">{description}</p>}
      </div>
      <Switch checked={enabled} onCheckedChange={handleChange} disabled={pending} />
    </Card>
  );
}
