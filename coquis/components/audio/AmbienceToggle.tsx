"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { Toggle } from "@/components/ui/Toggle";

export function AmbienceToggle() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  return (
    <label className="flex items-center gap-2 text-sm font-body text-charcoal-800 dark:text-mist-100">
      <span>{soundEnabled ? "Rain ambience on" : "Rain ambience off"}</span>
      <Toggle
        label="Toggle rain ambience"
        checked={soundEnabled}
        onCheckedChange={toggleSound}
      />
    </label>
  );
}
