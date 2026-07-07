import { Shield } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function DisputesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Disputes</h1>
        <p className="mt-1 text-sm text-text-muted">Customer and mechanic disputes requiring resolution.</p>
      </div>
      <EmptyState icon={Shield} title="No open disputes" body="Disputes raised on a job will appear here for review." />
    </div>
  );
}
