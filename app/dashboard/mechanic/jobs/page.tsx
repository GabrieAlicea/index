import Link from "next/link";
import { Wrench, Zap } from "lucide-react";

import { AcceptJobButton } from "@/components/dashboard/mechanic/accept-job-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function MechanicJobsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: myJobs }, { data: openJobs }] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, status, total, created_at")
      .eq("mechanic_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("jobs")
      .select("id, status, total, created_at, scheduling_type")
      .eq("status", "searching")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-text">Jobs</h1>
        <p className="mt-1 text-sm text-text-muted">Available jobs, active jobs, and history.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text">Available now</h2>
        {openJobs && openJobs.length > 0 ? (
          <div className="mt-3 divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
            {openJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  {job.scheduling_type === "asap" && <Zap className="size-4 text-warning" />}
                  <div>
                    <p className="text-sm font-medium text-text">
                      {job.scheduling_type === "asap" ? "ASAP request" : "Scheduled job"}
                    </p>
                    <p className="text-xs text-text-faint">
                      {new Date(job.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-text">${Number(job.total).toFixed(2)}</p>
                  <AcceptJobButton jobId={job.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              icon={Wrench}
              title="No open jobs right now"
              body="Go online and check back — new requests show up here as customers book."
              actionLabel="Go to Availability"
              actionHref="/dashboard/mechanic/availability"
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text">Your jobs</h2>
        {myJobs && myJobs.length > 0 ? (
          <div className="mt-3 divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
            {myJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/mechanic/jobs/${job.id}`}
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
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-text-faint">You haven&apos;t accepted any jobs yet.</p>
        )}
      </div>
    </div>
  );
}
