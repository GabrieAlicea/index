"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type AvailabilityFormState = { error?: string; success?: boolean } | null;

const RadiusSchema = z.object({
  serviceRadiusMiles: z.coerce.number().min(1).max(100),
});

export async function updateServiceRadius(
  _prevState: AvailabilityFormState,
  formData: FormData
): Promise<AvailabilityFormState> {
  const parsed = RadiusSchema.safeParse({
    serviceRadiusMiles: formData.get("serviceRadiusMiles"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("mechanic_profiles")
    .update({ service_radius_miles: parsed.data.serviceRadiusMiles })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/mechanic/availability");
  return { success: true };
}

export async function toggleServiceCategory(categoryId: string, enabled: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: services } = await supabase
    .from("services")
    .select("id, base_price")
    .eq("category_id", categoryId);

  if (!services || services.length === 0) return { error: "No services in this category." };

  if (enabled) {
    const rows = services.map((s) => ({
      mechanic_id: user.id,
      service_id: s.id,
      custom_price: s.base_price,
    }));
    const { error } = await supabase.from("mechanic_services").upsert(rows);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("mechanic_services")
      .delete()
      .eq("mechanic_id", user.id)
      .in(
        "service_id",
        services.map((s) => s.id)
      );
    if (error) return { error: error.message };
  }

  revalidatePath("/dashboard/mechanic/availability");
  return { success: true };
}
