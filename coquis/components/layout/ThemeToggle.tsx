"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { Toggle } from "@/components/ui/Toggle";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="flex items-center gap-2 text-sm font-body text-charcoal-800 dark:text-mist-100">
      <span>{theme === "dark" ? "Night pond" : "Day pond"}</span>
      <Toggle
        label="Toggle dark mode"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
    </label>
  );
}
