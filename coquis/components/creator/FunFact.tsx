"use client";

import { useEffect, useState } from "react";
import { FACTS } from "@/data/facts";
import { Button } from "@/components/ui/Button";

function pickFact() {
  return FACTS[Math.floor(Math.random() * FACTS.length)] ?? FACTS[0]!;
}

export function FunFact() {
  // Deterministic on first render (server and client must match); a
  // client-only effect swaps in a real random pick right after hydration.
  const [fact, setFact] = useState(FACTS[0]!);

  useEffect(() => {
    // One-time randomization that can't happen during the deterministic
    // server-rendered pass (Math.random() would mismatch SSR vs. client).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFact(pickFact());
  }, []);

  return (
    <div className="rounded-lg bg-leaf-100 p-4 dark:bg-canopy-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-body font-semibold uppercase tracking-wide text-canopy-700 dark:text-leaf-300">
            Did you know? · {fact.category}
          </p>
          <p className="mt-1 text-sm font-body text-charcoal-800/85 dark:text-mist-100/85">
            {fact.text}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFact(pickFact())}
          aria-label="Show another fact"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
