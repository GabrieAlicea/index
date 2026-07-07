import { Users } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customer_profiles")
    .select("profile_id, created_at, profiles!inner(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Customers</h1>
        <p className="mt-1 text-sm text-text-muted">All registered customer accounts.</p>
      </div>

      {customers && customers.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {customers.map((c) => {
            const profile = c.profiles as unknown as { full_name: string; email: string };
            return (
              <div key={c.profile_id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-text">{profile.full_name}</p>
                  <p className="text-xs text-text-faint">{profile.email}</p>
                </div>
                <p className="text-xs text-text-faint">
                  Joined {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Users} title="No customers yet" body="Customer accounts will appear here as they sign up." />
      )}
    </div>
  );
}
