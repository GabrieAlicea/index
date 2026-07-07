import { BarChart3, DollarSign, Percent, Receipt } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function RevenuePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Revenue</h1>
        <p className="mt-1 text-sm text-text-muted">Gross marketplace volume and platform take rate.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="GMV (30 days)" value="$0.00" />
        <StatCard icon={Percent} label="Platform revenue" value="$0.00" />
        <StatCard icon={Receipt} label="Completed jobs" value="0" />
        <StatCard icon={BarChart3} label="Avg. job value" value="$0.00" />
      </div>
      <EmptyState
        icon={BarChart3}
        title="No revenue data yet"
        body="Revenue charts populate once jobs start completing on the platform."
      />
    </div>
  );
}
