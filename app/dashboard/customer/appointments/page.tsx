import { Calendar } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function AppointmentsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, status, scheduling_type, scheduled_at, total, created_at")
    .eq("customer_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Appointments</h1>
        <p className="mt-1 text-sm text-text-muted">Your service history and upcoming bookings.</p>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={`/dashboard/customer/appointments/${job.id}`}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.03]"
            >
              <div>
                <p className="text-sm font-medium capitalize text-text">
                  {job.status.replace("_", " ")}
                </p>
                <p className="text-xs text-text-faint">
                  {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm font-semibold text-text">${Number(job.total).toFixed(2)}</p>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No appointments yet"
          body="Once you book a service, it will show up here with full status history."
          actionLabel="Book a Service"
          actionHref="/book"
        />
      )}
    </div>
  );
}
