"use server";

import { revalidatePath } from "next/cache";

import { getStripeClient } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export type JobActionState = { error?: string; success?: boolean } | null;

// Manual stand-in for the dispatch wave engine (see docs/REVVY_PRD.md §8.3,
// not built yet): any approved, online mechanic can claim a `searching` job
// directly. accept_job() is still the race-safe guard — only the first
// mechanic whose call lands while the job is still `searching` wins.
export async function acceptJob(jobId: string): Promise<JobActionState> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_job", { p_job_id: jobId });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/mechanic/jobs");
  revalidatePath(`/dashboard/mechanic/jobs/${jobId}`);
  return { success: true };
}

export async function completeJob(jobId: string): Promise<JobActionState> {
  const stripe = getStripeClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: job } = await supabase
    .from("jobs")
    .select("id, mechanic_id, stripe_payment_intent_id")
    .eq("id", jobId)
    .single();

  if (!job) return { error: "Job not found." };
  if (job.mechanic_id !== user.id) return { error: "Not authorized to complete this job." };

  let transferId: string | undefined;

  if (stripe && job.stripe_payment_intent_id) {
    const { data: payment } = await supabase
      .from("payments")
      .select("mechanic_payout_amount, status")
      .eq("job_id", jobId)
      .single();

    if (payment && payment.status === "requires_capture") {
      try {
        await stripe.paymentIntents.capture(job.stripe_payment_intent_id);
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Could not capture payment." };
      }

      const { data: mechanicProfile } = await supabase
        .from("mechanic_profiles")
        .select("stripe_connect_account_id, stripe_payouts_enabled")
        .eq("profile_id", user.id)
        .single();

      if (mechanicProfile?.stripe_connect_account_id && mechanicProfile.stripe_payouts_enabled) {
        try {
          const transfer = await stripe.transfers.create({
            amount: Math.round(Number(payment.mechanic_payout_amount) * 100),
            currency: "usd",
            destination: mechanicProfile.stripe_connect_account_id,
            transfer_group: jobId,
          });
          transferId = transfer.id;
        } catch (err) {
          // Payment is already captured at this point — a failed transfer
          // means the mechanic gets paid out later once their Stripe
          // account is fully set up, not that the job failed. Surface it
          // but don't block completion.
          console.error("Transfer failed after capture:", err);
        }
      }
    }
  }

  const { error } = await supabase.rpc("complete_job", {
    p_job_id: jobId,
    p_stripe_transfer_id: transferId ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/mechanic/jobs");
  revalidatePath(`/dashboard/mechanic/jobs/${jobId}`);
  revalidatePath("/dashboard/mechanic/payouts");
  revalidatePath("/dashboard/mechanic");
  return { success: true };
}
