import { AlertCircle, Star, Wallet, Wrench } from "lucide-react";

import { AvailabilityToggle } from "@/components/dashboard/mechanic/availability-toggle";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

const APPROVAL_COPY: Record<string, { label: string; tone: string }> = {
  pending_review: {
    label: "Your application is under review. We'll email you within 2–3 business days.",
    tone: "text-warning",
  },
  needs_more_info: {
    label: "We need more information to approve your application. Check your email.",
    tone: "text-warning",
  },
  rejected: {
    label: "Your application was not approved. Contact support for details.",
    tone: "text-danger",
  },
  suspended: {
    label: "Your account is suspended. Contact support for details.",
    tone: "text-danger",
  },
};

export default async function MechanicOverviewPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: mechanicProfile } = await supabase
    .from("mechanic_profiles")
    .select("approval_status, availability, rating_avg, jobs_completed")
    .eq("profile_id", user!.id)
    .single();

  const firstName = user?.full_name?.split(" ")[0] || "there";
  const approvalNotice =
    mechanicProfile && mechanicProfile.approval_status !== "approved"
      ? APPROVAL_COPY[mechanicProfile.approval_status]
      : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text">Welcome back, {firstName}</h1>
          <p className="mt-1 text-sm text-text-muted">Here&apos;s your activity at a glance.</p>
        </div>
        {mechanicProfile?.approval_status === "approved" && (
          <AvailabilityToggle initialOnline={mechanicProfile.availability === "online"} />
        )}
      </div>

      {approvalNotice && (
        <div className={`flex items-center gap-3 rounded-xl border border-white/8 bg-surface px-5 py-4 text-sm ${approvalNotice.tone}`}>
          <AlertCircle className="size-4 shrink-0" />
          {approvalNotice.label}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wrench} label="Jobs completed" value={String(mechanicProfile?.jobs_completed ?? 0)} />
        <StatCard icon={Wallet} label="Earnings this week" value="$0.00" />
        <StatCard
          icon={Star}
          label="Average rating"
          value={mechanicProfile?.rating_avg ? mechanicProfile.rating_avg.toFixed(1) : "—"}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text">Job feed</h2>
        <div className="mt-4">
          <EmptyState
            icon={Wrench}
            title={mechanicProfile?.approval_status === "approved" ? "No jobs yet" : "Approval required"}
            body={
              mechanicProfile?.approval_status === "approved"
                ? "Go online to start receiving nearby job offers."
                : "You'll be able to receive jobs once your application is approved."
            }
          />
        </div>
      </div>
    </div>
  );
}
