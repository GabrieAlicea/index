import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function PayoutsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Payouts</h1>
          <p className="mt-1 text-sm text-text-muted">Deposits to your connected bank account.</p>
        </div>
        <Button disabled>Connect Stripe</Button>
      </div>
      <EmptyState
        icon={CreditCard}
        title="Connect your payout account"
        body="Link a bank account through Stripe to receive automatic payouts after each completed job."
      />
    </div>
  );
}
