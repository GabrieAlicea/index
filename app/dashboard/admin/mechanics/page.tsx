import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { createClient } from "@/lib/supabase/server";

const STATUS_VARIANT: Record<string, "warning" | "success" | "danger" | "default"> = {
  pending_review: "warning",
  approved: "success",
  rejected: "danger",
  needs_more_info: "warning",
  suspended: "danger",
};

export default async function AdminMechanicsPage() {
  const supabase = await createClient();

  const { data: mechanics } = await supabase
    .from("mechanic_profiles")
    .select("profile_id, approval_status, created_at, profiles!inner(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Mechanic Approvals</h1>
        <p className="mt-1 text-sm text-text-muted">Review applications and manage mechanic accounts.</p>
      </div>

      {mechanics && mechanics.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {mechanics.map((m) => {
            const profile = m.profiles as unknown as { full_name: string; email: string };
            return (
              <a
                key={m.profile_id}
                href={`/dashboard/admin/mechanics/${m.profile_id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div>
                  <p className="text-sm font-medium text-text">{profile.full_name}</p>
                  <p className="text-xs text-text-faint">{profile.email}</p>
                </div>
                <Badge variant={STATUS_VARIANT[m.approval_status] ?? "default"} className="capitalize">
                  {m.approval_status.replace("_", " ")}
                </Badge>
              </a>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ShieldCheck}
          title="No mechanic applications yet"
          body="Applications submitted through Become a Mechanic will appear here for review."
        />
      )}
    </div>
  );
}
