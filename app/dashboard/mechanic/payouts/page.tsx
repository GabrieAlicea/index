import { CheckCircle2, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConnectStripeButton } from "@/components/dashboard/mechanic/connect-stripe-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function PayoutsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: mechanicProfile } = await supabase
    .from("mechanic_profiles")
    .select("stripe_connect_account_id, stripe_payouts_enabled")
    .eq("profile_id", user!.id)
    .single();

  const { data: payouts } = await supabase
    .from("payouts")
    .select("id, amount, status, created_at")
    .eq("mechanic_id", user!.id)
    .order("created_at", { ascending: false });

  const connected = Boolean(mechanicProfile?.stripe_connect_account_id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Payouts</h1>
          <p className="mt-1 text-sm text-text-muted">Deposits to your connected bank account.</p>
        </div>
        {connected ? (
          <Badge variant={mechanicProfile?.stripe_payouts_enabled ? "success" : "warning"}>
            {mechanicProfile?.stripe_payouts_enabled ? (
              <>
                <CheckCircle2 className="size-3.5" /> Payouts enabled
              </>
            ) : (
              "Finish onboarding"
            )}
          </Badge>
        ) : (
          <ConnectStripeButton />
        )}
      </div>

      {connected && !mechanicProfile?.stripe_payouts_enabled && (
        <Card className="p-5">
          <p className="text-sm text-text-muted">
            You&apos;ve started connecting your payout account, but Stripe needs a bit more
            information before payouts can go out.
          </p>
          <div className="mt-3">
            <ConnectStripeButton label="Finish Onboarding" />
          </div>
        </Card>
      )}

      {payouts && payouts.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {payouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-text">{formatCurrency(p.amount * 100)}</p>
                <p className="text-xs text-text-faint">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant={p.status === "paid" ? "success" : "default"} className="capitalize">
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title={connected ? "No payouts yet" : "Connect your payout account"}
          body={
            connected
              ? "Payouts appear here automatically after each completed job."
              : "Link a bank account through Stripe to receive automatic payouts after each completed job."
          }
        />
      )}
    </div>
  );
}
