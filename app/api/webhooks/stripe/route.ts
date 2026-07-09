import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { getStripeClient } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/service";

// Keeps local `payments`/`mechanic_profiles` rows in sync with Stripe's
// async state. Needs STRIPE_WEBHOOK_SECRET, which requires a public URL to
// register in the Stripe dashboard — see docs/REVVY_PRD.md §8.5 and the
// note in .env.example. Until that's set, this route accepts unsigned
// bodies (dev-only fallback) so the handler logic can still be exercised
// locally with the Stripe CLI's `stripe listen --forward-to`.
export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    console.warn("STRIPE_WEBHOOK_SECRET not set — accepting unverified webhook body (dev only).");
    event = JSON.parse(body) as Stripe.Event;
  }

  const supabase = createServiceClient();
  if (!supabase) {
    console.error("SUPABASE_SERVICE_ROLE_KEY not set — cannot process webhook.");
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await supabase.from("payments").update({ status: "failed" }).eq("stripe_payment_intent_id", intent.id);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (typeof charge.payment_intent === "string") {
        await supabase
          .from("payments")
          .update({ status: charge.amount_refunded === charge.amount ? "refunded" : "partially_refunded", refunded_at: new Date().toISOString() })
          .eq("stripe_payment_intent_id", charge.payment_intent);
      }
      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await supabase
        .from("mechanic_profiles")
        .update({ stripe_payouts_enabled: Boolean(account.payouts_enabled) })
        .eq("stripe_connect_account_id", account.id);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
