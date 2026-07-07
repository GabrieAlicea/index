"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type MechanicFormState = { error?: string; success?: boolean } | null;

const AvailabilitySchema = z.object({
  online: z.coerce.boolean(),
});

export async function setAvailability(online: boolean): Promise<MechanicFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const parsed = AvailabilitySchema.parse({ online });

  const { error } = await supabase
    .from("mechanic_profiles")
    .update({ availability: parsed.online ? "online" : "offline" })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/mechanic");
  revalidatePath("/dashboard/mechanic/availability");
  return { success: true };
}

const MechanicDetailsSchema = z.object({
  bio: z.string().trim().max(1000).optional(),
  yearsExperience: z.coerce.number().int().min(0).max(80).optional(),
  vanDescription: z.string().trim().max(200).optional(),
  serviceRadiusMiles: z.coerce.number().min(1).max(100).optional(),
});

export async function updateMechanicDetails(
  _prevState: MechanicFormState,
  formData: FormData
): Promise<MechanicFormState> {
  const parsed = MechanicDetailsSchema.safeParse({
    bio: formData.get("bio") || undefined,
    yearsExperience: formData.get("yearsExperience") || undefined,
    vanDescription: formData.get("vanDescription") || undefined,
    serviceRadiusMiles: formData.get("serviceRadiusMiles") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("mechanic_profiles")
    .update({
      bio: parsed.data.bio,
      years_experience: parsed.data.yearsExperience,
      van_description: parsed.data.vanDescription,
      service_radius_miles: parsed.data.serviceRadiusMiles,
    })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/mechanic/profile");
  return { success: true };
}
