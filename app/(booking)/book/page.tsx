import type { Metadata } from "next";

import { BookingWizard, type BookingCategory } from "@/components/booking/booking-wizard";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Book a Service",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; category?: string }>;
}) {
  const { mode, category } = await searchParams;
  const user = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: vehicles }, { data: addresses }, { data: categories }] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, year, make, model")
      .eq("customer_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("addresses")
      .select("id, label, line1, city, state, is_default")
      .eq("customer_id", user!.id)
      .order("is_default", { ascending: false }),
    supabase
      .from("service_categories")
      .select("id, name, slug, description, services(id, name, base_price, price_type)")
      .order("sort_order"),
  ]);

  return (
    <BookingWizard
      vehicles={vehicles ?? []}
      addresses={addresses ?? []}
      categories={(categories ?? []) as unknown as BookingCategory[]}
      defaultAsap={mode === "asap"}
      defaultCategorySlug={category}
    />
  );
}
