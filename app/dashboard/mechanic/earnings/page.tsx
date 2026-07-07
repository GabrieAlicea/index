import { DollarSign, TrendingUp, Wallet } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";

export default function EarningsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Earnings</h1>
        <p className="mt-1 text-sm text-text-muted">Your revenue after Revvy&apos;s 10% fee.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={DollarSign} label="This week" value="$0.00" />
        <StatCard icon={Wallet} label="This month" value="$0.00" />
        <StatCard icon={TrendingUp} label="All time" value="$0.00" />
      </div>
      <EmptyState
        icon={Wallet}
        title="No earnings yet"
        body="Complete your first job to start building your earnings history."
      />
    </div>
  );
}
