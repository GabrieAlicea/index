import { MessageSquare } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";

export default function MechanicMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Messages</h1>
        <p className="mt-1 text-sm text-text-muted">In-app conversations with your customers.</p>
      </div>
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        body="Messages tied to an active job will show up here."
      />
    </div>
  );
}
