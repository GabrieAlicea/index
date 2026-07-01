import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link
        href="/"
        className="font-display text-2xl font-semibold text-canopy-700 dark:text-leaf-300"
      >
        Coquis
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          href="/creator"
          className="font-body text-sm font-medium text-canopy-700 hover:underline dark:text-leaf-300"
        >
          Create
        </Link>
        <Link
          href="/gallery"
          className="font-body text-sm font-medium text-canopy-700 hover:underline dark:text-leaf-300"
        >
          Gallery
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
