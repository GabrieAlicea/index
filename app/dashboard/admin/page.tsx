import { AlertTriangle, ShieldCheck, Users, Wrench } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ count: pendingMechanics }, { count: totalMechanics }, { count: totalCustomers }, { count: openDisputes }] =
    await Promise.all([
      supabase
        .from("mechanic_profiles")
        .select("profile_id", { count: "exact", head: true })
        .eq("approval_status", "pending_review"),
      supabase.from("mechanic_profiles").select("profile_id", { count: "exact", head: true }),
      supabase.from("customer_profiles").select("profile_id", { count: "exact", head: true }),
      supabase.from("disputes").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-text">Admin Overview</h1>
        <p className="mt-1 text-sm text-text-muted">Platform health at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShieldCheck} label="Pending mechanic approvals" value={String(pendingMechanics ?? 0)} />
        <StatCard icon={Wrench} label="Total mechanics" value={String(totalMechanics ?? 0)} />
        <StatCard icon={Users} label="Total customers" value={String(totalCustomers ?? 0)} />
        <StatCard icon={AlertTriangle} label="Open disputes" value={String(openDisputes ?? 0)} />
      </div>
    </div>
  );
}
