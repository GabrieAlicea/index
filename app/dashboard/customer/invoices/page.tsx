import { Receipt } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Invoices</h1>
        <p className="mt-1 text-sm text-text-muted">Digital receipts for every completed job.</p>
      </div>
      <EmptyState
        icon={Receipt}
        title="No invoices yet"
        body="Invoices appear here automatically once a service is completed and paid."
      />
    </div>
  );
}
