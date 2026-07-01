import { LinkButton } from "@/components/ui/LinkButton";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-cream-50 px-6 py-16 text-center shadow-soft dark:bg-charcoal-800">
      <p className="font-display text-xl text-canopy-700 dark:text-leaf-300">
        Your pond is empty
      </p>
      <p className="max-w-sm font-body text-charcoal-800/75 dark:text-mist-100/75">
        Head to the creator to design and save your first Coquí.
      </p>
      <LinkButton href="/creator">Create a Coquí</LinkButton>
    </div>
  );
}
