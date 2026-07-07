import { Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { createClient } from "@/lib/supabase/server";

export default async function CouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("id, code, discount_type, discount_value, active, used_count")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Coupons</h1>
          <p className="mt-1 text-sm text-text-muted">Promotional codes for customer acquisition.</p>
        </div>
        <Button disabled>Create Coupon</Button>
      </div>

      {coupons && coupons.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {coupons.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-mono font-medium text-text">{c.code}</p>
                <p className="text-xs text-text-faint">
                  {c.discount_type === "percent" ? `${c.discount_value}% off` : `$${c.discount_value} off`} ·{" "}
                  {c.used_count} used
                </p>
              </div>
              <Badge variant={c.active ? "success" : "default"}>{c.active ? "Active" : "Inactive"}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Percent} title="No coupons yet" body="Create a coupon to run a promotion or referral program." />
      )}
    </div>
  );
}
