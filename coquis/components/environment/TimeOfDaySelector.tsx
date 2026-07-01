"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useSettingsStore } from "@/stores/settingsStore";
import type { TimeOfDay } from "@/types/environment";

const TIME_OF_DAY_OPTIONS: { value: TimeOfDay; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "dusk", label: "Dusk" },
  { value: "night", label: "Night" },
];

export function TimeOfDaySelector() {
  const timeOfDay = useSettingsStore((s) => s.timeOfDay);
  const setTimeOfDay = useSettingsStore((s) => s.setTimeOfDay);

  return (
    <SegmentedControl
      label="Time of day"
      options={TIME_OF_DAY_OPTIONS}
      value={timeOfDay}
      onChange={setTimeOfDay}
    />
  );
}
