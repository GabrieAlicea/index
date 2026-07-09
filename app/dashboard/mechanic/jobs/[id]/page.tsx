import { notFound } from "next/navigation";
import { MapPin, Navigation } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompleteJobButton } from "@/components/dashboard/mechanic/complete-job-button";
import { MapView } from "@/components/maps/map-view";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const COMPLETABLE_STATUSES = new Set(["accepted", "en_route", "arrived", "in_progress"]);

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
    .select("id, status, total, created_at, address_id")
    .eq("id", id)
    .eq("mechanic_id", user!.id)
    .single();

  if (!job) notFound();

  const { data: address } = await supabase
    .from("addresses")
    .select("lat, lng, line1")
    .eq("id", job.address_id)
    .single();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="min-h-[420px] overflow-hidden bg-surface">
        {address?.lat && address?.lng ? (
          <MapView
            markers={[
              {
                id: "customer",
                lat: address.lat,
                lng: address.lng,
                label: address.line1,
                color: "success",
              },
            ]}
          />
        ) : (
          <div className="flex h-full min-h-[420px] items-center justify-center text-center text-text-faint">
            <div>
              <MapPin className="mx-auto size-8" />
              <p className="mt-2 text-sm">Location pending.</p>
            </div>
          </div>
        )}
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
          {address?.lat && address?.lng ? (
            <Button asChild className="mt-4 w-full" variant="secondary">
              <a
                href={`https://www.openstreetmap.org/directions?to=${address.lat}%2C${address.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation className="size-4" />
                Navigate to Customer
              </a>
            </Button>
          ) : (
            <Button className="mt-4 w-full" variant="secondary" disabled>
              <Navigation className="size-4" />
              Navigate to Customer
            </Button>
          )}
          {COMPLETABLE_STATUSES.has(job.status) && (
            <div className="mt-3">
              <CompleteJobButton jobId={job.id} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
