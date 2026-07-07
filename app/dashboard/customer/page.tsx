import Link from "next/link";
import { Calendar, Car, PlusCircle, Receipt, Wrench, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function CustomerOverviewPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { count: vehicleCount } = await supabase
    .from("vehicles")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", user!.id);

  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text">Welcome back, {firstName}</h1>
          <p className="mt-1 text-sm text-text-muted">
            Here&apos;s what&apos;s happening with your vehicles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/book?mode=asap">
              <Zap className="size-4 text-warning" />
              ASAP Service
            </Link>
          </Button>
          <Button asChild>
            <Link href="/book">Book a Service</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Calendar} label="Upcoming appointments" value="0" />
        <StatCard icon={Car} label="Vehicles saved" value={String(vehicleCount ?? 0)} />
        <StatCard icon={Receipt} label="Total spent" value="$0.00" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text">Upcoming appointments</h2>
        <div className="mt-4">
          <EmptyState
            icon={Wrench}
            title="No appointments yet"
            body="When you book a service, you'll be able to track your mechanic and manage the job right here."
            actionLabel="Book Your First Service"
            actionHref="/book"
          />
        </div>
      </div>

      {(vehicleCount ?? 0) === 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text">Your garage</h2>
          <div className="mt-4">
            <EmptyState
              icon={PlusCircle}
              title="Add your first vehicle"
              body="Save your vehicle's details once so booking a service takes seconds."
              actionLabel="Add a Vehicle"
              actionHref="/dashboard/customer/vehicles"
            />
          </div>
        </div>
      )}
    </div>
  );
}
