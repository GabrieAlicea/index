"use client";

import { useTransition } from "react";
import { Car, Trash2 } from "lucide-react";

import { deleteVehicle } from "@/app/dashboard/customer/vehicles/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function VehicleCard({
  vehicle,
}: {
  vehicle: {
    id: string;
    year: number;
    make: string;
    model: string;
    mileage: number | null;
    license_plate: string | null;
    color: string | null;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Car className="size-5" />
        </div>
        <div>
          <p className="font-medium text-text">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <p className="text-xs text-text-faint">
            {[
              vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : null,
              vehicle.color,
              vehicle.license_plate,
            ]
              .filter(Boolean)
              .join(" · ") || "No additional details"}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={() => startTransition(() => deleteVehicle(vehicle.id))}
        aria-label="Remove vehicle"
      >
        <Trash2 className="size-4 text-text-faint hover:text-danger" />
      </Button>
    </Card>
  );
}
