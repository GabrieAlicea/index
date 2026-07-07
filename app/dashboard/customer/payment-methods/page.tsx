import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Payment Methods</h1>
          <p className="mt-1 text-sm text-text-muted">Manage the cards on your account.</p>
        </div>
        <Button disabled>Add Card</Button>
      </div>
      <EmptyState
        icon={CreditCard}
        title="No payment methods yet"
        body="Add a card to book services faster. Payments are securely processed by Stripe — Revvy never stores your card details."
      />
    </div>
  );
}
