import { Heart } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function FavoritesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Favorite Mechanics</h1>
        <p className="mt-1 text-sm text-text-muted">Request the same mechanic on future bookings.</p>
      </div>
      <EmptyState
        icon={Heart}
        title="No favorites yet"
        body="After a completed job, you can favorite your mechanic to request them again."
      />
    </div>
  );
}
