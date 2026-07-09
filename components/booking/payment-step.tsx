"use client";

import * as React from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";

import { createBookingPaymentIntent } from "@/app/(booking)/book/payment-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStripe } from "@/lib/stripe/client";

function PaymentForm({
  subtotal,
  submitting,
  onConfirmed,
}: {
  subtotal: number;
  submitting: boolean;
  onConfirmed: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = React.useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    setPaying(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message ?? "Payment details are incomplete.");
      setPaying(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message ?? "Payment could not be authorized.");
      setPaying(false);
      return;
    }

    if (!paymentIntent || paymentIntent.status !== "requires_capture") {
      toast.error("Payment was not authorized. Please try again.");
      setPaying(false);
      return;
    }

    onConfirmed(paymentIntent.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement />
      <Button size="lg" onClick={handlePay} disabled={!stripe || paying || submitting}>
        {paying || submitting ? "Processing…" : `Authorize $${subtotal.toFixed(2)} & Book`}
      </Button>
      <p className="text-center text-xs text-text-faint">
        Your card is authorized now and only charged once the job is marked complete.
      </p>
    </div>
  );
}

export function PaymentStep({
  serviceIds,
  submitting,
  onConfirmed,
}: {
  serviceIds: string[];
  submitting: boolean;
  onConfirmed: (paymentIntentId: string) => void;
}) {
  const [state, setState] = React.useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ready"; clientSecret: string; subtotal: number }
  >({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;

    createBookingPaymentIntent(serviceIds).then((result) => {
      if (cancelled) return;
      if ("error" in result) {
        setState({ status: "error", message: result.error });
      } else {
        setState({ status: "ready", clientSecret: result.clientSecret, subtotal: result.subtotal });
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceIds.join(",")]);

  if (state.status === "loading") {
    return (
      <Card className="flex items-center justify-center p-8 text-sm text-text-faint">
        Preparing payment…
      </Card>
    );
  }

  if (state.status === "error") {
    return (
      <Card className="p-6 text-sm text-danger">{state.message}</Card>
    );
  }

  return (
    <Card className="p-6">
      <Elements
        stripe={getStripe()}
        options={{ clientSecret: state.clientSecret, appearance: { theme: "night" } }}
      >
        <PaymentForm subtotal={state.subtotal} submitting={submitting} onConfirmed={onConfirmed} />
      </Elements>
    </Card>
  );
}
