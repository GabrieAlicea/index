import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: addresses } = await supabase
    .from("addresses")
    .select("id, label, line1, city, state, is_default")
    .eq("customer_id", user!.id)
    .order("is_default", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Saved Addresses</h1>
        <p className="mt-1 text-sm text-text-muted">Locations we can dispatch a mechanic to.</p>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-surface p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="font-medium text-text">{address.label || "Address"}</p>
                  <p className="text-xs text-text-faint">
                    {address.line1}, {address.city}, {address.state}
                  </p>
                </div>
              </div>
              {address.is_default && <span className="text-xs text-primary">Default</span>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          body="Addresses you use when booking a service are saved here for next time."
        />
      )}
    </div>
  );
}
