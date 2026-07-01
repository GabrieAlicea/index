"use client";

import { useRef, useState } from "react";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { Button } from "@/components/ui/Button";
import { useCollectionStore } from "@/stores/collectionStore";
import { downloadFrogPng, downloadFrogSvg } from "@/lib/frog/exportFrog";
import type { SavedFrog } from "@/types/frog";

export interface FrogCardProps {
  frog: SavedFrog;
}

export function FrogCard({ frog }: FrogCardProps) {
  const rename = useCollectionStore((s) => s.rename);
  const toggleFavorite = useCollectionStore((s) => s.toggleFavorite);
  const remove = useCollectionStore((s) => s.remove);
  const stageRef = useRef<HTMLDivElement>(null);
  const [nameDraft, setNameDraft] = useState(frog.name);

  const getSvg = () => stageRef.current?.querySelector("svg") ?? null;

  return (
    <div className="rounded-lg bg-cream-50 p-4 shadow-soft dark:bg-charcoal-800">
      <div ref={stageRef} className="mx-auto w-32">
        <FrogRenderer config={frog.config} />
      </div>

      <label className="sr-only" htmlFor={`name-${frog.id}`}>
        Name
      </label>
      <input
        id={`name-${frog.id}`}
        type="text"
        value={nameDraft}
        onChange={(e) => setNameDraft(e.target.value)}
        onBlur={() => nameDraft.trim() && rename(frog.id, nameDraft.trim())}
        maxLength={24}
        className="mt-2 w-full rounded-pill border border-moss-300 bg-cream-50 px-3 py-1 text-center font-display text-canopy-700 focus-visible:focus-ring dark:border-moss-500 dark:bg-charcoal-800 dark:text-leaf-300"
      />

      <p className="mt-1 text-center text-xs font-body text-charcoal-800/60 dark:text-mist-100/60">
        {frog.personality.trait} · {frog.config.rarity !== "common" ? frog.config.rarity : "coquí"}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Button
          variant={frog.favorite ? "primary" : "secondary"}
          size="sm"
          onClick={() => toggleFavorite(frog.id)}
          aria-label={frog.favorite ? `Unfavorite ${frog.name}` : `Favorite ${frog.name}`}
        >
          {frog.favorite ? "★ Favorited" : "☆ Favorite"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const svg = getSvg();
            if (svg) downloadFrogSvg(svg, frog.name.toLowerCase());
          }}
        >
          SVG
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const svg = getSvg();
            if (svg) downloadFrogPng(svg, frog.name.toLowerCase());
          }}
        >
          PNG
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => remove(frog.id)}
          aria-label={`Delete ${frog.name}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
