import { Calendar } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function MechanicCalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Calendar</h1>
        <p className="mt-1 text-sm text-text-muted">Your scheduled jobs at a glance.</p>
      </div>
      <EmptyState
        icon={Calendar}
        title="No scheduled jobs"
        body="Jobs booked for a future date and time will appear on your calendar."
      />
    </div>
  );
}
