"use server";

import { getStripeClient } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export type ConnectOnboardingResult = { error: string } | { url: string };

export async function startStripeOnboarding(): Promise<ConnectOnboardingResult> {
  const stripe = getStripeClient();
  if (!stripe) return { error: "Payments are not configured yet. Contact support." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: mechanicProfile } = await supabase
    .from("mechanic_profiles")
    .select("stripe_connect_account_id")
    .eq("profile_id", user.id)
    .single();

  let accountId = mechanicProfile?.stripe_connect_account_id ?? undefined;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: profile?.email,
      business_type: "individual",
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      metadata: { supabase_user_id: user.id },
    });
    accountId = account.id;
    await supabase
      .from("mechanic_profiles")
      .update({ stripe_connect_account_id: accountId })
      .eq("profile_id", user.id);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/dashboard/mechanic/payouts`,
    return_url: `${siteUrl}/dashboard/mechanic/payouts`,
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}
