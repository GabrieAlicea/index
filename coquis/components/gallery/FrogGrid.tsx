"use client";

import { useCollectionStore } from "@/stores/collectionStore";
import { FrogCard } from "@/components/gallery/FrogCard";
import { EmptyState } from "@/components/gallery/EmptyState";

export function FrogGrid() {
  const frogs = useCollectionStore((s) => s.frogs);

  if (frogs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {frogs.map((frog) => (
        <FrogCard key={frog.id} frog={frog} />
      ))}
    </div>
  );
}
