import { Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, description, services(id, name, base_price, price_type, is_active)")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Service Categories</h1>
        <p className="mt-1 text-sm text-text-muted">The catalog customers book from.</p>
      </div>

      <div className="flex flex-col gap-4">
        {(categories ?? []).map((category) => {
          const services = (category.services ?? []) as unknown as {
            id: string;
            name: string;
            base_price: number | null;
            price_type: string;
            is_active: boolean;
          }[];
          return (
            <div key={category.id} className="rounded-2xl border border-white/8 bg-surface p-5">
              <div className="flex items-center gap-3">
                <Wrench className="size-4 text-primary" />
                <h2 className="font-semibold text-text">{category.name}</h2>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-faint">
                        {s.base_price ? `$${s.base_price}` : "Quote"}
                      </span>
                      <Badge variant={s.is_active ? "success" : "default"}>
                        {s.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
