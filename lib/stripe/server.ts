import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return client;
}

/** Platform commission, applied consistently everywhere money is computed. */
export const PLATFORM_FEE_RATE = 0.1;
