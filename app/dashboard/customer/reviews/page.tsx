import { Star } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function CustomerReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Reviews</h1>
        <p className="mt-1 text-sm text-text-muted">Reviews you&apos;ve left for mechanics.</p>
      </div>
      <EmptyState
        icon={Star}
        title="No reviews yet"
        body="After a completed job, you'll be prompted to rate your mechanic."
      />
    </div>
  );
}
