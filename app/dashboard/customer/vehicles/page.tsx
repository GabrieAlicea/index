import { Car } from "lucide-react";

import { AddVehicleDialog } from "@/components/dashboard/customer/add-vehicle-dialog";
import { VehicleCard } from "@/components/dashboard/customer/vehicle-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function VehiclesPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, year, make, model, mileage, license_plate, color")
    .eq("customer_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Vehicles</h1>
          <p className="mt-1 text-sm text-text-muted">Manage the vehicles you book service for.</p>
        </div>
        <AddVehicleDialog />
      </div>

      {vehicles && vehicles.length > 0 ? (
        <div className="flex flex-col gap-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Car}
          title="No vehicles yet"
          body="Add a vehicle to speed up booking — we'll remember the details for next time."
        />
      )}
    </div>
  );
}
