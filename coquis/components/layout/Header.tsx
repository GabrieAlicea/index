import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <span className="font-display text-2xl font-semibold text-canopy-700 dark:text-leaf-300">
        Coquis
      </span>
      <ThemeToggle />
    </header>
  );
}
