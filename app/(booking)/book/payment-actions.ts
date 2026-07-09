"use server";

import { getStripeClient } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export type CreatePaymentIntentResult =
  | { error: string }
  | { clientSecret: string; paymentIntentId: string; subtotal: number };

/**
 * Authorizes (does not capture) a card for the selected services. Capture
 * happens only once a mechanic marks the job complete (see completeJob in
 * app/dashboard/mechanic/jobs/actions.ts) — see docs/REVVY_PRD.md §8.5.
 */
export async function createBookingPaymentIntent(
  serviceIds: string[]
): Promise<CreatePaymentIntentResult> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { error: "Payments are not configured yet. Contact support." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to book a service." };

  // Prices are always recomputed server-side from the catalog.
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, base_price, price_type")
    .in("id", serviceIds);

  if (servicesError || !services || services.length === 0) {
    return { error: "Selected services could not be found." };
  }

  const chargeable = services.filter((s) => s.price_type !== "quote_only" && s.base_price != null);
  if (chargeable.length === 0) {
    return {
      error:
        "The selected service requires a custom quote before it can be charged — contact support to proceed.",
    };
  }

  const subtotal = chargeable.reduce((sum, s) => sum + Number(s.base_price ?? 0), 0);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: customerProfile } = await supabase
    .from("customer_profiles")
    .select("stripe_customer_id")
    .eq("profile_id", user.id)
    .single();

  let stripeCustomerId = customerProfile?.stripe_customer_id ?? undefined;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email,
      name: profile?.full_name,
      metadata: { supabase_user_id: user.id },
    });
    stripeCustomerId = customer.id;
    await supabase
      .from("customer_profiles")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("profile_id", user.id);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(subtotal * 100),
    currency: "usd",
    customer: stripeCustomerId,
    capture_method: "manual",
    automatic_payment_methods: { enabled: true },
    metadata: { supabase_user_id: user.id },
  });

  if (!paymentIntent.client_secret) {
    return { error: "Could not initialize payment." };
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    subtotal,
  };
}
