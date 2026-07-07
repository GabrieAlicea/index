import { AvailabilityToggle } from "@/components/dashboard/mechanic/availability-toggle";
import { RadiusForm } from "@/components/dashboard/mechanic/radius-form";
import { ServiceCategoryToggle } from "@/components/dashboard/mechanic/service-category-toggle";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function AvailabilityPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: mechanicProfile } = await supabase
    .from("mechanic_profiles")
    .select("availability, service_radius_miles")
    .eq("profile_id", user!.id)
    .single();

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, description")
    .order("sort_order");

  const { data: myServices } = await supabase
    .from("mechanic_services")
    .select("service_id, services!inner(category_id)")
    .eq("mechanic_id", user!.id);

  const enabledCategoryIds = new Set(
    (myServices ?? []).map(
      (row) => (row.services as unknown as { category_id: string }).category_id
    )
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text">Availability</h1>
          <p className="mt-1 text-sm text-text-muted">
            Control when you receive jobs and how far you&apos;ll travel.
          </p>
        </div>
        <AvailabilityToggle initialOnline={mechanicProfile?.availability === "online"} />
      </div>

      <Card className="p-5">
        <RadiusForm initialRadius={mechanicProfile?.service_radius_miles ?? 15} />
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-text">Services you offer</h2>
        <p className="mt-1 text-sm text-text-muted">
          Toggle the categories of work you want to receive jobs for.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(categories ?? []).map((category) => (
            <ServiceCategoryToggle
              key={category.id}
              categoryId={category.id}
              name={category.name}
              description={category.description}
              initialEnabled={enabledCategoryIds.has(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
