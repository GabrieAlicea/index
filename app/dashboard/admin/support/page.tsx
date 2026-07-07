import { LifeBuoy } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSupportPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, subject, status, priority, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Support Tickets</h1>
        <p className="mt-1 text-sm text-text-muted">Customer and mechanic support requests.</p>
      </div>

      {tickets && tickets.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-text">{t.subject}</p>
                <p className="text-xs text-text-faint capitalize">{t.priority} priority</p>
              </div>
              <span className="text-xs capitalize text-text-faint">{t.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={LifeBuoy} title="No support tickets" body="Tickets submitted through Contact or Support will appear here." />
      )}
    </div>
  );
}
