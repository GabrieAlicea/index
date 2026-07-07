import { notFound } from "next/navigation";
import { MapPin, Navigation } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function MechanicJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, status, total, created_at")
    .eq("id", id)
    .eq("mechanic_id", user!.id)
    .single();

  if (!job) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="flex min-h-[420px] items-center justify-center bg-surface">
        <div className="text-center text-text-faint">
          <MapPin className="mx-auto size-8" />
          <p className="mt-2 text-sm">Customer location and navigation appear here.</p>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <Badge variant="primary" className="capitalize">
            {job.status.replace("_", " ")}
          </Badge>
          <p className="mt-3 text-2xl font-semibold text-text">
            {formatCurrency(job.total * 100)}
          </p>
          <p className="text-xs text-text-faint">
            Booked {new Date(job.created_at).toLocaleString()}
          </p>
          <Button className="mt-4 w-full" disabled>
            <Navigation className="size-4" />
            Navigate to Customer
          </Button>
        </Card>
      </div>
    </div>
  );
}
