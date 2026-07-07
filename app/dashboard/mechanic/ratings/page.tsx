import { Star } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function MechanicRatingsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: mechanicProfile } = await supabase
    .from("mechanic_profiles")
    .select("rating_avg, rating_count")
    .eq("profile_id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Ratings</h1>
        <p className="mt-1 text-sm text-text-muted">
          {mechanicProfile?.rating_count
            ? `${mechanicProfile.rating_avg.toFixed(1)} average across ${mechanicProfile.rating_count} reviews`
            : "No ratings yet"}
        </p>
      </div>
      <EmptyState
        icon={Star}
        title="No reviews yet"
        body="Customer reviews appear here after each completed job."
      />
    </div>
  );
}
