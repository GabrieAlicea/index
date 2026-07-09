import { MapView } from "@/components/maps/map-view";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function LiveMapPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, status, address_id")
    .in("status", ["searching", "accepted", "en_route", "arrived", "in_progress"]);

  const addressIds = (jobs ?? []).map((j) => j.address_id);
  const { data: addresses } =
    addressIds.length > 0
      ? await supabase.from("addresses").select("id, lat, lng, line1").in("id", addressIds)
      : { data: [] };

  const markers = (addresses ?? [])
    .filter((a) => a.lat && a.lng)
    .map((a) => ({
      id: a.id,
      lat: a.lat as number,
      lng: a.lng as number,
      label: a.line1,
      color: "success" as const,
    }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Live Jobs Map</h1>
        <p className="mt-1 text-sm text-text-muted">
          {markers.length > 0
            ? `${markers.length} active job${markers.length === 1 ? "" : "s"} right now.`
            : "No active jobs right now — showing the Orlando launch metro."}
        </p>
      </div>
      <Card className="min-h-[480px] overflow-hidden bg-surface">
        <MapView markers={markers} zoom={11} />
      </Card>
    </div>
  );
}
