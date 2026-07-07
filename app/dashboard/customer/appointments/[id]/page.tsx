import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Pending Payment",
  searching: "Finding a mechanic",
  scheduled: "Scheduled",
  accepted: "Mechanic Accepted",
  en_route: "Mechanic En Route",
  arrived: "Mechanic Arrived",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, status, total, subtotal, platform_fee, created_at")
    .eq("id", id)
    .eq("customer_id", user!.id)
    .single();

  if (!job) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="flex min-h-[420px] items-center justify-center bg-surface">
        <div className="text-center text-text-faint">
          <MapPin className="mx-auto size-8" />
          <p className="mt-2 text-sm">Live map appears here once a mechanic is en route.</p>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <Badge variant="primary">{STATUS_LABEL[job.status] ?? job.status}</Badge>
          <p className="mt-3 text-sm text-text-muted">
            Booked {new Date(job.created_at).toLocaleString()}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4 text-sm">
            <span className="text-text-muted">Subtotal</span>
            <span className="text-text">{formatCurrency(job.subtotal * 100)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">Platform fee</span>
            <span className="text-text">{formatCurrency(job.platform_fee * 100)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-2 text-sm font-semibold">
            <span className="text-text">Total</span>
            <span className="text-text">{formatCurrency(job.total * 100)}</span>
          </div>
        </Card>

        {job.status !== "completed" && job.status !== "cancelled" && (
          <Card className="p-5">
            <p className="text-sm font-medium text-text">Your mechanic</p>
            <p className="mt-1 text-sm text-text-faint">
              Assigned once a mechanic accepts this job.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" disabled>
                <Phone className="size-3.5" /> Call
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" disabled>
                <MessageCircle className="size-3.5" /> Message
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
