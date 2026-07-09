"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Car, MapPin, Zap } from "lucide-react";
import { toast } from "sonner";

import { createBooking } from "@/app/(booking)/book/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentStep } from "@/components/booking/payment-step";
import { StepperHeader } from "@/components/booking/stepper-header";
import { formatCurrency } from "@/lib/utils";

export type BookingVehicle = { id: string; year: number; make: string; model: string };
export type BookingAddress = {
  id: string;
  label: string | null;
  line1: string;
  city: string;
  state: string;
  is_default: boolean;
};
export type BookingService = {
  id: string;
  name: string;
  base_price: number | null;
  price_type: "fixed" | "estimate" | "quote_only";
};
export type BookingCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  services: BookingService[];
};

type NewAddress = { line1: string; city: string; state: string; postalCode: string };

export function BookingWizard({
  vehicles,
  addresses,
  categories,
  defaultAsap,
  defaultCategorySlug,
}: {
  vehicles: BookingVehicle[];
  addresses: BookingAddress[];
  categories: BookingCategory[];
  defaultAsap?: boolean;
  defaultCategorySlug?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [addressId, setAddressId] = React.useState<string | null>(
    addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? null
  );
  const [newAddress, setNewAddress] = React.useState<NewAddress>({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [usingNewAddress, setUsingNewAddress] = React.useState(addresses.length === 0);
  const [vehicleId, setVehicleId] = React.useState<string | null>(vehicles[0]?.id ?? null);
  const [selectedServiceIds, setSelectedServiceIds] = React.useState<Set<string>>(
    new Set(
      defaultCategorySlug
        ? (categories.find((c) => c.slug === defaultCategorySlug)?.services[0]?.id
            ? [categories.find((c) => c.slug === defaultCategorySlug)!.services[0].id]
            : [])
        : []
    )
  );
  const [schedulingType, setSchedulingType] = React.useState<"asap" | "scheduled">(
    defaultAsap ? "asap" : "asap"
  );
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const allServices = categories.flatMap((c) => c.services);
  const selectedServices = allServices.filter((s) => selectedServiceIds.has(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + Number(s.base_price ?? 0), 0);

  function toggleService(id: string) {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function canProceed() {
    if (step === 0) return usingNewAddress ? Boolean(newAddress.line1 && newAddress.city && newAddress.state && newAddress.postalCode) : Boolean(addressId);
    if (step === 1) return Boolean(vehicleId);
    if (step === 2) return selectedServiceIds.size > 0;
    if (step === 3) return schedulingType === "asap" || Boolean(scheduledDate && scheduledTime);
    return true;
  }

  async function handleConfirm(stripePaymentIntentId: string) {
    if (!vehicleId) {
      toast.error("Select a vehicle before confirming.");
      return;
    }
    setSubmitting(true);
    const scheduledAt =
      schedulingType === "scheduled" && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;

    const result = await createBooking({
      addressId: usingNewAddress ? undefined : addressId ?? undefined,
      newAddress: usingNewAddress ? newAddress : undefined,
      vehicleId,
      serviceIds: Array.from(selectedServiceIds),
      schedulingType,
      scheduledAt,
      stripePaymentIntentId,
    });

    if (result?.error) {
      setSubmitting(false);
      toast.error(result.error);
    }
    // On success, createBooking redirects server-side.
  }

  return (
    <div>
      <StepperHeader current={step} />

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-text">Where is your car?</h1>
          {addresses.length > 0 && !usingNewAddress && (
            <div className="flex flex-col gap-2">
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAddressId(a.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    addressId === a.id ? "border-primary/50 bg-primary/10" : "border-white/10 bg-surface"
                  }`}
                >
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text">{a.label || "Address"}</p>
                    <p className="text-xs text-text-faint">
                      {a.line1}, {a.city}, {a.state}
                    </p>
                  </div>
                </button>
              ))}
              <Button variant="ghost" size="sm" className="self-start" onClick={() => setUsingNewAddress(true)}>
                + Use a different address
              </Button>
            </div>
          )}
          {(usingNewAddress || addresses.length === 0) && (
            <Card className="p-5">
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="line1">Street address</Label>
                  <Input
                    id="line1"
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress((p) => ({ ...p, line1: e.target.value }))}
                    placeholder="221B Baker Street"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 grid gap-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Orlando"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))}
                      placeholder="FL"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="postalCode">ZIP code</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))}
                    placeholder="32801"
                  />
                </div>
              </div>
              {addresses.length > 0 && (
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => setUsingNewAddress(false)}>
                  ← Use a saved address instead
                </Button>
              )}
            </Card>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-text">Your vehicle</h1>
          {vehicles.length > 0 ? (
            <div className="flex flex-col gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    vehicleId === v.id ? "border-primary/50 bg-primary/10" : "border-white/10 bg-surface"
                  }`}
                >
                  <Car className="size-4 shrink-0 text-primary" />
                  <p className="text-sm font-medium text-text">
                    {v.year} {v.make} {v.model}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center gap-3 p-8 text-center">
              <Car className="size-8 text-text-faint" />
              <p className="text-sm text-text-muted">
                You don&apos;t have any saved vehicles yet. Add one to continue booking.
              </p>
              <Button asChild size="sm">
                <Link href="/dashboard/customer/vehicles">Add a Vehicle</Link>
              </Button>
            </Card>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-semibold text-text">Choose a service</h1>
          {categories.map((category) => (
            <div key={category.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-faint">
                {category.name}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {category.services.map((service) => {
                  const checked = selectedServiceIds.has(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition-colors ${
                        checked ? "border-primary/50 bg-primary/10" : "border-white/10 bg-surface"
                      }`}
                    >
                      <span className="text-sm text-text">{service.name}</span>
                      <span className="whitespace-nowrap text-xs text-text-faint">
                        {service.base_price ? formatCurrency(service.base_price * 100) : "Quote"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-text">When do you need this?</h1>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSchedulingType("asap")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-6 transition-colors ${
                schedulingType === "asap" ? "border-primary/50 bg-primary/10" : "border-white/10 bg-surface"
              }`}
            >
              <Zap className="size-5 text-warning" />
              <span className="text-sm font-medium text-text">ASAP</span>
              <span className="text-xs text-text-faint">Usually 30–60 min</span>
            </button>
            <button
              onClick={() => setSchedulingType("scheduled")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-6 transition-colors ${
                schedulingType === "scheduled" ? "border-primary/50 bg-primary/10" : "border-white/10 bg-surface"
              }`}
            >
              <Calendar className="size-5 text-primary" />
              <span className="text-sm font-medium text-text">Schedule Later</span>
              <span className="text-xs text-text-faint">Pick a date and time</span>
            </button>
          </div>

          {schedulingType === "scheduled" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-text">Review &amp; confirm</h1>
          <Card className="p-5">
            <div className="flex items-start gap-3 border-b border-white/8 pb-4">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm text-text-muted">
                {usingNewAddress
                  ? `${newAddress.line1}, ${newAddress.city}, ${newAddress.state} ${newAddress.postalCode}`
                  : addresses.find((a) => a.id === addressId)?.line1}
              </p>
            </div>
            <div className="flex items-start gap-3 border-b border-white/8 py-4">
              <Car className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm text-text-muted">
                {(() => {
                  const v = vehicles.find((v) => v.id === vehicleId);
                  return v ? `${v.year} ${v.make} ${v.model}` : "—";
                })()}
              </p>
            </div>
            <div className="flex flex-col gap-2 border-b border-white/8 py-4">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{s.name}</span>
                  <span className="text-text">
                    {s.base_price ? formatCurrency(s.base_price * 100) : "Quote"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 text-base font-semibold">
              <span className="text-text">Total</span>
              <span className="text-text">{formatCurrency(subtotal * 100)}</span>
            </div>
            <p className="mt-1 text-xs text-text-faint">Includes tax &amp; platform fee. Charged on completion.</p>
          </Card>
          <PaymentStep
            serviceIds={Array.from(selectedServiceIds)}
            submitting={submitting}
            onConfirmed={handleConfirm}
          />
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        {step < 4 && (
          <Button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={!canProceed()}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
