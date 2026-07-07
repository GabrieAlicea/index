"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { VehicleSchema } from "@/lib/validations/vehicle";

export type VehicleFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

export async function addVehicle(
  _prevState: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  const parsed = VehicleSchema.safeParse({
    year: formData.get("year"),
    make: formData.get("make"),
    model: formData.get("model"),
    vin: formData.get("vin") || undefined,
    mileage: formData.get("mileage") || undefined,
    engine: formData.get("engine") || undefined,
    licensePlate: formData.get("licensePlate") || undefined,
    color: formData.get("color") || undefined,
    transmission: formData.get("transmission") || undefined,
    fuelType: formData.get("fuelType") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to add a vehicle." };
  }

  const { year, make, model, vin, mileage, engine, licensePlate, color, transmission, fuelType } =
    parsed.data;

  const { error } = await supabase.from("vehicles").insert({
    customer_id: user.id,
    year,
    make,
    model,
    vin,
    mileage,
    engine,
    license_plate: licensePlate,
    color,
    transmission,
    fuel_type: fuelType,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/customer/vehicles");
  revalidatePath("/dashboard/customer");
  return null;
}

export async function deleteVehicle(vehicleId: string) {
  const supabase = await createClient();
  await supabase.from("vehicles").delete().eq("id", vehicleId);
  revalidatePath("/dashboard/customer/vehicles");
  revalidatePath("/dashboard/customer");
}
