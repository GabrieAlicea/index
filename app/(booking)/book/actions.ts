"use server";

import { redirect } from "next/navigation";

import { sendBookingConfirmationEmail } from "@/lib/notifications/email";
import { geocodeAddress, toPointWkt } from "@/lib/maps/geocode";
import { createClient } from "@/lib/supabase/server";
import { CreateBookingSchema } from "@/lib/validations/booking";

export type BookingFormState = { error?: string } | null;

export async function createBooking(input: unknown): Promise<BookingFormState> {
  const parsed = CreateBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid booking details." };
  }

  const { addressId, newAddress, vehicleId, serviceIds, schedulingType, scheduledAt } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to book a service." };
  }

  let resolvedAddressId = addressId;

  if (!resolvedAddressId) {
    if (!newAddress) {
      return { error: "Provide a service address." };
    }

    const coords = await geocodeAddress(newAddress);
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .insert({
        customer_id: user.id,
        line1: newAddress.line1,
        city: newAddress.city,
        state: newAddress.state,
        postal_code: newAddress.postalCode,
        location: toPointWkt(coords),
        lat: coords?.lat ?? null,
        lng: coords?.lon ?? null,
      })
      .select("id")
      .single();

    if (addressError || !address) {
      return { error: addressError?.message ?? "Could not save address." };
    }
    resolvedAddressId = address.id;
  }

  // Prices are always recomputed server-side from the catalog — the client
  // never gets to dictate what it pays (see docs/REVVY_PRD.md §14 Security).
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, base_price")
    .in("id", serviceIds);

  if (servicesError || !services || services.length === 0) {
    return { error: "Selected services could not be found." };
  }

  const subtotal = services.reduce((sum, s) => sum + Number(s.base_price ?? 0), 0);
  const platformFee = Math.round(subtotal * 0.1 * 100) / 100;

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      customer_id: user.id,
      vehicle_id: vehicleId,
      address_id: resolvedAddressId,
      status: schedulingType === "asap" ? "searching" : "scheduled",
      scheduling_type: schedulingType,
      scheduled_at: scheduledAt ?? null,
      subtotal,
      platform_fee: platformFee,
      total: subtotal,
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return { error: jobError?.message ?? "Could not create booking." };
  }

  const jobServiceRows = services.map((s) => ({
    job_id: job.id,
    service_id: s.id,
    price: Number(s.base_price ?? 0),
  }));
  await supabase.from("job_services").insert(jobServiceRows);
  await supabase.from("job_status_history").insert({
    job_id: job.id,
    status: schedulingType === "asap" ? "searching" : "scheduled",
    changed_by: user.id,
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  if (profile) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendBookingConfirmationEmail({
      to: profile.email,
      customerName: profile.full_name,
      serviceNames: services.map((s) => s.name),
      total: subtotal,
      schedulingType,
      appointmentUrl: `${siteUrl}/dashboard/customer/appointments/${job.id}`,
    });
  }

  redirect(`/dashboard/customer/appointments/${job.id}`);
}
