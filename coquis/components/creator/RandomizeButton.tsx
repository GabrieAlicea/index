"use client";

import { Button } from "@/components/ui/Button";
import { useBuilderStore } from "@/stores/builderStore";

export function RandomizeButton() {
  const randomize = useBuilderStore((s) => s.randomize);

  return (
    <Button variant="secondary" onClick={randomize}>
      Randomize
    </Button>
  );
}
