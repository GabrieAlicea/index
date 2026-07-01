"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useBuilderStore } from "@/stores/builderStore";
import { useCollectionStore } from "@/stores/collectionStore";

export function SaveToCollectionButton() {
  const config = useBuilderStore((s) => s.config);
  const name = useBuilderStore((s) => s.name);
  const personality = useBuilderStore((s) => s.personality);
  const add = useCollectionStore((s) => s.add);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    add({ name, config, personality });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <Button onClick={handleSave} aria-live="polite">
      {justSaved ? "Saved to your pond!" : "Save to collection"}
    </Button>
  );
}
