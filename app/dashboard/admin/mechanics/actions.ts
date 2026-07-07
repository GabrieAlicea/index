"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { MechanicApprovalStatus } from "@/types/database";

export type AdminActionState = { error?: string; success?: boolean } | null;

export async function reviewMechanic(
  mechanicId: string,
  decision: MechanicApprovalStatus,
  reason?: string
): Promise<AdminActionState> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("approve_mechanic", {
    p_mechanic_id: mechanicId,
    p_decision: decision,
    p_reason: reason ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/admin/mechanics");
  revalidatePath(`/dashboard/admin/mechanics/${mechanicId}`);
  return { success: true };
}
