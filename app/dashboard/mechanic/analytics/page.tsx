import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function MechanicAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Analytics</h1>
        <p className="mt-1 text-sm text-text-muted">Trends in your jobs, ratings, and earnings.</p>
      </div>
      <EmptyState
        icon={BarChart3}
        title="Not enough data yet"
        body="Charts will appear here once you've completed a few jobs."
      />
    </div>
  );
}
