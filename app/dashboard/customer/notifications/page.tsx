import { Bell } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, read_at, created_at")
    .eq("profile_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Notifications</h1>
        <p className="mt-1 text-sm text-text-muted">Updates about your bookings and account.</p>
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border border-white/8 p-4 ${n.read_at ? "bg-surface" : "bg-primary/5"}`}
            >
              <p className="text-sm font-medium text-text">{n.title}</p>
              {n.body && <p className="mt-0.5 text-sm text-text-muted">{n.body}</p>}
              <p className="mt-1 text-xs text-text-faint">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          body="Booking updates, mechanic messages, and receipts will show up here."
        />
      )}
    </div>
  );
}
